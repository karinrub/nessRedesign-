import {createMetalWave} from 'ness-metal';
import {createWireGrid} from 'ness-grid';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const clamp=n=>Math.min(1,Math.max(0,n)),range=(n,a,b)=>clamp((n-a)/(b-a));
const smooth=t=>t*t*(3-2*t),phase=(n,a,b)=>smooth(range(n,a,b)),mix=(a,b,t)=>a+(b-a)*t;
const reduced=matchMedia('(prefers-reduced-motion: reduce)'),params=new URLSearchParams(location.search);
let grid,userNavigated=false;
const isStatic=()=>reduced.matches||document.documentElement.classList.contains('aperture-static');
const moments={hero:0,transition:2.9,opening:2.98,together:4.05,karin:6.5,isabella:9.45};
const dom={stage:$('.story-stage'),shared:$('.shared-shot'),sharedPhoto:$('.shared-photo'),sharedText:$('.shared-text'),shade:$('.photo-shade'),karin:$('.karin-shot'),karinPhoto:$('.karin-photo'),karinName:$('.karin-name'),karinReading:$('.karin-reading'),isabella:$('.isabella-shot'),isabellaPhoto:$('.isabella-photo'),isabellaName:$('.isabella-name'),isabellaReading:$('.isabella-reading'),chrome:$('.story-chrome'),label:$('.bottom-label'),next:$('.bottom-next'),play:$('.play-button')};
let wire,frame=0,playFrame=0,playing=false,lastV=0,viewport={w:innerWidth,h:innerHeight},activeMoment,heroLive=true,staticDrawn=false;
document.body.dataset.capture=String(params.get('capture')==='1');
const op=(el,value)=>{const n=clamp(value);el.style.opacity=n;el.style.visibility=n>.001?'visible':'hidden';};
const tx=(el,value)=>el.style.transform=value;
const move=(el,x=0,y=0,scale=1)=>tx(el,'translate3d('+x+'vw,'+y+'vh,0) scale('+scale+')');
function rect(el,a,b,p){
 const r=a.map((n,i)=>mix(n,b[i],p));
 el.style.inset='auto';el.style.left=r[0]+'%';el.style.top=r[1]+'%';el.style.width=r[2]+'%';el.style.height=r[3]+'%';
}
function renderHero(v){
 const p=clamp(v/1.7),split=phase(p,.18,.36),reveal=phase(p,.44,.62),exit=phase(p,.84,1);
 tx($('.hero-good'),`translate3d(${-split*45}%,${-split*70}%,${split*-250}px) rotate(${-split*7}deg)`);
 tx($('.hero-work'),`translate3d(${split*48}%,${split*80}%,${split*180}px) rotate(${split*8}deg)`);
 op($('.hero-good'),1-range(p,.22,.35));op($('.hero-work'),1-range(p,.24,.37));op($('.hero-side'),1-range(p,.20,.35));
 tx($('.hero-seen'),`translate3d(${(1-reveal)*45}%,${exit*-20}%,0) rotate(${(1-reveal)*-9}deg) scale(${1+exit*.14})`);op($('.hero-seen'),reveal*(1-phase(v,1.7,2.0)));
 tx($('.hero-threads'),`translate3d(0,${split*-17}%,80px) rotate(${split*13}deg)`);op($('.hero-threads'),1-range(p,.6,.85));
 op($('#hero-metal'),1-range(p,.72,.89));wire?.setProgress(p);
 op($('.site-header'),1-phase(v,1.55,1.9));op($('.hero-topline'),1-phase(v,1.5,1.8));op($('.hero-footer'),1-phase(v,1.5,1.8));

}
function announce(active){
 if(active===activeMoment)return;
 activeMoment=active;document.body.dataset.moment=active;
 $$('.moment-tools button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.moment===active)));
 const labels={hero:['',''],opening:['TWO PEOPLE. ONE STUDIO.',''],together:['KARIN RUBIN & ISABELLA','Meet Karin <span aria-hidden="true">→</span>'],karin:['CUSTOM WEBSITES + BRAND PHOTOGRAPHY','And Isabella <span aria-hidden="true">→</span>'],isabella:['WOMEN-OWNED / BASED IN MAKAWAO','<a href="mailto:hello@nessmaui.com">Let’s work together <span aria-hidden="true">↗</span></a>']};
 dom.label.textContent=labels[active][0];dom.next.innerHTML=labels[active][1];
}
function staticStory(){
 if(staticDrawn)return;
 staticDrawn=true;
 renderHero(0);
 for(const shot of [dom.shared,dom.karin,dom.isabella]){op(shot,1);shot.setAttribute('aria-hidden','false');}
 for(const el of [dom.sharedPhoto,dom.sharedText,dom.karinPhoto,dom.karinName,dom.karinReading,dom.isabellaPhoto,dom.isabellaName,dom.isabellaReading]){op(el,1);tx(el,'none');}
 op(dom.shade,1);op(dom.stage,1);dom.stage.inert=false;dom.stage.removeAttribute('aria-hidden');
}
function draw(){
 frame=0;
 if(isStatic()){staticStory();return;}
 const v=scrollY/viewport.h;lastV=v;
 staticDrawn=false;
 if(v<2.05){renderHero(v);wire?.setMotion(true);heroLive=true;}
 else if(heroLive){renderHero(2.05);wire?.setMotion(false);heroLive=false;}
 const isabellaExit=phase(v,10.85,11.6);
 op(dom.stage,1-phase(v,11.5,11.8));
 if(v>=11.7)return;
 const mobile=viewport.w<=760;
 const karinRect=mobile?[49,29,45,30]:[64,19,31,66];
 const full=mobile?[17,17,76,43]:[30,17,40,67],encounter=mobile?[23,21,64,35]:[34,22,32,55];
 const opening=phase(v,2.05,2.88),sharedExit=phase(v,4.65,5.4);
 op(dom.shared,v>=1.95&&v<5.72?1:0);
 op(dom.sharedPhoto,phase(v,1.96,2.18)*(1-phase(v,5.4,5.7)));
 rect(dom.sharedPhoto,encounter,full,opening);
 if(v>=4.65)rect(dom.sharedPhoto,full,karinRect,sharedExit);
 op(dom.shade,phase(v,3.05,3.65));
 move(dom.sharedPhoto,0,0);
 op(dom.sharedText,phase(v,3.1,3.65)*(1-phase(v,4.65,5.15)));
 move(dom.sharedText,-phase(v,4.65,5.22)*32,phase(v,4.65,5.22)*7);
 op(dom.karin,v>=4.84&&v<7.7?1:0);
 const karinNameIn=phase(v,4.85,5.43),karinExit=phase(v,7.1,7.68);
 op(dom.karinName,1);
 move(dom.karinName,-(1-karinNameIn)*114-karinExit*120);
 op(dom.karinPhoto,phase(v,5.45,5.85)*(1-phase(v,7.35,7.62)));
 move(dom.karinPhoto,karinExit*42,(1-phase(v,5.45,5.85))*3);
 op(dom.karinReading,phase(v,5.82,6.02)*(1-phase(v,7.1,7.4)));
 move(dom.karinReading,0,(1-phase(v,5.82,6.02))*2);
 op(dom.isabella,v>=7.62?1-isabellaExit:0);
 const isabellaPhotoIn=phase(v,7.63,8.02);
 op(dom.isabellaPhoto,1);
 move(dom.isabellaPhoto,-(1-isabellaPhotoIn)*55);
 op(dom.isabellaName,phase(v,8.02,8.1));
 move(dom.isabellaName,(1-phase(v,8.02,8.5))*100);
 op(dom.isabellaReading,phase(v,8.52,8.78));
 move(dom.isabellaReading,0,(1-phase(v,8.52,8.78))*2);
 op(dom.chrome,phase(v,3.12,3.58)*(1-isabellaExit));
 const active=v<1.95?'hero':v<3.65?'opening':v<4.95?'together':v<7.62?'karin':'isabella';
 announce(active);document.body.dataset.progress=v.toFixed(3);
 dom.stage.setAttribute('aria-hidden',String(v<1.95||v>=11.65));
 op($('.wire-grid'),phase(v,5.45,6.05)*.24);
 if(v>=5.35&&v<11.7)grid?.paint(v,mobile);
 dom.shared.setAttribute('aria-hidden',String(v<1.95||v>=5.72));
 dom.karin.setAttribute('aria-hidden',String(v<4.84||v>=7.7));
 dom.isabella.setAttribute('aria-hidden',String(v<7.62||v>=11.65));
}
function requestDraw(){if(!frame)frame=requestAnimationFrame(draw);}
function stop(){if(!playing)return;playing=false;cancelAnimationFrame(playFrame);dom.play.textContent='Play sequence ▶';}
function go(v,moment){
 stop();
 if(isStatic()){
  const ids={hero:'top',opening:'connection',together:'connection',karin:'karin',isabella:'isabella',transition:'connection'};
  document.getElementById(ids[moment]||'connection').scrollIntoView({behavior:'instant'});announce(moment||'together');return;
 }
 scrollTo({top:v*viewport.h,behavior:'instant'});draw();
}
$$('.moment-tools button').forEach(b=>b.addEventListener('click',()=>{userNavigated=true;go(moments[b.dataset.moment],b.dataset.moment);}));
$$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{
 if(document.documentElement.classList.contains('experience-active'))return;
 if(e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
 const target=a.getAttribute('href');
 const map={'#top':'hero','#connection':'together','#karin':'karin','#isabella':'isabella'};
 if(!map[target])return;
 userNavigated=true;e.preventDefault();const moment=map[target];go(moments[moment],moment);history.replaceState(null,'',target);
}));
dom.play.addEventListener('click',()=>{
 userNavigated=true;
 if(playing){stop();return;}if(isStatic())return;
 go(0,'hero');playing=true;dom.play.textContent='Pause Ⅱ';let began;
 const shots=[[0,0],[800,0],[4800,1.18],[6000,1.18],[7600,1.98],[10500,2.98],[11700,2.98],[14000,4.05],[20700,4.05],[25500,6.5],[38200,6.5],[43200,9.45],[57700,9.45]];
 function tick(now){
  if(!playing)return;began??=now;const elapsed=Math.min(now-began,shots.at(-1)[0]);
  let i=shots.findIndex((s,j)=>j>0&&elapsed<=s[0]);if(i<0)i=shots.length-1;
  const [start,from]=shots[i-1],[end,to]=shots[i],p=end===start?1:smooth(clamp((elapsed-start)/(end-start)));
  scrollTo({top:mix(from,to,p)*viewport.h,behavior:'instant'});draw();
  if(elapsed<shots.at(-1)[0])playFrame=requestAnimationFrame(tick);else stop();
 }
 playFrame=requestAnimationFrame(tick);
});
for(const event of ['wheel','touchstart'])addEventListener(event,()=>{userNavigated=true;stop();},{passive:true});
addEventListener('keydown',e=>{
 if(e.key==='Escape'){stop();return;}
 const scrollingKey=['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '].includes(e.key);
 if(scrollingKey&&!e.target.closest('button,a,input,select,textarea'))stop();
});
addEventListener('scroll',requestDraw,{passive:true});
addEventListener('ness-motion-change',()=>{staticDrawn=false;draw();});
addEventListener('ness-navigate',()=>{userNavigated=true;stop();staticDrawn=false;draw();});
addEventListener('resize',()=>{
 const introWasActive=lastV<11.15&&scrollY/viewport.h<11.15;
 viewport={w:innerWidth,h:innerHeight};
 if(!isStatic()&&introWasActive)scrollTo({top:lastV*viewport.h,behavior:'instant'});
 requestDraw();
},{passive:true});
reduced.addEventListener('change',()=>{
 staticDrawn=false;
 stop();wire?.setMotion(!isStatic());
 if(isStatic())staticStory();else{activeMoment=null;draw();}
});
async function init(){
 await document.fonts.ready;
 draw();
 try{wire=await createMetalWave($('#hero-metal'),'wire');wire.setMotion(!isStatic()&&lastV<2.05);wire.setProgress(clamp(lastV/1.7));document.body.classList.add('metal-ready');}
 catch(e){console.error('Could not load the preserved wire hero',e);}
 try{grid=createWireGrid($('.wire-grid'));}catch(error){console.error('Background wire grid could not load',error);}
 const hash=location.hash.slice(1);
 if(document.documentElement.classList.contains('experience-active')){draw();return;}
 if(window.__nessPreviewRestoring){draw();return;}
 if(!userNavigated&&!hash)go(moments[params.get('m')]??0,params.get('m')||'hero');else if(hash&&['top','connection','karin','isabella'].includes(hash))go(moments[hash==='top'?'hero':hash==='connection'?'together':hash],hash==='top'?'hero':hash==='connection'?'together':hash);else draw();
}
init();

addEventListener('pagehide',event=>{if(!event.persisted){wire?.dispose();grid?.dispose();}});
