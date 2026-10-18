import * as THREE from 'three';

// The fragments, their launch directions and their flight are all drawn in code.
// Scroll is the clock: reversing the scroll returns every fragment to the cut.
export function createWireBurst(parent, silver) {
 const count=112,trailCount=64,burst=new THREE.Group();parent.add(burst);
 let seed=8147;
 const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 const clamp=v=>Math.max(0,Math.min(1,v));
 const shardGeometry=new THREE.TetrahedronGeometry(1);
 const shardMaterial=silver.clone();shardMaterial.transparent=true;shardMaterial.depthWrite=false;shardMaterial.roughness=.12;shardMaterial.emissive.set('#596164');shardMaterial.emissiveIntensity=.15;
 const shards=new THREE.InstancedMesh(shardGeometry,shardMaterial,count);shards.frustumCulled=false;burst.add(shards);
 const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(-.2,-.04,0),new THREE.Vector3(0,.05,.02),new THREE.Vector3(.22,-.02,0)]);
 const chipGeometry=new THREE.TubeGeometry(curve,8,.035,6,false);
 const chipMaterial=shardMaterial.clone();const chips=new THREE.InstancedMesh(chipGeometry,chipMaterial,32);chips.frustumCulled=false;burst.add(chips);
 const trailGeometry=new THREE.CylinderGeometry(.014,.004,1,4);
 const trailMaterial=new THREE.MeshBasicMaterial({color:'#e9e1ce',transparent:true,depthWrite:false});
 const trails=new THREE.InstancedMesh(trailGeometry,trailMaterial,trailCount);trails.frustumCulled=false;burst.add(trails);
 const flashGeometry=new THREE.SphereGeometry(.2,12,8),flashMaterial=new THREE.MeshBasicMaterial({color:'#fff8e6',transparent:true,depthWrite:false});
 const flash=new THREE.Mesh(flashGeometry,flashMaterial);burst.add(flash);
 const pieces=Array.from({length:count},(_,i)=>{
  const angle=i/count*Math.PI*2+(random()-.5)*.7,speed=4+random()*10;
  return {velocity:new THREE.Vector3(Math.cos(angle)*speed,Math.sin(angle)*speed*.8,(random()-.5)*9),
   start:new THREE.Vector3((random()-.5)*.22,(random()-.5)*.4,(random()-.5)*.35),
   rotation:new THREE.Vector3(random()*6,random()*6,random()*6),spin:new THREE.Vector3((random()-.5)*12,(random()-.5)*12,(random()-.5)*12),
   size:.035+random()*.075,stretch:1+random()*2.5};
 });
 const dummy=new THREE.Object3D(),position=new THREE.Vector3(),direction=new THREE.Vector3(),up=new THREE.Vector3(0,1,0);
 function update(p,origin,enabled){
  const active=enabled&&p>.29&&p<.60;burst.visible=active;if(!active)return;
  burst.position.copy(origin);
  const q=clamp((p-.29)/.29),flight=q*1.25,pop=clamp((p-.29)/.012),fade=pop*(1-clamp((p-.42)/.17)),scale=1-clamp((q-.7)/.3);
  shardMaterial.opacity=fade;chipMaterial.opacity=fade;trailMaterial.opacity=fade*.58;
  pieces.forEach((piece,i)=>{
   position.copy(piece.start).addScaledVector(piece.velocity,flight);position.y-=1.65*flight*flight;
   dummy.position.copy(position);dummy.rotation.set(piece.rotation.x+piece.spin.x*flight,piece.rotation.y+piece.spin.y*flight,piece.rotation.z+piece.spin.z*flight);
   dummy.scale.set(piece.size*piece.stretch*scale,piece.size*.55*scale,piece.size*.6*scale);dummy.updateMatrix();shards.setMatrixAt(i,dummy.matrix);
   if(i<32){dummy.scale.setScalar((.7+piece.stretch*.24)*scale);dummy.updateMatrix();chips.setMatrixAt(i,dummy.matrix);}
   if(i<trailCount){
    direction.copy(piece.velocity);direction.y-=3.3*flight;direction.normalize();
    dummy.position.copy(position).addScaledVector(direction,-.26*q);dummy.quaternion.setFromUnitVectors(up,direction);
    dummy.scale.set(1,(.13+q*.9)*scale,1);dummy.updateMatrix();trails.setMatrixAt(i,dummy.matrix);
   }
  });
  shards.instanceMatrix.needsUpdate=true;chips.instanceMatrix.needsUpdate=true;trails.instanceMatrix.needsUpdate=true;
  flash.scale.setScalar(.5+Math.sin(Math.min(1,q*5)*Math.PI)*2);flashMaterial.opacity=pop*Math.max(0,1-q*6);
 }
 return {update,dispose(){parent.remove(burst);[shards,chips,trails].forEach(mesh=>mesh.dispose());[shardGeometry,chipGeometry,trailGeometry,flashGeometry,shardMaterial,chipMaterial,trailMaterial,flashMaterial].forEach(resource=>resource.dispose());}};
}
