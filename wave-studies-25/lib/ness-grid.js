import * as THREE from 'three';
import {createSteelStudio,createSteelWire} from 'ness-wire-model';
const clamp=n=>Math.max(0,Math.min(1,n));
const ease=(v,a,b)=>{const t=clamp((v-a)/(b-a));return t*t*(3-2*t);};

// One responsive plane of square cells, using the hero's physical steel strands.
export function createWireGrid(canvas){
 const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});
 renderer.setClearColor(0,0);renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.02;
 const studio=createSteelStudio(renderer);studio.silver.roughness=.3;
 const scene=new THREE.Scene();scene.environment=studio.environment;
 const camera=new THREE.OrthographicCamera(-50,50,30,-30,.1,200);camera.position.set(0,0,80);camera.lookAt(0,0,0);
 const key=new THREE.DirectionalLight('#fff6e7',1.8);key.position.set(-4,8,16);scene.add(key);
 const rim=new THREE.DirectionalLight('#dce7ed',.85);rim.position.set(5,-3,8);scene.add(rim);
 const plane=new THREE.Group();scene.add(plane);let wires=[];
 let width=0,height=0,lastV=6.5,lastMobile=false,disposed=false,geometryDirty=true;
 function build(mobile){
  wires.forEach(({wire})=>{plane.remove(wire.group);wire.dispose();});wires=[];
  const gapX=mobile?12.5:6.25,gapY=gapX*width/height;
  const columns=[],rows=[];
  for(let x=-gapX*.5;x<=100+gapX;x+=gapX)columns.push(x);
  for(let y=-gapY*.5;y<=100+gapY;y+=gapY)rows.push(y);
  for(const [axis,positions] of [['h',rows],['v',columns]]){
   positions.forEach((position,index)=>{
    const wire=createSteelWire(studio,{segments:axis==='h'?448:256,barbs:axis==='h'?5:3,split:false,radius:.23,pitch:4.6});
    wire.setBarbPositions(axis==='h'?[.12,.30,.49,.68,.87]:[.23,.51,.79]);
    plane.add(wire.group);wires.push({wire,axis,position,index});
   });
  }
  canvas.dataset.cellSize=(width*gapX/100).toFixed(1);
 }
 function paint(v,mobile){
  if(disposed||!width||!height)return;
  const rebuild=geometryDirty||mobile!==lastMobile;lastV=v;lastMobile=mobile;
  const scale=mobile?1.05:.58,settle=ease(v,5.35,6.05),drift=(v-6.5)*.35;
  plane.position.y=(1-settle)*height/width*8+drift*height/width;
  plane.rotation.z=-(1-settle)*.015;
  if(rebuild){
   build(mobile);
   for(const {wire,axis,position,index} of wires){
    wire.group.scale.setScalar(scale);
    wire.update((t,out)=>{
     let x,y;
     if(axis==='h'){x=-14+t*128;y=position+Math.sin(t*Math.PI*2+index*.65)*.38;}
     else{x=position+Math.sin(t*Math.PI*2+index*.7)*.38;y=-16+t*132;}
     out.set((x-50)/scale,(50-y)*height/width/scale,(axis==='h'?.28:-.28)/scale);
     return out;
    });
   }
   geometryDirty=false;
  }
  renderer.render(scene,camera);canvas.dataset.ready='true';canvas.dataset.strands=String(wires.length);
 }
 function resize(){
  const r=canvas.getBoundingClientRect();width=r.width;height=r.height;if(!width||!height)return;
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.5,Math.sqrt(2000000/(width*height))));renderer.setSize(width,height,false);
  camera.top=50*height/width;camera.bottom=-camera.top;camera.updateProjectionMatrix();geometryDirty=true;paint(lastV,lastMobile);
 }
 const ro=new ResizeObserver(resize);ro.observe(canvas);resize();
 return {paint,dispose(){disposed=true;ro.disconnect();wires.forEach(({wire})=>wire.dispose());studio.dispose();renderer.dispose();}};
}
