import * as THREE from 'three';

// The entire sculpture and its reflection studio are built from geometry.
// No model, image, texture, or environment map is fetched.
export function createSteelStudio(renderer) {
 const room=new THREE.Scene();room.background=new THREE.Color(.055,.06,.065);
 const resources=[];
 function card(w,h,color,x,y,z,roll=0){
  const geometry=new THREE.PlaneGeometry(w,h),material=new THREE.MeshBasicMaterial({color:new THREE.Color(...color),side:THREE.DoubleSide});
  const mesh=new THREE.Mesh(geometry,material);mesh.position.set(x,y,z);mesh.lookAt(0,0,0);mesh.rotateZ(roll);room.add(mesh);resources.push(geometry,material);
 }
 card(9,18,[4.7,4.4,3.9],-9,7,8,-.28);
 card(1.6,20,[6,6,6],8,0,7,.12);
 card(18,3,[2.4,2.5,2.6],0,-8,5,-.12);
 card(14,5,[1.6,1.7,1.8],0,10,-5);
 card(6,20,[.008,.009,.011],0,0,11,-.2);
 card(9,12,[.015,.017,.02],5,-2,-10);
 card(5,16,[.6,.035,.018],-12,-1,-2);
 const bake=new THREE.PMREMGenerator(renderer),target=bake.fromScene(room,.015);bake.dispose();resources.forEach(r=>r.dispose());
 const silver=new THREE.MeshPhysicalMaterial({color:'#d9dcda',metalness:1,roughness:.21,clearcoat:0,envMapIntensity:1.05});
 // Very faint longitudinal machining. This changes roughness, never the silhouette.
 silver.onBeforeCompile=shader=>{
  shader.fragmentShader=shader.fragmentShader.replace('#include <roughnessmap_fragment>',`#include <roughnessmap_fragment>
  #ifdef USE_UV
   float tooling = sin(vUv.y * 610.0 + sin(vUv.x * 37.0) * 0.18);
   roughnessFactor += tooling * 0.012;
  #endif`);
 };
 silver.defines={USE_UV:''};
 const cut=new THREE.MeshStandardMaterial({color:'#aeb3b2',metalness:1,roughness:.36,envMapIntensity:.8});
 return {environment:target.texture,silver,cut,dispose(){target.dispose();silver.dispose();cut.dispose();}};
}

