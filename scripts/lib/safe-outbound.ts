import {lookup} from 'node:dns/promises';
import type {LookupAddress} from 'node:dns';
import {Agent,request} from 'node:https';
import {isIP,type LookupFunction} from 'node:net';
import {safeHttps} from '../../src/lib/affiliate.ts';

/** Node-only link-check transport. Never import this module into browser code. */
export class OutboundPolicyError extends Error {
  readonly code:string;
  constructor(code:string){super('Outbound link check blocked by '+code);this.name='OutboundPolicyError';this.code=code;}
}

const ipv4Number=(address:string)=>address.split('.').reduce((value,part)=>value*256+Number(part),0);
const withinV4=(value:number,network:string,bits:number)=>Math.floor(value/2**(32-bits))===Math.floor(ipv4Number(network)/2**(32-bits));
function ipv6Number(address:string){
  let normalized=address.toLowerCase();
  if(normalized.includes('.'))normalized=normalized.replace(/(?:\d+\.){3}\d+$/,part=>{
    const n=ipv4Number(part);return Math.floor(n/65536).toString(16)+':'+(n%65536).toString(16);
  });
  const [left,right]=normalized.split('::');
  const leading=left?left.split(':'):[],trailing=right?right.split(':'):[];
  const parts=right===undefined?leading:[...leading,...Array(8-leading.length-trailing.length).fill('0'),...trailing];
  return parts.reduce((value,part)=>(value<<16n)+BigInt('0x'+part),0n);
}
const withinV6=(value:bigint,network:string,bits:number)=>(value>>BigInt(128-bits))===(ipv6Number(network)>>BigInt(128-bits));

/** Conservative global-unicast policy based on the IANA special registries.
 * IPv6 transition, documentation and protocol-assignment ranges are excluded.
 * Public DNS is not itself proof that a business or its content is trustworthy. */
export function isPublicAddress(address:string):boolean{
  if(address.includes('%'))return false;
  const family=isIP(address);
  if(family===4){
    const n=ipv4Number(address);
    return !([
      ['0.0.0.0',8],['10.0.0.0',8],['100.64.0.0',10],['127.0.0.0',8],['169.254.0.0',16],['172.16.0.0',12],
      ['192.0.0.0',24],['192.0.2.0',24],['192.88.99.0',24],['192.168.0.0',16],['198.18.0.0',15],
      ['198.51.100.0',24],['203.0.113.0',24],['224.0.0.0',4],['240.0.0.0',4],
    ]as const).some(([network,bits])=>withinV4(n,network,bits));
  }
  if(family===6){
    const n=ipv6Number(address);
    return withinV6(n,'2000::',3)&&!([
      ['2001::',23],['2001:db8::',32],['2002::',16],['3fff::',20],
    ]as const).some(([network,bits])=>withinV6(n,network,bits));
  }
  return false;
}

function validateAddresses(records:readonly LookupAddress[]){
  if(!records.length)throw new OutboundPolicyError('NO_DNS_ADDRESS');
  if(records.some(record=>isIP(record.address)!==record.family||!isPublicAddress(record.address)))throw new OutboundPolicyError('NON_PUBLIC_ADDRESS');
  return records.map(record=>({address:record.address,family:record.family}));
}

/** The socket receives only the addresses already checked for this request.
 * No second operating-system lookup can replace them between check/connect. */
export function createPinnedLookup(hostname:string,records:readonly LookupAddress[]):LookupFunction{
  const pinned=validateAddresses(records);
  return (requested,options,callback)=>{
    if(requested!==hostname){callback(new OutboundPolicyError('UNEXPECTED_LOOKUP_HOST'),[]);return;}
    const family=options.family==='IPv4'?4:options.family==='IPv6'?6:options.family;
    const addresses=pinned.filter(record=>!family||family===record.family).map(record=>({...record}));
    if(!addresses.length){callback(new OutboundPolicyError('NO_DNS_ADDRESS'),[]);return;}
    if(options.all)callback(null,addresses);
    else callback(null,addresses[0].address,addresses[0].family);
  };
}

