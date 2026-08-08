import test from 'node:test';
import assert from 'node:assert/strict';
import { SHARE_ENDPOINT, MAX_SHARE_BYTES, VIDEO_BITRATE, estimatedRecordingBytes, extensionForVideo, uploadSharedVideo } from '../share-utils.js';

test('usa el servicio HTTPS de Multifazético', () => {
  assert.equal(SHARE_ENDPOINT, 'https://lyrics.multifazetico.com/index.php?api=upload');
});

test('mantiene una canción de seis minutos por debajo de 100 MB', () => {
  assert.ok(estimatedRecordingBytes(360, VIDEO_BITRATE) < MAX_SHARE_BYTES);
});

test('elige la extensión correcta para MP4 y WebM', () => {
  assert.equal(extensionForVideo('video/mp4;codecs=avc1'), 'mp4');
  assert.equal(extensionForVideo('video/webm;codecs=vp9'), 'webm');
});

test('sube el video y devuelve un enlace verificable', async () => {
  const fakeFetch = async (url, options) => {
    assert.equal(url, SHARE_ENDPOINT);
    assert.equal(options.method, 'POST');
    assert.ok(options.body instanceof FormData);
    return { ok: true, json: async () => ({ id: 'a'.repeat(24), url: `https://lyrics.multifazetico.com/index.php?v=${'a'.repeat(24)}`, download_url: `https://lyrics.multifazetico.com/index.php?download=${'a'.repeat(24)}` }) };
  };
  const result = await uploadSharedVideo(new Blob(['video'], { type: 'video/webm' }), 'Mi canción', fakeFetch);
  assert.match(result.url, /^https:\/\/lyrics\.multifazetico\.com\//);
});

test('muestra el error en español cuando el servidor rechaza la subida', async () => {
  const fakeFetch = async () => ({ ok: false, json: async () => ({ error: 'El video debe pesar menos de 100 MB.' }) });
  await assert.rejects(() => uploadSharedVideo(new Blob(['x'], { type: 'video/webm' }), 'Video', fakeFetch), /100 MB/);
});
