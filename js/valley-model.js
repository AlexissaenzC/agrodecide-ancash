// Shared geometry and projection for WebGL and offline framing checks.
const hex=c=>c.match(/\w\w/g).map(v=>parseInt(v,16)/255);
export function buildValley(){
 const vertices=[];
 function tri(a,b,c,color){const u=b.map((v,i)=>v-a[i]),v=c.map((n,i)=>n-a[i]);let normal=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];if(normal[1]<0)normal=normal.map(n=>-n);const length=Math.hypot(...normal)||1;normal=normal.map(n=>n/length);const rgb=hex(color);for(const p of[a,b,c])vertices.push(...p,...normal,...rgb);}
 function face(a,b,c,d,color){tri(a,b,c,color);tri(a,c,d,color);}
 function box(x,y,z,w,h,d,color,side='8c9870'){face([x,y+h,z],[x+w,y+h,z],[x+w,y+h,z+d],[x,y+h,z+d],color);face([x,y,z+d],[x+w,y,z+d],[x+w,y+h,z+d],[x,y+h,z+d],side);face([x,y,z],[x,y,z+d],[x,y+h,z+d],[x,y+h,z],side);face([x+w,y,z],[x+w,y,z+d],[x+w,y+h,z+d],[x+w,y+h,z],side);face([x,y,z],[x+w,y,z],[x+w,y+h,z],[x,y+h,z],side);}
 function ribbon(points,width,y,color){for(let i=1;i<points.length;i++){const [a,b]=[points[i-1],points[i]],dx=b[0]-a[0],dz=b[1]-a[1],length=Math.hypot(dx,dz),nx=-dz/length*width/2,nz=dx/length*width/2;face([a[0]+nx,y,a[1]+nz],[b[0]+nx,y,b[1]+nz],[b[0]-nx,y,b[1]-nz],[a[0]-nx,y,a[1]-nz],color);}}
 const outline=[[-4.9,-2.7],[-4,-3.3],[3.9,-3.3],[5,-2.5],[5,2.5],[4,3.15],[-4,3.15],[-4.9,2.4]];
 for(let i=0;i<outline.length;i++){const a=outline[i],b=outline[(i+1)%outline.length];tri([0,0,0],[a[0],0,a[1]],[b[0],0,b[1]],'a6b785');face([a[0],0,a[1]],[b[0],0,b[1]],[b[0],-.38,b[1]],[a[0],-.38,a[1]],i%2?'b4a37b':'9d8d67');face([a[0],-.38,a[1]],[b[0],-.38,b[1]],[b[0],-.53,b[1]],[a[0],-.53,a[1]],'786e53');}
 function mountain(x,z,r,h){const ring=Array.from({length:7},(_,i)=>{const a=i*Math.PI*2/7;return [x+Math.cos(a)*r*(1+(i%2)*.1),.01,z+Math.sin(a)*r*.65];});const peak=[x-.18,h,z-.12],snow=ring.map(p=>p.map((n,i)=>peak[i]+(n-peak[i])*.25)),colors=['7c9480','92a38a','809b87','a7b59a','718d7c','8da58d','a1b19a'];for(let i=0;i<7;i++){const j=(i+1)%7;face(ring[i],ring[j],snow[j],snow[i],colors[i]);tri(snow[i],snow[j],peak,i%2?'e6eade':'f9f7e9');}}
 mountain(-3.05,-2.15,1.55,1.65);mountain(-.5,-2.3,1.8,2.65);mountain(2.4,-2.35,1.65,2.1);
 const river=Array.from({length:25},(_,i)=>{const z=-2.3+i*.225;return[-.35+Math.sin(z*1.5)*.28,z];});ribbon(river,.44,.025,'77b9ba');ribbon(river.map(([x,z])=>[x-.12,z]),.07,.03,'bedbd0');
 const road=Array.from({length:22},(_,i)=>{const z=-1.3+i*.202;return[1.05+Math.sin(z*1.2)*.22,z];});ribbon(road,.27,.04,'e9d6aa');ribbon([[-4.5,.6],[-2,.6],[-.6,.45],[.4,.45],[1.2,.45],[3.9,.45]],.22,.055,'e9d6aa');ribbon([[-4.4,.6],[-4.2,2.2]],.25,.055,'e9d6aa');box(-.7,.06,.3,1.1,.09,.32,'ddc49b','b19972');
 for(const [x,z,w,d,color]of[[-4,-.65,1.5,.92,'719445'],[-2.3,-.65,1.32,.92,'b6bd69'],[-4,1,1.4,1.2,'b8bb68'],[-2.4,1,1.45,1.2,'6b913f'],[1.8,.75,1.1,1.18,'8ea64f'],[3.1,.75,1.15,1.18,'bdc279'],[2.45,-.75,1.45,.8,'8b9e4c']]){box(x,.012,z,w,.045,d,color,'8e9d67');for(let i=1;i<8;i++)box(x+i*w/8,.06,z+.05,.025,.025,d-.1,'526f37','526f37');}
 function house(x,z,scale=1){const w=.55*scale,d=.5*scale,h=.38*scale,y=.07;box(x,y,z,w,h,d,'f4e9cb','d6c59f');const a=[x-.06,y+h,z-.07],b=[x+w+.06,y+h,z-.07],c=[x+w+.06,y+h,z+d+.07],d1=[x-.06,y+h,z+d+.07],r1=[x+w/2,y+h+.25*scale,z-.07],r2=[x+w/2,y+h+.25*scale,z+d+.07];face(a,r1,r2,d1,'b86d4d');face(r1,b,c,r2,'cf8964');tri(a,b,r1,'a76142');tri(d1,c,r2,'b8734e');box(x+w*.35,y,z+d+.002,w*.22,h*.67,.012,'52756b','52756b');box(x+w*.08,y+h*.43,z+d+.005,w*.17,h*.25,.013,'719a99','719a99');}
 house(1.3,-1.05,1.1);house(2.05,-1.15,.65);house(1.45,2.05,1);house(2.15,2.1,.7);house(-3.8,2.45,.65);
 function tree(x,z,size=1){box(x-.035,.03,z-.035,.07,.35*size,.07,'8b7754','8b7754');const n=7,r=.19*size;for(let i=0;i<n;i++){const a=i*2*Math.PI/n,b=(i+1)*2*Math.PI/n;tri([x+Math.cos(a)*r,.25*size,z+Math.sin(a)*r],[x+Math.cos(b)*r,.25*size,z+Math.sin(b)*r],[x,.86*size,z],i%2?'507654':'608761');}}
 for(const [x,z,s]of[[-4.5,-1.1,1.2],[-4.4,.1,1],[-4.5,2.1,1.2],[-1.1,2.6,1.1],[.4,2.7,1],[4.4,2.2,1.2],[4.5,.2,1.3],[4.25,-1.2,1.15],[-1.2,-.75,.9],[.35,-1,.8]])tree(x,z,s);
 return vertices;
}
export const valleyMarkers=[{id:'b1',position:[1.58,.85,-.82],label:'Carhuaz'},{id:'b2',position:[1.72,.8,2.3],label:'Huaraz'},{id:'b3',position:[-3.62,.65,2.55],label:'Marcará'}];

