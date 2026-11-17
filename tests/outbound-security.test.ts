import test from 'node:test';
import assert from 'node:assert/strict';
import {checkPublicHttps,createPinnedLookup,isPublicAddress,OutboundPolicyError,type OutboundTransport} from '../scripts/lib/safe-outbound.ts';

const publicV4={address:'93.184.216.34',family:4};
const publicV6={address:'2606:4700::1111',family:6};
const response=(status=200,location?:string)=>({status,location,contentType:'text/html'});
const policyCode=(code:string)=>(error:unknown)=>error instanceof OutboundPolicyError&&error.code===code;

test('public-address policy rejects private, link-local, metadata, documentation, multicast and transition ranges',()=>{
  for(const address of ['0.0.0.0','10.0.0.1','100.64.0.1','100.127.255.254','127.0.0.1','169.254.169.254','172.16.0.1','172.31.255.255','192.0.0.1','192.0.2.1','192.88.99.1','192.168.1.1','198.18.0.1','198.19.255.255','198.51.100.1','203.0.113.1','224.0.0.1','239.255.255.255','240.0.0.1','255.255.255.255','::','::1','::ffff:127.0.0.1','::ffff:8.8.8.8','64:ff9b::7f00:1','100::1','2001::1','2001:2::1','2001:db8::1','2002:7f00:1::1','3fff::1','fc00::1','fd12:3456::1','fe80::1','ff02::1','fe80::1%1','not-an-ip'])assert.equal(isPublicAddress(address),false,address);
  for(const address of ['8.8.8.8','93.184.216.34','100.63.255.255','100.128.0.1','172.15.255.255','172.32.0.1','192.0.3.1','198.17.255.255','198.20.0.1','223.255.255.254','2001:4860:4860::8888','2606:4700::1111','2a00:1450::1'])assert.equal(isPublicAddress(address),true,address);
});

test('unsafe initial URL forms never reach even the injected DNS or transport',async()=>{
  let dns=0,network=0;
  for(const url of ['http://shop.example.org/','https://127.0.0.1/','https://2130706433/','https://[::1]/','https://localhost/','https://host.local/','https://shop.example.org:444/','https://user:pass@shop.example.org/','https://shop.example.org\\@evil.test/'])await assert.rejects(checkPublicHttps(url,{resolve:async()=>{dns++;return[publicV4]},transport:async()=>{network++;return response()}}),policyCode('UNSAFE_URL'));
  assert.equal(dns,0);assert.equal(network,0);
});

test('a hostname resolving to any non-public address is blocked before transport',async()=>{
  let network=0;
  for(const records of [[{address:'127.0.0.1',family:4}],[publicV4,{address:'10.0.0.1',family:4}],[publicV6,{address:'fc00::1',family:6}],[{address:'8.8.8.8',family:6}]])await assert.rejects(checkPublicHttps('https://shop.example.org/',{resolve:async()=>records,transport:async()=>{network++;return response()}}),policyCode('NON_PUBLIC_ADDRESS'));
  await assert.rejects(checkPublicHttps('https://shop.example.org/',{resolve:async()=>[],transport:async()=>{network++;return response()}}),policyCode('NO_DNS_ADDRESS'));
  assert.equal(network,0);
});

test('redirects to HTTP, credentials, private literals or private DNS never create a second request',async()=>{
  for(const location of ['http://shop.example.org/','https://127.0.0.1/admin','https://[::1]/','https://user:pass@shop.example.org/','https://internal.example.org/']){
    const requests:string[]=[];const dns:string[]=[];
    await assert.rejects(checkPublicHttps('https://shop.example.org/',{resolve:async host=>{dns.push(host);return host==='internal.example.org'?[{address:'169.254.169.254',family:4}]:[publicV4]},transport:async url=>{requests.push(url.href);return response(302,location)}}),policyCode(location.includes('internal.example.org')?'NON_PUBLIC_ADDRESS':'UNSAFE_REDIRECT'));
    assert.deepEqual(requests,['https://shop.example.org/']);
    assert.equal(dns.includes('127.0.0.1'),false);
  }
});

test('public relative/cross-host redirects retain bounded, inspectable hop records',async()=>{
  const requested:string[]=[];
  const transport:OutboundTransport=async(url,addresses)=>{assert.deepEqual(addresses,[publicV4,publicV6]);requested.push(url.href);return requested.length===1?response(301,'/next'):requested.length===2?response(307,'https://other.example.org/final'):response()};
  const result=await checkPublicHttps('https://shop.example.org/start#ignored',{resolve:async()=>[publicV4,publicV6],transport});
  assert.deepEqual(requested,['https://shop.example.org/start','https://shop.example.org/next','https://other.example.org/final']);assert.equal(result.finalUrl,requested[2]);assert.equal(result.redirected,true);assert.deepEqual(result.hops.map(h=>h.status),[301,307,200]);
});

test('the same host is resolved again on redirects and a rebinding answer is blocked',async()=>{
  let dns=0,network=0;
  await assert.rejects(checkPublicHttps('https://shop.example.org/',{resolve:async()=>++dns===1?[publicV4]:[{address:'10.0.0.1',family:4}],transport:async()=>{network++;return response(302,'/next')}}),policyCode('NON_PUBLIC_ADDRESS'));
  assert.equal(dns,2);assert.equal(network,1);
});

test('socket lookup is pinned to the checked address copies and rejects another hostname',async()=>{
  const records=[{...publicV4},{...publicV6}],pinned=createPinnedLookup('shop.example.org',records);records[0].address='127.0.0.1';
  const all=await new Promise((resolve,reject)=>pinned('shop.example.org',{all:true},(error,addresses)=>error?reject(error):resolve(addresses)));
  assert.deepEqual(all,[publicV4,publicV6]);
  await assert.rejects(new Promise((resolve,reject)=>pinned('other.example.org',{all:true},(error,addresses)=>error?reject(error):resolve(addresses))),policyCode('UNEXPECTED_LOOKUP_HOST'));
  assert.throws(()=>createPinnedLookup('shop.example.org',[{address:'127.0.0.1',family:4}]),policyCode('NON_PUBLIC_ADDRESS'));
});

test('redirect loops and excess hops stop without unbounded requests',async()=>{
  let calls=0;
  await assert.rejects(checkPublicHttps('https://shop.example.org/',{resolve:async()=>[publicV4],transport:async()=>{calls++;return response(302,'/#fragment')}}),policyCode('REDIRECT_LOOP'));assert.equal(calls,1);
  calls=0;
  await assert.rejects(checkPublicHttps('https://shop.example.org/',{maxRedirects:1,resolve:async()=>[publicV4],transport:async()=>response(302,'/hop-'+(++calls))}),policyCode('TOO_MANY_REDIRECTS'));assert.equal(calls,2);
});

test('the whole-chain deadline also bounds a stalled injected DNS lookup',async()=>{
  let network=0;
  await assert.rejects(checkPublicHttps('https://shop.example.org/',{timeoutMs:5,resolve:()=>new Promise(()=>{}),transport:async()=>{network++;return response()}}),{name:'TimeoutError'});assert.equal(network,0);
});
