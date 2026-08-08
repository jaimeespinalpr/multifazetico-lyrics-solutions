export const SHARE_ENDPOINT = 'https://lyrics.multifazetico.com/index.php?api=upload';
export const MAX_SHARE_BYTES = 100 * 1024 * 1024;
export const VIDEO_BITRATE = 1_800_000;
const ESTIMATED_AUDIO_BITRATE = 128_000;
const SHARE_ORIGIN = 'https://lyrics.multifazetico.com';

export function estimatedRecordingBytes(durationSeconds, videoBitrate = VIDEO_BITRATE) {
  return Math.ceil((Number(durationSeconds) || 0) * (videoBitrate + ESTIMATED_AUDIO_BITRATE) / 8);
}

export function extensionForVideo(mime = '') {
  return mime.toLowerCase().includes('mp4') ? 'mp4' : 'webm';
}

export async function uploadSharedVideo(blob, title, fetchImpl = fetch) {
  if (!(blob instanceof Blob) || blob.size === 0) {
    throw new Error('Primero debes crear el video karaoke.');
  }
  if (blob.size > MAX_SHARE_BYTES) {
    throw new Error('El video debe pesar menos de 100 MB para compartirlo.');
  }
  const extension = extensionForVideo(blob.type);
  const form = new FormData();
  form.append('video', blob, `multifazetico-karaoke.${extension}`);
  form.append('titulo', String(title || 'Video karaoke').slice(0, 100));
  const response = await fetchImpl(SHARE_ENDPOINT, { method: 'POST', body: form });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'No se pudo compartir el video. Inténtalo otra vez.');
  const url = new URL(String(data.url || ''));
  const downloadUrl = new URL(String(data.download_url || ''));
  if (url.origin !== SHARE_ORIGIN || downloadUrl.origin !== SHARE_ORIGIN || !/^[a-f0-9]{24}$/.test(String(data.id || ''))) {
    throw new Error('El servidor devolvió un enlace no válido.');
  }
  return { id: data.id, url: url.href, downloadUrl: downloadUrl.href };
}
