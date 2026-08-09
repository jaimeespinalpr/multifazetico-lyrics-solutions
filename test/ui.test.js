import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('elimina completamente la opción de demostración', () => {
  assert.doesNotMatch(html, /boton-demo|letra de demostración/i);
});

test('explica que la transcripción usa Whisper Small local', () => {
  assert.match(html, /Whisper Small/i);
  assert.match(html, /249 MB/i);
});

test('incluye controles para compartir, copiar y descargar el video', () => {
  assert.match(html, /id="compartir-video"/);
  assert.match(html, /id="copiar-enlace"/);
  assert.match(html, /id="descargar-video"/);
  assert.match(html, /id="enlace-compartido"/);
});
