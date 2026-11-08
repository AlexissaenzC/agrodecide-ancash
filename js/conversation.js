import {varieties,qualities,origins} from './data.js';
import {normalize,quantityFrom,topExplanation,money} from './domain.js';
export const initialProduct=()=>({variety:null,quality:null,quantity:null,origin:null,minimum:null});
export function nextQuestion(p,minimumAsked=false){if(!p.variety)return '¿Qué variedad de papa tienes?';if(!p.quality)return '¿Tu papa es de primera o de segunda calidad?';if(!p.quantity)return '¿Cuántos kilos quieres vender?';if(!p.origin)return '¿De qué lugar viene tu papa? Elige un origen simulado.';if(!minimumAsked)return '¿Tienes un precio mínimo por kilo? Puedes escribir un precio o elegir «Sin mínimo».';return 'Revisa el resumen de tu producto y pulsa «Confirmar producto». Puedes corregir cualquier dato.';}
export function replies(p,minimumAsked,confirmed){if(!p.variety)return varieties;if(!p.quality)return qualities;if(!p.quantity)return ['500 kilos','1000 kilos'];if(!p.origin)return origins;if(!minimumAsked)return ['Sin mínimo'];return confirmed?['Muéstrame el mapa','¿Por qué esta opción me deja más?','Ver precios históricos']:['Confirmar producto','Corregir datos'];}
export function interpret(text,state,rows){const t=normalize(text),p={...state.product};const done=state.minimumAsked;
 if(/histor|precio.*dias/.test(t))return {action:'history'};
 if(/mapa|compradores/.test(t))return {action:'map'};
 if(/por que|resultado|deja mas|mejor opcion/.test(t))return {reply:topExplanation(rows)};
 if(/este comprador|sobre el|por el|seleccionado/.test(t)){const b=rows.find(b=>b.id===state.selected);return {reply:b?`${b.name}: ${b.reason||'recibe tu lote completo'}. ${b.net!==null?'Cobro '+money(b.gross)+' menos gastos '+money(b.costs)+' = '+money(b.net)+'.':''} Estado: ${b.status}. Oferta ficticia del ${b.date}.`:'Selecciona primero un comprador en el mapa.'};}
 if(/confirmar producto|^confirmo$|^confirmar$/.test(t))return {action:'confirm'};
 if(/corregir datos|editar/.test(t))return {action:'edit'};
 if(/quiero vender en/.test(t)){const town=origins.find(x=>t.includes(normalize(x)));return {destination:town,reply:town?`Buscaré opciones en ${town}. El destino de venta es distinto del origen del lote. ${nextQuestion(p,done)}`:'Elige Carhuaz, Huaraz, Yungay o Marcará como destino simulado.'};}
 let changed=false,minimumAsked=done;
 const variety=varieties.find(v=>t.includes(normalize(v)));if(variety){p.variety=variety;changed=true;}
 const quality=qualities.find(v=>t.includes(normalize(v)));if(quality){p.quality=quality;changed=true;}
 const origin=origins.find(v=>t.includes(normalize(v)));if(origin){p.origin=origin;changed=true;}
 const isMin=/minimo|soles|precio/.test(t)||(!changed&&!/kilo|cantidad|cambia/.test(t)&&p.variety&&p.quality&&p.quantity&&p.origin&&!done);
 if(/sin minimo|omitir/.test(t)){p.minimum=null;minimumAsked=true;changed=true;}
 else if(isMin){const match=t.match(/-?\d+(?:[.,]\d{1,2})?/);if(match){const value=Number(match[0].replace(',','.'));if(!Number.isFinite(value)||value<0)return {reply:'Escribe un precio mínimo de cero o más soles por kilo.'};p.minimum=value;minimumAsked=true;changed=true;}}
 else if(/kilo|cantidad/.test(t)||(!changed&&!p.quantity&&p.variety&&p.quality)){const q=quantityFrom(t);if(q.ambiguous)return {reply:'Veo una cantidad ambigua. Confirma un solo número entero de kilos, sin puntos ni comas. Por ejemplo: 1500 kilos.'};if(q.value!==undefined){if(q.value<1||q.value>1000000||!Number.isInteger(q.value))return {reply:'Escribe una cantidad entera entre 1 y 1000000 kilos.'};p.quantity=q.value;changed=true;}}
 if(changed)return {product:p,minimumAsked,reply:nextQuestion(p,minimumAsked)};
 return {reply:'No entendí ese dato. Puedes elegir una opción de abajo, escribir «Cambia la cantidad a 800 kilos» o pulsar «Corregir datos». '+nextQuestion(p,minimumAsked)};
}
