import test from 'node:test';
import assert from 'node:assert/strict';
import { TRANSCRIPTION_MODEL, MODEL_DOWNLOAD_MB, assertModelMemory, transcriptionOptions, disposeTranscriptionPipeline } from '../transcription-config.js';

test('usa Whisper Small y nunca Whisper Tiny', () => {
  assert.equal(TRANSCRIPTION_MODEL, 'onnx-community/whisper-small');
  assert.doesNotMatch(TRANSCRIPTION_MODEL, /tiny/i);
});

test('configura transcripción explícita en español', () => {
  const options = transcriptionOptions();
  assert.equal(options.language, 'spanish');
  assert.equal(options.task, 'transcribe');
  assert.equal(options.return_timestamps, true);
});

test('documenta el peso aproximado del modelo local', () => {
  assert.ok(MODEL_DOWNLOAD_MB >= 240 && MODEL_DOWNLOAD_MB <= 270);
});

test('libera las sesiones ONNX al terminar la transcripción', async () => {
  let disposals = 0;
  await disposeTranscriptionPipeline({ dispose: async () => { disposals += 1; } });
  assert.equal(disposals, 1);
  await assert.doesNotReject(() => disposeTranscriptionPipeline(null));
});

test('detiene el modelo grande en dispositivos con menos de 4 GB declarados', () => {
  assert.throws(() => assertModelMemory(2), /4 GB|computadora/i);
  assert.doesNotThrow(() => assertModelMemory(4));
  assert.doesNotThrow(() => assertModelMemory(undefined));
});
