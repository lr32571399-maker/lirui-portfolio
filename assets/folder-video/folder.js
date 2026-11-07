(()=>{
 'use strict';
 const config={open:'assets/folder-video/open.webm',close:'assets/folder-video/close.webm',cover:'assets/folder-video/cover.png',end:'assets/folder-video/open.png',durationSeconds:3,closeSeconds:2,returnLeadSeconds:.55,categories:{ui:'UI 设计',ip:'IP 设计',graphic:'品牌视觉'}};
 const scene=document.querySelector('.directory-scene');if(!scene)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 // Polygon vertices measured on the 1280x720 final video frame. Percentage coordinates
 // share the video's 16:9 canvas, so hit regions follow the same responsive scaling.
 const cardRegions={ui:[[7,14],[34,3],[38,59],[14,65]],ip:[[38,4],[65,5],[61,61],[39.5,60]],graphic:[[67.5,7],[94,18],[86,68],[62,61]]};
 const player=document.createElement('div');player.className='folder-player';player.innerHTML=`<img src="${config.cover}" alt="蓝色作品集文件夹封面"><video muted playsinline preload="auto" aria-hidden="true"></video><video muted playsinline preload="auto" aria-hidden="true"></video><button class="folder-cover-button" aria-label="打开作品文件夹" aria-expanded="false" type="button"></button><div class="folder-hits" hidden><button type="button" data-folder-category="ui" aria-label="UI 设计"></button><button type="button" data-folder-category="ip" aria-label="IP 设计"></button><button type="button" data-folder-category="graphic" aria-label="品牌视觉"></button></div>`;
 scene.append(player);
 const close=document.createElement('button');close.type='button';close.className='folder-close';close.textContent='收起文件夹 ×';close.hidden=true;scene.append(close);
 const message=document.createElement('p');message.className='folder-message';message.setAttribute('role','status');message.hidden=true;scene.append(message);
 const image=player.querySelector('img'),[opening,closing]=player.querySelectorAll('video'),button=player.querySelector('.folder-cover-button'),hits=player.querySelector('.folder-hits');
 let state='closed',ticket=0,selected=null;
 let keyboardNavigation=false;
 function setKeyboardNavigation(value){keyboardNavigation=value;player.classList.toggle('keyboard-navigation',value);}
 document.addEventListener('pointerdown',()=>setKeyboardNavigation(false),true);
 document.addEventListener('keydown',event=>{if(['Tab','Enter',' '].includes(event.key))setKeyboardNavigation(true);},true);
 for(const [v,src] of [[opening,config.open],[closing,config.close]]){v.src=src;v.muted=true;v.defaultMuted=true;v.playsInline=true;v.addEventListener('loadedmetadata',()=>{v.playbackRate=v.duration/(v===closing?config.closeSeconds:config.durationSeconds);});}
 function waitFrame(v,time=0){return new Promise((resolve,reject)=>{
  const timer=setTimeout(()=>done(Error('媒体加载超时')),8000);
  function done(e){clearTimeout(timer);for(const type of ['loadeddata','seeked','error'])v.removeEventListener(type,check);e?reject(e):resolve();}
  function check(){if(v.error)done(Error('媒体加载失败'));else if(v.readyState>=2&&!v.seeking&&Math.abs(v.currentTime-time)<.12)done();}
  for(const type of ['loadeddata','seeked','error'])v.addEventListener(type,check);if(Math.abs(v.currentTime-time)>.01)v.currentTime=time;check();
 });}
 function showOnly(v){for(const el of [opening,closing])el.classList.toggle('is-playing',el===v);image.style.visibility=v?'hidden':'visible';}
 function finishOpen(){opening.pause();state='open';hits.hidden=false;close.disabled=false;message.hidden=false;message.textContent='选择作品分类';}
 function finishClose(){opening.pause();closing.pause();image.src=config.cover;showOnly(null);state='closed';selected=null;scene.classList.remove('is-folder-focused');player.classList.remove('is-expanded');button.hidden=false;button.setAttribute('aria-expanded','false');close.hidden=true;hits.hidden=true;message.hidden=true;button.focus({preventScroll:true});}
 async function open(){
  if(state!=='closed'||window.directoryTransition?.getState().state!=='directory')return;
  const id=++ticket;state='opening';scene.classList.remove('is-folder-returning');button.hidden=true;button.setAttribute('aria-expanded','true');scene.classList.add('is-folder-focused');player.classList.add('is-expanded');close.hidden=false;close.disabled=false;close.focus({preventScroll:true});
  if(reduced.matches){image.src=config.end;showOnly(null);finishOpen();return;}
  try{await waitFrame(opening);if(ticket!==id)return;showOnly(opening);await opening.play();}
  catch{if(ticket!==id)return;image.src=config.end;showOnly(null);finishOpen();message.textContent='展开动画未能播放，已显示分类封面。';}
 }
 async function collapse(){
  if(state==='closed'||state==='closing')return;
  const wasOpening=state==='opening',progress=opening.duration?Math.min(1,opening.currentTime/opening.duration):0;
  const id=++ticket;state='closing';scene.classList.add('is-folder-returning');opening.pause();hits.hidden=true;message.hidden=true;close.disabled=true;
  if(reduced.matches){finishClose();return;}
  try{await waitFrame(closing);if(ticket!==id)return;
   if(wasOpening){const time=Math.min(closing.duration-1/24,Math.max(0,(1-progress)*closing.duration));await waitFrame(closing,time);if(ticket!==id)return;}
   showOnly(closing);await closing.play();}catch{if(ticket===id)finishClose();}
 }
 function updateReturn(){if(state==='closing'&&(closing.duration-closing.currentTime)/closing.playbackRate<=config.returnLeadSeconds){scene.classList.remove('is-folder-focused');player.classList.remove('is-expanded');}}
 closing.addEventListener('timeupdate',updateReturn);
 // Follow decoded frames so the return starts consistently, independent of timeupdate frequency.
 if(closing.requestVideoFrameCallback){closing.addEventListener('playing',()=>{const frame=()=>{updateReturn();if(state==='closing'&&!closing.paused)closing.requestVideoFrameCallback(frame);};closing.requestVideoFrameCallback(frame);});}
 opening.addEventListener('ended',()=>{if(state==='opening')finishOpen();});closing.addEventListener('ended',()=>{if(state==='closing')finishClose();});
 button.addEventListener('click',open);close.addEventListener('click',collapse);
 for(const hit of hits.querySelectorAll('button')){
  hit.style.clipPath='polygon('+cardRegions[hit.dataset.folderCategory].map(([x,y])=>x+'% '+y+'%').join(',')+')';
  hit.addEventListener('click',()=>{selected=hit.dataset.folderCategory;window.openPortfolioWorks(selected);});
 }
 document.addEventListener('keydown',e=>{if(state!=='closed'&&e.key==='Escape'&&!document.querySelector('.works-dialog[open]')){e.preventDefault();e.stopImmediatePropagation();collapse();}},true);
 // The folder owns navigation while focused; the sofa scene must not leave underneath it.
 document.addEventListener('keydown',e=>{if(state!=='closed'&&!document.querySelector('.works-dialog[open]')&&['ArrowUp','PageUp','Home'].includes(e.key)){e.preventDefault();e.stopImmediatePropagation();}},true);
 document.addEventListener('visibilitychange',()=>{if(document.hidden){opening.pause();closing.pause();}else{const v=state==='opening'?opening:state==='closing'?closing:null;if(v)v.play().catch(()=>{if(state==='opening'){image.src=config.end;showOnly(null);finishOpen();}else finishClose();});}});
 window.portfolioFolder={open,close:collapse,isExpanded:()=>state!=='closed',getState:()=>({state,selected,openingTime:opening.currentTime,closingTime:closing.currentTime,rate:opening.playbackRate,duration:opening.duration,paused:opening.paused})};
})();
