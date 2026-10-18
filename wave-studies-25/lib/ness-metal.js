import * as THREE from 'three';
import {createSteelStudio,createSteelWire} from 'ness-wire-model';
import {createWireBurst} from 'ness-wire-burst';

export async function createMetalWave(canvas,variant='wire') {
 const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'high-performance'});
 renderer.setClearColor(0,0);renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.08;
 const studio=createSteelStudio(renderer),scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(34,1,.1,150);scene.environment=studio.environment;
 const key=new THREE.DirectionalLight('#fff6e7',2.1);key.position.set(-4,8,16);scene.add(key);
 const rim=new THREE.DirectionalLight('#dce7ed',1.2);rim.position.set(5,-3,8);scene.add(rim);
 const wire=createSteelWire(studio,{split:true,segments:240,barbs:10}),group=wire.group;scene.add(group);
 const burst=createWireBurst(group,studio.silver),stage=canvas.closest('.hero').querySelector('.hero-stage');
 let p=0,motion=true,visible=true,raf=0,last=0,time=0,frozen=null,viewHalf=13,span=22;
 const pointer=new THREE.Vector2(),soft=new THREE.Vector2(),zero=new THREE.Vector2(),a=new THREE.Vector3(),b=new THREE.Vector3();
 const clamp=n=>Math.max(0,Math.min(1,n)),range=(v,a,b)=>clamp((v-a)/(b-a)),ease=v=>v*v*(3-2*v);
 function path(t,out,side=t<.5?-1:1,uncut=false){
  const x=(t-.5)*span*2,u=x/viewHalf*.5+.5,phase=motion?(frozen??time*.24):0;
  const tension=motion?ease(range(p,.16,.285)):0,bend=1-tension*.86;
  out.set(x,-bend*(2.95*Math.sin(u*Math.PI*2-.80-phase)+.35*Math.sin(u*Math.PI*4+.25-phase*1.4)),bend*(1.1*Math.sin(u*Math.PI*2+.4-phase)+.25*Math.sin(u*Math.PI*4-phase)));
  if(motion&&!uncut){
   const release=range(p,.29,.52),open=1-Math.pow(1-release,3),whip=Math.sin(release*Math.PI*2.5)*Math.exp(-release*4),weight=Math.pow(clamp(1-Math.abs(x)/(viewHalf*1.2)),1.8);
   out.x+=side*(Math.min(4.4,viewHalf*.35)*open+.65*whip)*weight;
   out.y-=side*(2.7*open+1.3*whip)*weight;
   out.z+=(.75*open+.8*whip)*weight;
  }
  return out;
 }
 function draw(now){
  raf=0;if(!visible||document.hidden)return;
  if(last&&motion)time+=Math.min((now-last)/1000,.045);last=now;
  if(p<.29||!motion)frozen=null;else if(frozen===null)frozen=time*.24;
  wire.update(path);group.rotation.z=-.065+p*.09;group.position.y=.8-p*1.65;
  path(.5,a,1,true);burst.update(p,a,motion);
  soft.lerp(motion?pointer:zero,.055);camera.position.set(soft.x*.42,.6+soft.y*.3,24);camera.lookAt(0,.3,0);
  renderer.render(scene,camera);canvas.dataset.ready='true';
  path(0,a);path(1,b);a.applyMatrix4(group.matrixWorld).project(camera);b.applyMatrix4(group.matrixWorld).project(camera);canvas.dataset.edgeCoverage=String(a.x< -1.05&&b.x>1.05);
  path(.5,a,-1);path(.5,b,1);canvas.dataset.breakGap=a.distanceTo(b).toFixed(2);canvas.dataset.fracture=!motion?'rest':p<.16?'wave':p<.29?'tension':p<.45?'burst':'split';
  const moving=motion&&(p<.29||soft.distanceToSquared(pointer)>.00002);canvas.dataset.renderState=motion?(moving?'moving':'held'):'still';
  if(moving)raf=requestAnimationFrame(draw);
 }
 function kick(){if(!raf&&visible)raf=requestAnimationFrame(draw);}
 function resize(){
  const r=canvas.getBoundingClientRect();if(!r.width||!r.height)return;
  renderer.setPixelRatio(Math.min(devicePixelRatio,innerWidth<900?1.5:1.75,Math.sqrt(4000000/(r.width*r.height))));renderer.setSize(r.width,r.height,false);
  camera.aspect=r.width/r.height;camera.fov=44-10*clamp((camera.aspect-.65)/.95);camera.updateProjectionMatrix();viewHalf=Math.tan(camera.fov*Math.PI/360)*26*camera.aspect;span=Math.max(17,viewHalf+9);
  wire.setBarbPositions(Array.from({length:10},(_,i)=>.5+((i+.5)/10-.5)*viewHalf/span));kick();
 }
 const point=e=>{if(e.pointerType==='touch')return;const r=stage.getBoundingClientRect();pointer.set((e.clientX/r.width-.5)*2,(e.clientY-r.top)/r.height-.5);kick();};stage.addEventListener('pointermove',point,{passive:true});
 const ro=new ResizeObserver(resize);ro.observe(canvas);
 const io=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;last=0;if(visible)kick();else{cancelAnimationFrame(raf);raf=0;}},{rootMargin:'50px'});io.observe(canvas);
 const visibility=()=>{last=0;if(!document.hidden)kick();};document.addEventListener('visibilitychange',visibility);resize();
 return {setProgress(v){p=v;kick();},setMotion(v){motion=v;kick();},dispose(){cancelAnimationFrame(raf);ro.disconnect();io.disconnect();stage.removeEventListener('pointermove',point);document.removeEventListener('visibilitychange',visibility);burst.dispose();wire.dispose();studio.dispose();renderer.dispose();}};
}
