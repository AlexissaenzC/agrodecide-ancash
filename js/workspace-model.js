import {ranked} from './domain.js';

export function workspaceSummary(product,rows,{minimumAsked=false,confirmed=false}={}){
 const filled=[product.variety,product.quality,product.quantity,product.origin,minimumAsked].filter(Boolean).length;
 const options=ranked(rows);
 return{filled,progress:confirmed?100:filled*18,compatible:rows.filter(r=>r.compatible).length,comparable:options.length,best:confirmed?options[0]||null:null,stage:confirmed?'Lote confirmado':filled===5?'Confirma tu lote':`Completa tu lote · ${filled} de 5 datos`,next:confirmed?'Ver compradores':'Completar mi lote'};
}
export function priceSeries(days=7){return Array.from({length:30},(_,i)=>({day:i+1,value:Math.round((1.35+i*.004+Math.sin(i*.8)*.055)*100)/100})).slice(-([7,30].includes(days)?days:7));}
export function historySummary(series){const values=series.map(p=>p.value);return{minimum:Math.min(...values),maximum:Math.max(...values),average:values.reduce((a,b)=>a+b,0)/values.length};}
