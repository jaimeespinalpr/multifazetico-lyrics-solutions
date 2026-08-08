import test from 'node:test';
import assert from 'node:assert/strict';
import { MAX_AUDIO_SECONDS, validateAudio, extractMonoChunk, shiftSegments } from '../audio-utils.js';

test('rechaza canciones cuya duración puede cerrar el navegador', () => {
  assert.throws(() => validateAudio({ duration: MAX_AUDIO_SECONDS + 1, size: 1_000_000 }), /6 minutos/);
});
test('rechaza archivos excesivamente grandes antes de cargar la IA', () => {
  assert.throws(() => validateAudio({ duration: 60, size: 31 * 1024 * 1024 }), /30 MB/);
});
test('extrae y remuestrea un fragmento estéreo sin crear un OfflineAudioContext', () => {
  const left = Float32Array.from([0, 1, 0, -1, 0, 1, 0, -1]);
  const right = Float32Array.from([0, 0, 0, 0, 0, 0, 0, 0]);
  const fakeBuffer = { sampleRate: 8, duration: 1, numberOfChannels: 2, getChannelData: (channel) => channel === 0 ? left : right };
  assert.deepEqual(Array.from(extractMonoChunk(fakeBuffer, 0, 1, 4)), [0, 0, 0, 0]);
});
test('desplaza tiempos relativos y conserva solo el núcleo del fragmento', () => {
  const result = shiftSegments([{ timestamp: [0, 2], text: 'duplicada' }, { timestamp: [2, 4], text: 'válida' }], 9, 10, 13);
  assert.deepEqual(result, [{ start: 11, end: 13, text: 'válida' }]);
});
