import test from 'node:test';
import assert from 'node:assert/strict';
import {bubblePlacement} from '../js/scene-layout.js';

test('el globo cabe dentro de escenas de PC, tableta y celular',()=>{for(const viewport of[{width:300,height:180},{width:375,height:220},{width:600,height:268},{width:900,height:400}])for(const anchor of[[25,60],[viewport.width/2,viewport.height/2],[viewport.width-25,viewport.height-25]]){const box=bubblePlacement(anchor,viewport,{width:140,height:42});assert.ok(box.x>=8);assert.ok(box.y>=36);assert.ok(box.x+box.width<=viewport.width-8);assert.ok(box.y+box.height<=viewport.height-20);}});
test('el globo prefiere un lado libre del camión y del nombre de ciudad',()=>{const anchor=[300,160],label={x:325,y:90,width:100,height:45},box=bubblePlacement(anchor,{width:600,height:280},{width:150,height:42},label);const overlap=(a,b)=>Math.max(0,Math.min(a.x+a.width,b.x+b.width)-Math.max(a.x,b.x))*Math.max(0,Math.min(a.y+a.height,b.y+b.height)-Math.max(a.y,b.y));assert.equal(overlap(box,label),0);assert.equal(overlap(box,{x:285,y:148,width:30,height:30}),0);});
