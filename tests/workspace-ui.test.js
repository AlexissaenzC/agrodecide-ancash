import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createDOM} from './helpers/dom-fixture.js';

test('ingreso, ejemplo, oferta editable, comparación y gráfica usan el mismo estado',async()=>{
 const document=createDOM(await readFile(new URL('../index.html',import.meta.url),'utf8'));
 globalThis.document=document;const $=s=>document.querySelector(s),memory=new Map();
 globalThis.localStorage={getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,v),removeItem:k=>memory.delete(k)};
 globalThis.window={addEventListener(){},speechSynthesis:{cancel(){}}};globalThis.matchMedia=()=>({matches:true,addEventListener(){}});globalThis.requestAnimationFrame=()=>1;globalThis.cancelAnimationFrame=()=>{};
 const nativeTimeout=globalThis.setTimeout;globalThis.setTimeout=(fn,ms)=>{const timer=nativeTimeout(fn,ms);timer.unref();return timer;};
 const submit=form=>form.onsubmit({preventDefault(){},currentTarget:form});
 try{
  await import('../js/app.js');
  $('#username').value='agricultor';$('#password').value='papa123';submit($('#login-form'));
  assert.equal($('#workspace').hidden,false);assert.equal($('#login').hidden,true);assert.equal($('#lot-progress').value,0);
  $('#toggle-lot').onclick();assert.equal($('#toggle-lot').getAttribute('aria-expanded'),'true');assert.ok($('#workspace').classList.contains('lot-expanded'));$('#toggle-lot').onclick();assert.equal($('#toggle-lot').getAttribute('aria-expanded'),'false');
  $('#message').value='Tengo mil kilos de papa blanca';submit($('#chat-form'));assert.equal($('#typing-indicator').hidden,false);assert.equal($('#send').disabled,true);await new Promise(resolve=>nativeTimeout(resolve,420));assert.equal($('#typing-indicator').hidden,true);assert.equal($('#send').disabled,false);assert.equal($('#lot-progress').value,36);
  $('#load-demo').onclick();assert.match($('#metric-lot').textContent,/1[,. ]?000/);assert.match($('#metric-net').textContent,/1[,. ]?490/);assert.equal($('#lot-progress').value,100);
  $('#view-best').onclick();assert.equal($('#view-map').hidden,false);assert.equal($('#buyer-dialog').open,true);assert.match($('#buyer-detail').textContent,/Mercado La Cosecha/);
  const offer=$('#offer-form');offer.elements.transport.value='600';submit(offer);
  assert.match($('#metric-best').textContent,/Buen Campo/);assert.match($('#metric-net').textContent,/1[,. ]?445/);$('#close-buyer').onclick();assert.equal($('#buyer-dialog').open,false);
  const first=document.querySelectorAll('[data-compare]').find(c=>c.dataset.compare==='b1'),second=document.querySelectorAll('[data-compare]').find(c=>c.dataset.compare==='b3');first.checked=true;first.onchange();second.checked=true;second.onchange();assert.equal($('#compare').disabled,false);$('#compare').onclick();assert.equal($('#comparison-dialog').open,true);assert.match($('#comparison').textContent,/85/);$('#close-comparison').onclick();assert.equal($('#comparison-dialog').open,false);
  document.querySelectorAll('[data-view]').find(b=>b.dataset.view==='history').onclick();assert.equal($('#view-history').hidden,false);assert.equal(document.querySelectorAll('[data-history-day]').length,7);
  document.querySelectorAll('[data-history-days]').find(b=>b.dataset.historyDays==='30').onclick();assert.equal(document.querySelectorAll('[data-history-day]').length,30);document.querySelectorAll('[data-history-day]')[0].onfocus();assert.match($('#history-active-value').textContent,/Día 1/);
  document.querySelectorAll('[data-view]').find(b=>b.dataset.view==='chat').onclick();$('#message').value='Cambia la cantidad a 500 kilos';submit($('#chat-form'));await new Promise(resolve=>nativeTimeout(resolve,420));assert.match($('#metric-lot').textContent,/500/);assert.match($('#metric-best').textContent,/Santa Tierra/);assert.match($('#metric-net').textContent,/750/);assert.equal($('#lot-progress').value,100);
  $('#save').onclick();assert.ok(memory.get('agrodecide-v1'));$('#logout').onclick();assert.equal($('#workspace').hidden,true);assert.equal($('#login').hidden,false);
 }finally{globalThis.setTimeout=nativeTimeout;}
});
