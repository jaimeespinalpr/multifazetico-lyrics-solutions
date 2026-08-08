export const MAX_AUDIO_SECONDS = 6 * 60;
export const MAX_AUDIO_BYTES = 30 * 1024 * 1024;
export const TARGET_SAMPLE_RATE = 16_000;
export const CORE_CHUNK_SECONDS = 28;
export const CHUNK_OVERLAP_SECONDS = 1;

export function validateAudio({ duration, size }) {
  if (!Number.isFinite(duration) || duration <= 0) throw new Error('No se pudo leer la duración del audio. Prueba con otro archivo MP3.');
  if (duration > MAX_AUDIO_SECONDS) throw new Error('Para proteger tu navegador, la canción no puede superar 6 minutos.');
  if (size > MAX_AUDIO_BYTES) throw new Error('Para proteger tu navegador, el archivo no puede superar 30 MB.');
}

export function extractMonoChunk(buffer, startSeconds, endSeconds, targetRate = TARGET_SAMPLE_RATE) {
  const sourceRate = buffer.sampleRate;
  const safeStart = Math.max(0, startSeconds);
  const safeEnd = Math.min(buffer.duration, Math.max(safeStart, endSeconds));
  const outputLength = Math.max(1, Math.floor((safeEnd - safeStart) * targetRate));
  const output = new Float32Array(outputLength);
  const channels = Array.from({ length: Math.min(2, buffer.numberOfChannels) }, (_, index) => buffer.getChannelData(index));
  const startFrame = safeStart * sourceRate;
  const ratio = sourceRate / targetRate;
  for (let i = 0; i < outputLength; i += 1) {
    const sourcePosition = startFrame + i * ratio;
    const leftIndex = Math.floor(sourcePosition);
    const rightIndex = Math.min(leftIndex + 1, channels[0].length - 1);
    const fraction = sourcePosition - leftIndex;
    let sample = 0;
    for (const channel of channels) sample += channel[leftIndex] * (1 - fraction) + channel[rightIndex] * fraction;
    output[i] = sample / channels.length;
  }
  return output;
}

export function shiftSegments(segments, windowStart, coreStart, coreEnd) {
  return (segments || []).map((segment) => {
    const relativeStart = Number(segment.start ?? segment.timestamp?.[0]) || 0;
    const relativeEnd = Number(segment.end ?? segment.timestamp?.[1]);
    const start = windowStart + relativeStart;
    const end = windowStart + (Number.isFinite(relativeEnd) ? relativeEnd : relativeStart + 3);
    return { start, end, text: String(segment.text || '').trim() };
  }).filter((segment) => {
    const midpoint = (segment.start + segment.end) / 2;
    return segment.text && midpoint > coreStart && midpoint <= coreEnd;
  });
}

export function chunkWindows(duration) {
  const windows = [];
  for (let coreStart = 0; coreStart < duration; coreStart += CORE_CHUNK_SECONDS) {
    const coreEnd = Math.min(duration, coreStart + CORE_CHUNK_SECONDS);
    windows.push({ coreStart, coreEnd, windowStart: Math.max(0, coreStart - CHUNK_OVERLAP_SECONDS), windowEnd: Math.min(duration, coreEnd + CHUNK_OVERLAP_SECONDS) });
  }
  return windows;
}
