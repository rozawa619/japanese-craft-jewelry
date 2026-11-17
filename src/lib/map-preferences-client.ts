import{reviewedMapEmbedUrl}from'./map-embed-url';
import{MAP_PREFERENCE_KEY,createMapPreference,restoreMapPreference,parseMapPreference,saveMapPreference,type MapChoice}from'./map-preferences';

function storage(){try{return window.localStorage;}catch{return null;}}
let preference=restoreMapPreference(storage());
let saved=true;
let expiryTimer:ReturnType<typeof setTimeout>|undefined;
function restore(){preference=!saved&&preference?parseMapPreference(JSON.stringify(preference)):restoreMapPreference(storage());render();}
function render(){
 const choice=preference?.choice||'unselected';
 for(const panel of document.querySelectorAll<HTMLElement>('[data-inline-map]')){
  const canvas=panel.querySelector<HTMLElement>('[data-map-canvas]');
  const placeholder=panel.querySelector<HTMLElement>('[data-map-placeholder]');
  const close=panel.querySelector<HTMLButtonElement>('[data-close-map]');
  const open=panel.querySelector<HTMLButtonElement>('[data-load-map]');
  if(!canvas||!placeholder||!close||!open)continue;
  const url=reviewedMapEmbedUrl(panel.dataset.mapEmbed);
  const allowed=choice==='allowed'&&!!url;
  panel.dataset.mapChoice=choice;
  if(allowed&&!canvas.querySelector('iframe')){
   const frame=document.createElement('iframe');
   frame.dataset.inlineMapFrame='';frame.title=panel.dataset.mapTitle||'Google Maps';
   frame.width='540';frame.height='330';frame.loading='lazy';
   frame.referrerPolicy='strict-origin-when-cross-origin';frame.allowFullscreen=true;
   frame.src=url!;canvas.append(frame);
  }else if(!allowed){canvas.replaceChildren();}
  canvas.hidden=!allowed;placeholder.hidden=allowed;close.hidden=!allowed;
  open.setAttribute('aria-expanded',String(allowed));
  for(const status of panel.querySelectorAll<HTMLElement>('[data-map-status]'))status.textContent=(!saved?panel.dataset.mapUnsaved:choice==='allowed'?panel.dataset.mapOpened:choice==='denied'?panel.dataset.mapClosed:panel.dataset.mapUnselected)||'';
 }
 for(const settings of document.querySelectorAll<HTMLElement>('[data-map-settings]')){
  settings.dataset.mapChoice=choice;
  const status=settings.querySelector<HTMLElement>('[data-map-settings-status]');
  if(status)status.textContent=(!saved?settings.dataset.unsaved:choice==='allowed'?settings.dataset.allowed:choice==='denied'?settings.dataset.denied:settings.dataset.unselected)||'';
 }
 if(expiryTimer)clearTimeout(expiryTimer);
 if(preference){expiryTimer=setTimeout(restore,Math.min(preference.expiresAt-Date.now()+5,24*60*60*1000));}
}
function choose(choice:MapChoice,trigger:HTMLElement){
 preference=createMapPreference(choice);saved=saveMapPreference(storage(),preference);render();
 const panel=trigger.closest<HTMLElement>('[data-inline-map]');
 if(panel){const target=panel.querySelector<HTMLElement>(choice==='allowed'?'[data-close-map]':'[data-load-map]');if(target&&!target.hidden)target.focus();}
}
document.addEventListener('click',event=>{
 const target=event.target instanceof Element?event.target.closest<HTMLElement>('[data-load-map],[data-close-map],[data-deny-map],[data-map-allow-all],[data-map-deny-all]'):null;
 if(target)choose(target.matches('[data-load-map],[data-map-allow-all]')?'allowed':'denied',target);
});
window.addEventListener('storage',event=>{if(event.key===MAP_PREFERENCE_KEY||event.key===null){preference=restoreMapPreference(storage());saved=true;render();}});
window.addEventListener('pageshow',restore);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')restore();});
render();
