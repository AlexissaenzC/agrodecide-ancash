import {buyers} from './data.js';
import {evaluate} from './domain.js';

export const tourProduct={variety:'Blanca',quality:'Primera',quantity:1000,origin:'Carhuaz',minimum:null};
export const tourStops=[
 {id:'b1',label:'Carhuaz',position:[1.08,.08,-.9]},
 {id:'b3',label:'Marcará',position:[-4.2,.08,2.2]},
 {id:'b2',label:'Huaraz',position:[1.13,.08,2.35]}
];
const junction=[1.15,.08,.5],leftJunction=[-4.4,.08,.6];
export const tourStart=[-3.8,.08,.6];
function branch(id){return id==='b3'?[tourStops[1].position,leftJunction,junction]:[tourStops.find(s=>s.id===id).position,junction];}
export function routeBetween(from,to){const origin=from?branch(from):[tourStart,leftJunction,junction],dest=to?branch(to).slice(0,-1).reverse():[tourStart];return [...origin,...dest].filter((p,i,a)=>!i||Math.hypot(...p.map((n,j)=>n-a[i-1][j]))>.001);}
export function poseOnRoute(path,progress){const distances=path.slice(1).map((p,i)=>Math.hypot(...p.map((n,j)=>n-path[i][j]))),total=distances.reduce((a,b)=>a+b,0);let distance=Math.max(0,Math.min(1,progress))*total;for(let i=0;i<distances.length;i++){if(distance<=distances[i]||i===distances.length-1){const t=distances[i]?distance/distances[i]:1,a=path[i],b=path[i+1];return{position:a.map((n,j)=>n+(b[j]-n)*t),heading:Math.atan2(b[0]-a[0],b[2]-a[2])};}distance-=distances[i];}return{position:[...path[0]],heading:0};}

export class QuotationTour {
 constructor(offers=buyers,{loop=false}={}){this.offers=offers;this.loop=loop;this.reset();}
 reset(){this.phase='ready';this.elapsed=0;this.currentId=null;this.quotes=[];this.index=0;this.path=[tourStart,tourStart];this.lastPose={position:[...tourStart],heading:Math.PI/2};this.negotiated=null;return this;}
 best(){return this.quotes.reduce((best,b)=>!best||b.net>best.net?b:best,null);}
 enter(phase,duration=0){this.phase=phase;this.elapsed=0;this.duration=duration;}
 travelTo(id,returning=false){this.path=routeBetween(this.currentId,id);this.currentId=id;this.returning=returning;const length=this.path.slice(1).reduce((sum,p,i)=>sum+Math.hypot(...p.map((n,j)=>n-this.path[i][j])),0);this.enter('travel',Math.max(2200,length*260));}
 start(){if(this.phase==='ready')this.travelTo(tourStops[0].id);return this;}
 next(){
  if(this.phase==='ready'){this.start();return;}
  if(this.phase==='travel'){this.lastPose=poseOnRoute(this.path,1);if(this.returning)this.enter('propose',3000);else{const b=this.offers.find(b=>b.id===this.currentId),quote=evaluate(tourProduct,b);if(quote.compatible&&quote.net!==null)this.quotes.push(quote);this.enter('quote',2800);}return;}
  if(this.phase==='quote'){this.index++;if(this.index<tourStops.length)this.travelTo(tourStops[this.index].id);else if(this.best().id!==this.currentId)this.travelTo(this.best().id,true);else this.enter('propose',3000);return;}
  if(this.phase==='propose'){const best=this.best();const price=Math.round((best.price+.08)*100)/100;this.negotiated=evaluate(tourProduct,best,{price});this.enter('response',2400);return;}
  if(this.phase==='response'){this.enter('deal',3600);return;}
  if(this.phase==='deal'&&this.loop){this.path=routeBetween(this.currentId,null);const length=this.path.slice(1).reduce((sum,p,i)=>sum+Math.hypot(...p.map((n,j)=>n-this.path[i][j])),0);this.enter('home',Math.max(2200,length*260));return;}
  if(this.phase==='home'){this.reset();this.start();}
 }
 advance(ms){let rest=Math.max(0,ms);for(let guard=0;guard<30&&rest>0&&this.phase!=='ready'&&(this.phase!=='deal'||this.loop);guard++){const remaining=this.duration-this.elapsed;if(rest<remaining){this.elapsed+=rest;break;}rest-=remaining;this.next();}return this;}
 pose(){if(!['travel','home'].includes(this.phase))return this.lastPose;const t=this.elapsed/this.duration;return poseOnRoute(this.path,t*t*(3-2*t));}
}
