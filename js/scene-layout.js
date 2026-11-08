// Place a small bubble beside the truck, avoiding the active city label.
export function bubblePlacement(anchor,viewport,size,obstacle=null){
 const width=Math.min(size.width,viewport.width-16),height=size.height;
 const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
 const overlap=(a,b)=>b?Math.max(0,Math.min(a.x+a.width,b.x+b.width)-Math.max(a.x,b.x))*Math.max(0,Math.min(a.y+a.height,b.y+b.height)-Math.max(a.y,b.y)):0;
 const truck={x:anchor[0]-15,y:anchor[1]-12,width:30,height:30};
 const candidates=[[anchor[0]+24,anchor[1]-height-8],[anchor[0]-width-24,anchor[1]-height-8],[anchor[0]-width/2,anchor[1]-height-32],[anchor[0]+24,anchor[1]+20],[anchor[0]-width-24,anchor[1]+20]].map(([x,y])=>({x:clamp(x,8,viewport.width-width-8),y:clamp(y,36,viewport.height-height-20),width,height}));
 return candidates.reduce((best,p)=>{const score=overlap(p,truck)*20+overlap(p,obstacle)*10+Math.hypot(p.x+width/2-anchor[0],p.y+height/2-anchor[1]);return !best||score<best.score?{...p,score}:best;},null);
}