export type OutboundResponse={status:number;location?:string;contentType:string|null};
export type OutboundResolver=(hostname:string)=>Promise<readonly LookupAddress[]>;
export type OutboundTransport=(url:URL,addresses:readonly LookupAddress[],signal:AbortSignal)=>Promise<OutboundResponse>;
const resolveAddresses:OutboundResolver=hostname=>lookup(hostname,{all:true,order:'ipv4first'});

const requestHeaders:OutboundTransport=async(url,addresses,signal)=>{
  // An isolated direct agent cannot reuse an unchecked socket or an env proxy.
  const agent=new Agent({keepAlive:false,maxCachedSessions:0,proxyEnv:{}});
  try{return await new Promise<OutboundResponse>((resolve,reject)=>{
    const req=request(url,{
      method:'GET',agent,signal,rejectUnauthorized:true,lookup:createPinnedLookup(url.hostname,addresses),
      maxHeaderSize:32*1024,
      headers:{'User-Agent':'JapaneseCraftJewelry-Link-Check/0.15',Accept:'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.5'},
    },response=>{
      resolve({status:response.statusCode||0,location:response.headers.location,contentType:typeof response.headers['content-type']==='string'?response.headers['content-type']:null});
      // Only headers are needed. Do not buffer or download an unbounded body.
      response.destroy();
    });
    req.once('error',reject);req.end();
  });}finally{agent.destroy();}
};

function abortable<T>(operation:Promise<T>,signal:AbortSignal):Promise<T>{
  return new Promise((resolve,reject)=>{
    const abort=()=>reject(signal.reason);
    if(signal.aborted){abort();return;}
    signal.addEventListener('abort',abort,{once:true});
    operation.then(resolve,reject).finally(()=>signal.removeEventListener('abort',abort));
  });
}

/** No automatic redirects: validate URL and every A/AAAA result at every hop.
 * Injected resolver/transport make hostile-redirect tests network-free. */
export async function checkPublicHttps(value:string,options:{resolve?:OutboundResolver;transport?:OutboundTransport;timeoutMs?:number;maxRedirects?:number}={}){
  const timeoutMs=options.timeoutMs??15000,maxRedirects=options.maxRedirects??5;
  if(!Number.isInteger(timeoutMs)||timeoutMs<1||timeoutMs>60000||!Number.isInteger(maxRedirects)||maxRedirects<0||maxRedirects>10)throw new OutboundPolicyError('INVALID_LIMIT');
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(new DOMException('Link check timed out','TimeoutError')),timeoutMs);
  const resolve=options.resolve||resolveAddresses,transport=options.transport||requestHeaders;
  const visited=new Set<string>(),hops:{url:string;status:number}[]=[];
  let current=value;
  try{
    for(let hop=0;;hop++){
      const safe=current.length<=4096?safeHttps(current):null;
      if(!safe)throw new OutboundPolicyError(hop?'UNSAFE_REDIRECT':'UNSAFE_URL');
      const url=new URL(safe);url.hash='';
      if(visited.has(url.href))throw new OutboundPolicyError('REDIRECT_LOOP');
      visited.add(url.href);controller.signal.throwIfAborted();
      const addresses=validateAddresses(await abortable(resolve(url.hostname),controller.signal));
      controller.signal.throwIfAborted();
      const response=await abortable(transport(url,addresses,controller.signal),controller.signal);
      hops.push({url:url.href,status:response.status});
      if(![301,302,303,307,308].includes(response.status)||!response.location)return {status:response.status,finalUrl:url.href,redirected:hop>0,contentType:response.contentType,hops};
      if(hop>=maxRedirects)throw new OutboundPolicyError('TOO_MANY_REDIRECTS');
      try{current=new URL(response.location,url).href;}catch{throw new OutboundPolicyError('UNSAFE_REDIRECT');}
    }
  }finally{clearTimeout(timer);}
}
