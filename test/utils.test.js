import test from 'node:test';import assert from 'node:assert/strict';import {formatTime,sanitizeSegments,toTXT,toSRT,toLRC,activeIndex} from '../utils.js';
test('formatea tiempos para subtítulos SRT',()=>assert.equal(formatTime(65.25),'00:01:05,250'));
test('normaliza segmentos y completa un final faltante',()=>assert.deepEqual(sanitizeSegments([{timestamp:[1,3],text:' Hola '},{timestamp:[3,null],text:'Mundo'}]),[{start:1,end:3,text:'Hola'},{start:3,end:6,text:'Mundo'}]));
test('genera TXT SRT y LRC en español',()=>{const x=[{start:1.5,end:3,text:'Hola mundo'}];assert.equal(toTXT(x),'Hola mundo');assert.match(toSRT(x),/00:00:01,500 --> 00:00:03,000/);assert.equal(toLRC(x),'[00:01.50]Hola mundo')});
test('encuentra el verso activo',()=>{const x=[{start:0,end:2,text:'a'},{start:2,end:4,text:'b'}];assert.equal(activeIndex(x,2.5),1)});