const Z=new THREE.Vector3(0,0,1),Y=new THREE.Vector3(0,1,0);
function frame(tangent,normal,binormal){
 normal.crossVectors(Math.abs(tangent.z)<.94?Z:Y,tangent).normalize();
 binormal.crossVectors(tangent,normal).normalize();
}
function tubeGeometry(count,sides=14){
 const geometry=new THREE.BufferGeometry(),index=[];
 const position=new Float32Array((count+1)*sides*3),normal=new Float32Array(position.length),uv=new Float32Array((count+1)*sides*2);
 for(let i=0;i<count;i++)for(let j=0;j<sides;j++){
  const a=i*sides+j,b=i*sides+(j+1)%sides,c=a+sides,d=b+sides;index.push(a,b,c,b,d,c);
 }
 geometry.setAttribute('position',new THREE.BufferAttribute(position,3).setUsage(THREE.DynamicDrawUsage));
 geometry.setAttribute('normal',new THREE.BufferAttribute(normal,3).setUsage(THREE.DynamicDrawUsage));
 geometry.setAttribute('uv',new THREE.BufferAttribute(uv,2));geometry.setIndex(index);
 return geometry;
}
function writeTube(geometry,points,radius,sides,diagonal=false){
 const pos=geometry.attributes.position,norm=geometry.attributes.normal,uv=geometry.attributes.uv;
 const tangent=new THREE.Vector3(),normal=new THREE.Vector3(),binormal=new THREE.Vector3();let length=0;
 for(let i=0;i<points.length;i++){
  if(i)length+=points[i].distanceTo(points[i-1]);
  tangent.subVectors(points[Math.min(i+1,points.length-1)],points[Math.max(0,i-1)]).normalize();frame(tangent,normal,binormal);
  for(let j=0;j<sides;j++){
   const theta=j/sides*Math.PI*2,c=Math.cos(theta),s=Math.sin(theta),k=i*sides+j;
   const endShift=diagonal&&(i===0||i===points.length-1)?c*radius*.95:0;
   const nx=normal.x*c+binormal.x*s,ny=normal.y*c+binormal.y*s,nz=normal.z*c+binormal.z*s;
   pos.setXYZ(k,points[i].x+nx*radius+tangent.x*endShift,points[i].y+ny*radius+tangent.y*endShift,points[i].z+nz*radius+tangent.z*endShift);
   norm.setXYZ(k,nx,ny,nz);uv.setXY(k,length,j/sides);
  }
 }
 pos.needsUpdate=true;norm.needsUpdate=true;uv.needsUpdate=true;
}
function capFor(geometry,ring,sides){
 const pos=geometry.attributes.position,points=[],indices=[];
 for(let j=0;j<sides;j++){const i=ring*sides+j;points.push(pos.getX(i),pos.getY(i),pos.getZ(i));}
 for(let j=1;j<sides-1;j++)indices.push(0,j,j+1);
 const cap=new THREE.BufferGeometry();cap.setAttribute('position',new THREE.Float32BufferAttribute(points,3));cap.setIndex(indices);cap.computeVertexNormals();return cap;
}
function makeBarbGeometry(){
 const pieces=[];
 // Two continuous two-turn pieces, with four outward tails and obliquely cut ends.
 for(let piece=0;piece<2;piece++){
  const points=[],start=piece===0?-.53:.02,roll=piece*Math.PI*.5+.26;
  const coilRadius=.48;
  const at=(x,r,angle)=>new THREE.Vector3(x,r*Math.cos(angle),r*Math.sin(angle));
  points.push(at(start-.31,1.48,roll-.48),at(start-.20,1.07,roll-.26),at(start-.08,.66,roll-.07));
  for(let j=0;j<=72;j++)points.push(at(start+j/72*.50,coilRadius,roll+j/72*Math.PI*4));
  points.push(at(start+.58,.65,roll+.09),at(start+.70,1.02,roll+.32),at(start+.82,1.43,roll+.54));
  const curve=new THREE.CatmullRomCurve3(points,false,'centripetal'),sample=curve.getPoints(128),geometry=tubeGeometry(128,12);
  writeTube(geometry,sample,.098,12,true);pieces.push(geometry.toNonIndexed(),capFor(geometry,0,12).toNonIndexed(),capFor(geometry,128,12).toNonIndexed());geometry.dispose();
 }
 const positions=[],normals=[],uv=[];
 for(const g of pieces){positions.push(...g.attributes.position.array);normals.push(...g.attributes.normal.array);if(g.attributes.uv)uv.push(...g.attributes.uv.array);else uv.push(...new Float32Array(g.attributes.position.count*2));g.dispose();}
 const merged=new THREE.BufferGeometry();merged.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));merged.setAttribute('normal',new THREE.Float32BufferAttribute(normals,3));merged.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));return merged;
}