export function buildTruck(){
 const vertices=[];
 function tri(a,b,c,color){const u=b.map((n,i)=>n-a[i]),v=c.map((n,i)=>n-a[i]);let normal=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]],length=Math.hypot(...normal)||1;normal=normal.map(n=>n/length);for(const p of[a,b,c])vertices.push(...p,...normal,...hex(color));}
 const face=(a,b,c,d,color)=>{tri(a,b,c,color);tri(a,c,d,color);};
 function box(x,y,z,w,h,d,color){face([x,y+h,z],[x,y+h,z+d],[x+w,y+h,z+d],[x+w,y+h,z],color);face([x,y,z+d],[x+w,y,z+d],[x+w,y+h,z+d],[x,y+h,z+d],color);face([x,y,z],[x,y+h,z],[x+w,y+h,z],[x+w,y,z],color);face([x,y,z],[x,y,z+d],[x,y+h,z+d],[x,y+h,z],color);face([x+w,y,z],[x+w,y+h,z],[x+w,y+h,z+d],[x+w,y,z+d],color);}
 box(-.29,.12,-.5,.58,.14,1.12,'d9cfb4');box(-.28,.25,-.47,.56,.19,.65,'587c52');box(-.3,.25,.23,.6,.36,.37,'c77851');box(-.24,.4,.606,.48,.15,.016,'b8d5d1');box(-.31,.44,.32,.012,.12,.19,'b8d5d1');box(.3,.44,.32,.012,.12,.19,'b8d5d1');box(-.3,.61,.23,.6,.035,.38,'e2b589');box(-.26,.25,.61,.12,.06,.02,'fff1c0');box(.14,.25,.61,.12,.06,.02,'fff1c0');
 for(const x of[-.14,.13])for(const z of[-.32,-.06]){const p=[x,.56,z];for(let i=0;i<6;i++){const a=i*Math.PI/3,b=(i+1)*Math.PI/3;tri([x+Math.cos(a)*.13,.44,z+Math.sin(a)*.13],[x+Math.cos(b)*.13,.44,z+Math.sin(b)*.13],p,'c9b782');}}
 for(const x of[-.32,.32])for(const z of[-.28,.43])for(let i=0;i<10;i++){const a=i*Math.PI/5,b=(i+1)*Math.PI/5;const pa=[x,.13+Math.cos(a)*.14,z+Math.sin(a)*.14],pb=[x,.13+Math.cos(b)*.14,z+Math.sin(b)*.14];tri([x,.13,z],pa,pb,'354238');face(pa,pb,[x+.055,pb[1],pb[2]],[x+.055,pa[1],pa[2]],'414c40');}
 return vertices;
}
export function cameraFor(vertices,aspect,yaw=.52){
 const back=[Math.sin(yaw)*.8,.6,Math.cos(yaw)*.8],right=[Math.cos(yaw),0,-Math.sin(yaw)],up=[-Math.sin(yaw)*.6,.8,-Math.cos(yaw)*.6],center=[0,.5,0];
 const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);let extentX=0,extentY=0;for(let i=0;i<vertices.length;i+=9){const p=vertices.slice(i,i+3).map((n,j)=>n-center[j]);extentX=Math.max(extentX,Math.abs(dot(p,right)));extentY=Math.max(extentY,Math.abs(dot(p,up)));}const halfHeight=Math.max(extentY,extentX/Math.max(aspect,.1))*1.18;return{back,right,up,center,halfHeight,aspect};
}
export function projectPoint(position,camera){const p=position.map((n,i)=>n-camera.center[i]),dot=(a,b)=>a.reduce((s,n,i)=>s+n*b[i],0);return[dot(p,camera.right)/(camera.halfHeight*camera.aspect),dot(p,camera.up)/camera.halfHeight,-dot(p,camera.back)/20];}
