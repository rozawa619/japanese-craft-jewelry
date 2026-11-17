/** Public Google Maps Share embeds only. This is unrelated to advertising
 * consent and does not permit arbitrary iframe providers or map APIs. */
export function reviewedMapEmbedUrl(value:unknown):string|null{
 if(typeof value!=='string'||!value||/[\u0000-\u0020\u007f<>"']/u.test(value))return null;
 try{
  const url=new URL(value);
  if(url.protocol!=='https:'||url.hostname!=='www.google.com'||url.port||url.username||url.password||url.pathname!=='/maps/embed'||url.hash)return null;
  const keys=[...url.searchParams.keys()];
  if(keys.length!==1||keys[0]!=='pb')return null;
  const payload=url.searchParams.get('pb');
  if(!payload||!payload.startsWith('!')||payload.length<20||payload.length>4096||/[\u0000-\u001f\u007f<>]/u.test(payload))return null;
  return url.href;
 }catch{return null;}
}