export function createSteelWire(studio,{segments=200,barbs=9,split=false,radius=.23,pitch=2.65}={}) {
 const group=new THREE.Group(),halves=split?2:1,sides=14,parts=[];
 for(let half=0;half<halves;half++){
  const core=Array.from({length:segments+1},()=>new THREE.Vector3());
  const strands=Array.from({length:2},()=>Array.from({length:segments+1},()=>new THREE.Vector3()));
  const caps=[];
  const tubes=strands.map(()=>{
   const geometry=tubeGeometry(segments,sides),mesh=new THREE.Mesh(geometry,studio.silver);mesh.frustumCulled=false;group.add(mesh);
   const ends=[0,segments].map((ring,end)=>{
    const face=new THREE.BufferGeometry(),indices=[];face.setAttribute('position',new THREE.BufferAttribute(new Float32Array(sides*3),3).setUsage(THREE.DynamicDrawUsage));
    for(let j=1;j<sides-1;j++)indices.push(0,end?j:j+1,end?j+1:j);
    face.setIndex(indices);const cap=new THREE.Mesh(face,studio.cut);cap.frustumCulled=false;group.add(cap);return {cap,ring};
   });caps.push(ends);return mesh;
  });
  parts.push({core,strands,tubes,caps,half,lengths:new Float32Array(segments+1)});
 }
 const barbGeometry=makeBarbGeometry(),knots=new THREE.InstancedMesh(barbGeometry,studio.silver,barbs);knots.frustumCulled=false;knots.instanceMatrix.setUsage(THREE.DynamicDrawUsage);group.add(knots);
 const tangent=new THREE.Vector3(),normal=new THREE.Vector3(),binormal=new THREE.Vector3(),matrix=new THREE.Matrix4(),roll=new THREE.Matrix4(),scale=new THREE.Matrix4();
 const point=new THREE.Vector3(),before=new THREE.Vector3(),after=new THREE.Vector3();
 const offsets=Array.from({length:barbs},(_,i)=>(i+.5)/barbs);
 let currentSample=null;
 function update(sample){
  currentSample=sample;
  for(const part of parts){
   const {core,strands,tubes,half,lengths}=part,start=split?half*.5:0,end=split?(half+1)*.5:1,side=half===0?-1:1;
   lengths[0]=0;
   for(let i=0;i<=segments;i++){sample(start+(end-start)*i/segments,core[i],side);if(i)lengths[i]=lengths[i-1]+core[i].distanceTo(core[i-1]);}
   const anchor=split?(half===0?lengths[segments]:0):lengths[Math.floor(segments/2)];
   for(let i=0;i<=segments;i++){
    tangent.subVectors(core[Math.min(segments,i+1)],core[Math.max(0,i-1)]).normalize();frame(tangent,normal,binormal);
    const theta=(lengths[i]-anchor)/pitch*Math.PI*2;
    for(let s=0;s<2;s++)strands[s][i].copy(core[i]).addScaledVector(normal,Math.cos(theta+s*Math.PI)*radius*1.01).addScaledVector(binormal,Math.sin(theta+s*Math.PI)*radius*1.01);
   }
   for(let s=0;s<2;s++){
    writeTube(tubes[s].geometry,strands[s],radius,sides);
    const pos=tubes[s].geometry.attributes.position;
    for(const {cap,ring} of part.caps[s]){
     const points=cap.geometry.attributes.position;
     for(let j=0;j<sides;j++)points.setXYZ(j,pos.getX(ring*sides+j),pos.getY(ring*sides+j),pos.getZ(ring*sides+j));
     points.needsUpdate=true;cap.geometry.computeVertexNormals();
    }
   }
  }
  for(let i=0;i<barbs;i++){
   const t=offsets[i],side=t<.5?-1:1;
   sample(t,point,side);sample(Math.max(0,t-.0005),before,side);sample(Math.min(1,t+.0005),after,side);tangent.subVectors(after,before).normalize();frame(tangent,normal,binormal);
   matrix.makeBasis(tangent,normal,binormal);matrix.setPosition(point);
   // The barb is locked onto the core: no independent spinning or breathing.
   roll.makeRotationX(i*Math.PI*.63+.18);scale.makeScale(1,1,1);
   matrix.multiply(roll).multiply(scale);knots.setMatrixAt(i,matrix);
  }
  knots.instanceMatrix.needsUpdate=true;
 }
 return {group,update,knots,offsets,setBarbPositions(values){for(let i=0;i<barbs;i++)offsets[i]=values[i]??offsets[i];},sample(t,out,side){return currentSample?.(t,out,side);},dispose(){for(const part of parts){part.tubes.forEach(t=>t.geometry.dispose());part.caps.flat().forEach(({cap})=>cap.geometry.dispose());}barbGeometry.dispose();}};
}
