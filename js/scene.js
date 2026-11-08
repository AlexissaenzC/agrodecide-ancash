import {buildValley,buildTruck,cameraFor,projectPoint,valleyMarkers} from './valley-model.js';
import {buyers} from './data.js';
import {evaluate,money} from './domain.js';
import {QuotationTour,tourProduct,tourStops} from './quotation-tour.js';
import {bubblePlacement} from './scene-layout.js';

export function setupScene(){
 const $=s=>document.querySelector(s),canvas=$('#valley'),fallback=$('#valley-fallback'),wrap=canvas.parentElement;
 const points=[...wrap.querySelectorAll('.scene-point')],tour=new QuotationTour(buyers,{loop:true}),vertices=buildValley(),truck=buildTruck();
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const play=$('#scene-play'),next=$('#scene-next'),restart=$('#scene-restart'),speech=$('#scene-speech'),vehicle=$('#scene-vehicle');
 let gl,program,uniforms,groundBuffer,truckBuffer,frame,lastTime=0,playing=false,angle=.52,target=.52,camera,cameraKey='',lastPhase='';
 let rendererReady=false;
 function info(text){$('#scene-info').textContent=text;}
 function buttons(){if(play){play.textContent=reduced.matches?'Avanzar recorrido':playing?'Ⅱ Pausar':tour.phase==='ready'?'▶ Ver recorrido':'▶ Continuar';play.setAttribute('aria-pressed',String(playing));}if(next)next.disabled=false;}
 function highlight(id){const stopped=['quote','propose','response','deal'].includes(tour.phase);points.forEach((p,i)=>{const visible=stopped&&valleyMarkers[i].id===id;p.hidden=!visible;p.setAttribute('aria-pressed',String(visible));});}
 function quoteText(b){return `${b.town}: ${money(b.price)}/kg. Cobro ${money(b.gross)} − gastos de venta ${money(b.costs)} = ${money(b.net)}. Oferta ${b.status}. Falta descontar producción.`;}
 function renderHUD(){
  const best=tour.best(),destination=tourStops.find(s=>s.id===tour.currentId);let message='',balloon='';
  highlight(tour.currentId);
  if(tour.phase==='ready'){message='El camioncito lleva 1000 kilos. Visitará Carhuaz, Marcará y Huaraz para cotizar, comparar y pedir una mejor oferta. Todo el recorrido es simulado.';balloon='Vamos a cotizar nuestra papa';}
  else if(tour.phase==='travel'){message=`${tour.returning?'Regresamos a la mejor opción':'Vamos a cotizar'} en ${destination.label}. ${best?'Hasta ahora, '+best.name+' deja '+money(best.net)+' después de gastos.':'Primero hay que conocer las ofertas.'}`;balloon=`En camino a ${destination.label}…`;}
  else if(tour.phase==='home'){message='Terminó el ejemplo. El camión regresa al campo por el camino para comenzar otra ronda de cotizaciones.';}
  else if(tour.phase==='quote'){const b=tour.quotes.find(b=>b.id===tour.currentId);message=quoteText(b)+(best.id===b.id?' Es el mayor monto entre las ofertas visitadas.':' Otra oferta visitada deja más después de gastos.');balloon=`«Te ofrezco ${money(b.price)} por kilo»`;
  }else if(tour.phase==='propose'){const requested=Math.round((best.price+.08)*100)/100;message=`${best.name} deja el mayor monto de las tres cotizaciones: ${money(best.net)}. El productor pregunta: «¿Podrías pagar ${money(requested)} por kilo por el lote completo?». Negociación de demostración.`;balloon=`«¿Me pagas ${money(requested)} por kilo?»`;
  }else if(tour.phase==='response'){message=`Respuesta programada del comprador: «Acepto ${money(tour.negotiated.price)} por kilo en este ejemplo». Esta negociación es ficticia: no confirma una compra real ni cambia las ofertas del aplicativo.`;balloon='«De acuerdo, trato de ejemplo»';
  }else if(tour.phase==='deal'){const b=tour.negotiated;message=`Acuerdo ficticio en ${b.town}: ${money(b.gross)} de cobro − ${money(b.costs)} de gastos = ${money(b.net)}. Son ${money(b.net-best.net)} más que su cotización inicial. Falta descontar producción. No se realizó una venta real.`;balloon=`✓ Acuerdo ficticio · te quedan ${money(b.net)}`;}
  info(message);if(speech){speech.textContent=balloon;speech.hidden=!['quote','propose','response','deal'].includes(tour.phase);}
  const board=$('#scene-quotes');if(board){board.replaceChildren();for(const stop of tourStops){const quote=tour.quotes.find(q=>q.id===stop.id),deal=tour.phase==='deal'&&quote?.id===best.id;const row=document.createElement('li');row.className=quote&&best?.id===quote.id?'tour-best':'';const title=document.createElement('span');title.textContent=stop.label;const amount=document.createElement('strong');amount.textContent=deal?money(tour.negotiated.net):quote?money(quote.net):'Por cotizar';const caption=document.createElement('small');caption.textContent=deal?'Acuerdo ficticio · antes '+money(quote.net):quote?(best.id===quote.id?'Mayor monto visitado':'Después de gastos'):'El camión irá aquí';row.append(title,amount,caption);board.append(row);}}
  const status=$('#scene-stage');if(status)status.textContent=({ready:'01 · Salimos del campo',travel:'02 · Buscamos compradores',quote:'03 · Recibimos una cotización',propose:'04 · Negociamos la mejor opción',response:'04 · Respuesta de demostración',deal:'05 · Comparamos el acuerdo',home:'06 · Volvemos al campo · el recorrido continúa'})[tour.phase];
  buttons();
 }
 function requestDraw(){if(!rendererReady)return;cancelAnimationFrame(frame);frame=requestAnimationFrame(draw);}
 points.forEach((point,i)=>{point.onclick=()=>{const b=evaluate(tourProduct,buyers.find(b=>b.id===valleyMarkers[i].id));info(quoteText(b));};point.hidden=true;point.setAttribute('aria-pressed','false');});
 if(play)play.onclick=()=>{if(reduced.matches){tour.next();playing=false;}else{if(tour.phase==='ready')tour.start();playing=!playing;}lastTime=0;lastPhase='';renderHUD();requestDraw();};
 if(next)next.onclick=()=>{tour.next();lastTime=0;lastPhase='';renderHUD();requestDraw();};
 if(restart)restart.onclick=()=>{tour.reset();playing=!reduced.matches;if(playing)tour.start();lastTime=0;lastPhase='';renderHUD();requestDraw();};
 function overlayPosition(position,rect){const projected=projectPoint(position,camera);if(gl)return[(projected[0]+1)*rect.width/2,(1-projected[1])*rect.height/2];const w=Math.min(rect.width,rect.height*5/3),h=w*3/5;return[(rect.width-w)/2+(projected[0]+1)*w/2,(rect.height-h)/2+(1-projected[1])*h/2];}
 function place(node,position,rect){if(!node)return;const p=overlayPosition(position,rect);node.style.left=`${p[0]}px`;node.style.top=`${p[1]}px`;}
 function setupWebGL(){gl=canvas.getContext('webgl',{antialias:true,alpha:true,powerPreference:'low-power'});if(!gl)return;
  const vertex=`attribute vec3 p;attribute vec3 n;attribute vec3 color;uniform vec3 right;uniform vec3 up;uniform vec3 back;uniform vec3 center;uniform float halfHeight;uniform float aspect;uniform vec3 offset;uniform float heading;varying vec3 shaded;void main(){float c=cos(heading),s=sin(heading);mat3 rotation=mat3(c,0.,-s,0.,1.,0.,s,0.,c);vec3 v=rotation*p+offset-center;gl_Position=vec4(dot(v,right)/(halfHeight*aspect),dot(v,up)/halfHeight,-dot(v,back)/20.,1.);float diffuse=max(dot(rotation*n,normalize(vec3(-0.5,0.85,0.45))),0.);shaded=color*(0.67+0.33*diffuse);}`;
  const fragment=`precision mediump float;varying vec3 shaded;void main(){gl_FragColor=vec4(shaded,1.);}`;
  const shader=(type,source)=>{const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error('No se pudo preparar la escena');return s;};
  program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,vertex));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('No se pudo cargar la escena');gl.useProgram(program);
  const upload=data=>{const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);return b;};groundBuffer=upload(vertices);truckBuffer=upload(truck);
  uniforms=Object.fromEntries(['right','up','back','center','halfHeight','aspect','offset','heading'].map(name=>[name,gl.getUniformLocation(program,name)]));gl.enable(gl.DEPTH_TEST);
 }
 function showFallback(){gl=null;canvas.hidden=true;fallback.hidden=false;wrap.classList.add('scene-static');if(vehicle)vehicle.hidden=false;camera=cameraFor(vertices,5/3);cameraKey='';}
 function drawMesh(buffer,count,offset,heading){gl.bindBuffer(gl.ARRAY_BUFFER,buffer);for(const [name,byte]of[['p',0],['n',12],['color',24]]){const loc=gl.getAttribLocation(program,name);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,3,gl.FLOAT,false,36,byte);}gl.uniform3fv(uniforms.offset,offset);gl.uniform1f(uniforms.heading,heading);gl.drawArrays(gl.TRIANGLES,0,count/9);}
 function draw(time=0){
  cancelAnimationFrame(frame);if(document.hidden||$('#login')?.hidden){lastTime=0;return;}
  if(!wrap.getBoundingClientRect)return;const rect=wrap.getBoundingClientRect();if(!rect.width||!rect.height){lastTime=0;return;}
  if(playing&&lastTime)tour.advance(Math.min(100,time-lastTime));lastTime=time;
  if(tour.phase!==lastPhase){renderHUD();lastPhase=tour.phase;}
  const pose=tour.pose();
  if(gl){const ratio=Math.min(devicePixelRatio||1,1.5),width=Math.round(rect.width*ratio),height=Math.round(rect.height*ratio);if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;}gl.viewport(0,0,width,height);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);angle+=(target-angle)*.12;const key=`${width}:${height}:${angle.toFixed(4)}`;if(key!==cameraKey){camera=cameraFor(vertices,rect.width/rect.height,angle);cameraKey=key;}for(const k of['right','up','back','center'])gl.uniform3fv(uniforms[k],camera[k]);gl.uniform1f(uniforms.halfHeight,camera.halfHeight);gl.uniform1f(uniforms.aspect,camera.aspect);drawMesh(groundBuffer,vertices.length,[0,0,0],0);drawMesh(truckBuffer,truck.length,pose.position,pose.heading);
  }else place(vehicle,pose.position,rect);
  points.forEach((point,i)=>{if(!point.hidden)place(point,valleyMarkers[i].position,rect);});
  if(speech&&!speech.hidden){const anchor=overlayPosition(pose.position.map((n,i)=>i===1?n+.5:n),rect),index=points.findIndex(p=>!p.hidden);let obstacle=null;if(index>=0){const p=overlayPosition(valleyMarkers[index].position,rect),w=points[index].offsetWidth||60,h=points[index].offsetHeight||26;obstacle={x:p[0]-w/2,y:p[1]-h*1.1,width:w,height:h};}const box=bubblePlacement(anchor,{width:rect.width,height:rect.height},{width:speech.offsetWidth||150,height:speech.offsetHeight||42},obstacle);speech.style.left=`${box.x}px`;speech.style.top=`${box.y}px`;}
  const route=$('#scene-route'),line=$('#scene-route-line');if(route&&line){const travelling=['travel','home'].includes(tour.phase);route.style.display=travelling?'block':'none';if(travelling)line.setAttribute('d',tour.path.map((p,i)=>{const q=overlayPosition(p,rect);return `${i?'L':'M'}${q[0]/rect.width*1000},${q[1]/rect.height*1000}`;}).join(' '));}
  if(playing||(!reduced.matches&&Math.abs(target-angle)>.0004))frame=requestAnimationFrame(draw);
 }
 try{setupWebGL();if(gl){fallback.hidden=true;canvas.hidden=false;wrap.classList.remove('scene-static');if(vehicle)vehicle.hidden=true;}else showFallback();}catch{showFallback();}
 canvas.addEventListener('pointermove',e=>{if(!gl||reduced.matches)return;const rect=canvas.getBoundingClientRect();target=.52+((e.clientX-rect.left)/rect.width-.5)*.3;requestDraw();});canvas.addEventListener('pointerleave',()=>{target=.52;requestDraw();});canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();showFallback();requestDraw();});
 if(typeof ResizeObserver!=='undefined')new ResizeObserver(requestDraw).observe(wrap);
 document.addEventListener?.('visibilitychange',()=>{lastTime=0;requestDraw();});
 if(typeof MutationObserver!=='undefined'&&$('#login'))new MutationObserver(()=>{lastTime=0;requestDraw();}).observe($('#login'),{attributes:true,attributeFilter:['hidden']});
 reduced.addEventListener?.('change',()=>{playing=false;angle=target=.52;lastTime=0;renderHUD();requestDraw();});
 if(!reduced.matches&&play){tour.start();playing=true;}
 rendererReady=true;renderHUD();requestDraw();
}
