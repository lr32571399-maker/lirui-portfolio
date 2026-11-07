/* Native playback owns this transition. No scroll seeking or blended character frames. */
(()=>{
 'use strict';
 const config={forward:'assets/video/directory-transition.mp4',reverse:'assets/video/directory-transition-reverse.mp4',poster:'assets/about/directory-last.png',rate:1,copyAt:.48,endInset:1/24};
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const scene=document.createElement('section');scene.className='directory-scene';scene.setAttribute('aria-labelledby','directory-heading');scene.setAttribute('aria-hidden','true');scene.inert=true;
 scene.innerHTML=`<img src="${config.poster}" alt="李瑞坐在沙发上使用笔记本电脑" width="1920" height="1080"><video muted playsinline preload="auto" aria-hidden="true"></video><video muted playsinline preload="auto" aria-hidden="true"></video><div class="directory-copy"><p class="directory-label"><b>03</b>SELECTED WORKS / 作品目录</p><h2 id="directory-heading"><span>SELECTED</span><span>WORKS.</span></h2><p>UI 设计 / 品牌视觉 / IP 设计</p></div><button class="directory-back" type="button">返回个人介绍 ↑</button><button class="directory-retry" type="button" hidden>点击继续播放</button>`;
 document.body.append(scene);
 const [forward,reverse]=scene.querySelectorAll('video'),back=scene.querySelector('.directory-back'),retry=scene.querySelector('.directory-retry');
 const next=document.createElement('button');next.className='directory-next';next.type='button';next.textContent='前往结尾 ↓';next.hidden=true;scene.append(next);
 const ending=document.createElement('section');ending.className='portfolio-ending';ending.setAttribute('aria-labelledby','portfolio-ending-heading');ending.setAttribute('aria-hidden','true');ending.inert=true;
 ending.innerHTML='<div class="portfolio-ending-art" role="img" aria-label="人物从沙发上坠落，电脑和设计工具散落在周围"><img src="assets/about/ending-fall.png" alt="" width="1672" height="941"><video src="assets/video/ending-fall.mp4" poster="assets/about/ending-seated.png" muted playsinline preload="auto" aria-hidden="true" hidden></video></div><p class="portfolio-ending-mark">无限进步</p><div class="portfolio-ending-copy"><p>04 / END</p><h2 id="portfolio-ending-heading">THANKS FOR WATCHING.</h2></div><button type="button">返回作品目录 ↑</button>';
 document.body.append(ending);
 const endingBack=ending.querySelector('button');
 const endingVideo=ending.querySelector('video');
 endingVideo.muted=true;
 let state='resume',ticket=0,returnY=0,previousFocus=null;
 for(const [video,src] of [[forward,config.forward],[reverse,config.reverse]]){video.muted=true;video.defaultMuted=true;video.playsInline=true;video.src=src;video.playbackRate=config.rate;}
 const lock=on=>{document.documentElement.style.overflow=on?'hidden':'';};
 function ready(video,time){return new Promise((resolve,reject)=>{
  const timer=setTimeout(()=>done(Error('视频加载超时')),12000);
  function done(error){clearTimeout(timer);for(const event of ['loadeddata','seeked','error'])video.removeEventListener(event,check);error?reject(error):resolve();}
  function check(){if(video.error)return done(Error('视频加载失败'));if(video.readyState>=2&&!video.seeking&&Math.abs(video.currentTime-time)<.12)done();}
  for(const event of ['loadeddata','seeked','error'])video.addEventListener(event,check);
  if(Math.abs(video.currentTime-time)>.02)video.currentTime=time;check();
 });}
 function settle(){forward.pause();reverse.pause();state='directory';scene.classList.add('has-copy');retry.hidden=true;next.hidden=false;back.disabled=false;back.focus({preventScroll:true});}
 function showEnding(){
  if(state!=='directory'||window.portfolioFolder?.isExpanded())return;
  state='ending';ending.inert=false;ending.setAttribute('aria-hidden','false');ending.classList.add('is-visible');
  endingBack.focus({preventScroll:true});scene.inert=true;scene.setAttribute('aria-hidden','true');
  endingVideo.hidden=reduced.matches||Boolean(endingVideo.error);
  ending.classList.toggle('is-settled',endingVideo.hidden);
  if(endingVideo.hidden)return;
  const id=++ticket;
  endingVideo.currentTime=0;
  endingVideo.play().catch(()=>{if(id===ticket)showEndingStill();});
 }
 function hideEnding(){
  ++ticket;endingVideo.pause();
  state='directory';scene.inert=false;scene.setAttribute('aria-hidden','false');next.focus({preventScroll:true});
  ending.classList.remove('is-visible');ending.inert=true;ending.setAttribute('aria-hidden','true');
 }
 function showEndingStill(){
  endingVideo.hidden=true;
  if(state==='ending')ending.classList.add('is-settled');
 }
 endingVideo.addEventListener('error',showEndingStill);
 endingVideo.addEventListener('timeupdate',()=>{
  if(state==='ending'&&endingVideo.currentTime>=2.5)ending.classList.add('is-settled');
 });
 endingVideo.addEventListener('ended',()=>{if(state==='ending'&&endingVideo.ended)ending.classList.add('is-settled');});
 async function enter(){
  if(state!=='resume')return;const id=++ticket;state='loading';returnY=scrollY;previousFocus=document.activeElement;lock(true);back.disabled=true;
  try{
   await ready(forward,0);if(id!==ticket)return;
   reverse.classList.remove('is-active');forward.classList.add('is-active');scene.inert=false;scene.setAttribute('aria-hidden','false');scene.classList.add('is-visible');
   if(reduced.matches){forward.currentTime=Math.max(0,forward.duration-config.endInset);await ready(forward,Math.max(0,forward.duration-config.endInset));settle();return;}
   state='entering';await forward.play();
  }catch(error){
   if(id!==ticket)return;
   if(forward.readyState>=2&&!forward.error){state='blocked';retry.hidden=false;retry.textContent='点击继续播放';}
   else{scene.classList.add('is-visible','has-copy');scene.inert=false;scene.setAttribute('aria-hidden','false');forward.classList.remove('is-active');settle();retry.hidden=false;retry.textContent='视频未加载，点击重试';}
  }
 }
 async function leave(){
  if(window.portfolioFolder?.isExpanded()){window.portfolioFolder.close();return;}
  if(state!=='directory'&&state!=='blocked')return;const id=++ticket;state='returning';back.disabled=true;retry.hidden=next.hidden=true;scene.classList.remove('has-copy');forward.pause();
  if(reduced.matches){finishLeave();return;}
  try{await ready(reverse,0);if(id!==ticket)return;reverse.classList.add('is-active');forward.classList.remove('is-active');await reverse.play();}
  catch{finishLeave();}
 }
 function finishLeave(){reverse.pause();scene.classList.remove('is-visible','has-copy');scene.inert=true;scene.setAttribute('aria-hidden','true');state='resume';lock(false);scrollTo(0,returnY);if(previousFocus?.isConnected)previousFocus.focus({preventScroll:true});}
 forward.addEventListener('timeupdate',()=>{if(state==='entering'&&forward.currentTime/forward.duration>=config.copyAt)scene.classList.add('has-copy');});
 forward.addEventListener('ended',()=>{if(state==='entering')settle();});reverse.addEventListener('ended',()=>{if(state==='returning')finishLeave();});
 back.addEventListener('click',leave);retry.addEventListener('click',()=>{if(state==='blocked'){retry.hidden=true;state='entering';forward.play().catch(()=>{state='blocked';retry.hidden=false;});}else{scene.classList.remove('is-visible','has-copy');state='resume';enter();}});
 next.addEventListener('click',showEnding);endingBack.addEventListener('click',hideEnding);
 document.addEventListener('keydown',event=>{
  if(state==='ending'&&['Escape','ArrowUp','PageUp','Home'].includes(event.key)){event.preventDefault();if(!event.repeat)hideEnding();return;}
  if(state!=='resume'&&['Escape','ArrowUp','PageUp','Home'].includes(event.key)){event.preventDefault();if(!event.repeat)leave();}
 });
 document.addEventListener('visibilitychange',()=>{if(document.hidden){forward.pause();reverse.pause();}else if(state==='entering'||state==='returning'){const video=state==='entering'?forward:reverse;video.play().catch(()=>{if(state==='returning')finishLeave();else{state='blocked';retry.hidden=false;}});}});
 window.directoryTransition={navigate(direction,event){
  if(window.portfolioFolder?.isExpanded()){if(event?.cancelable)event.preventDefault();return true;}
  if(state!=='resume'){
   if(event?.cancelable)event.preventDefault();
   if(state==='ending'){if(direction<0)hideEnding();}
   else if(state==='directory'&&direction>0)showEnding();
   else if(direction<0&&(state==='directory'||state==='blocked'))leave();
   return true;
  }
  const resume=window.resumeStory?.getState();
  if(direction>0&&resume?.resumeMode==='resume'&&resume.progress>=.98){if(event?.cancelable)event.preventDefault();enter();return true;}return false;
 },getState:()=>({state,time:forward.currentTime,duration:forward.duration,paused:forward.paused,reverseTime:reverse.currentTime,returnY,ready:forward.readyState>=2})};
})();
