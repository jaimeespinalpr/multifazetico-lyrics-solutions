export const TRANSCRIPTION_MODEL = 'onnx-community/whisper-small';
export const MODEL_DOWNLOAD_MB = 249;

export function assertModelMemory(deviceMemory) {
  if (Number.isFinite(deviceMemory) && deviceMemory < 4) {
    throw new Error('Whisper Small necesita al menos 4 GB de memoria. Usa una computadora o un dispositivo con más memoria para obtener una transcripción fiable.');
  }
}

export function transcriptionOptions() {
  return {
    language: 'spanish',
    task: 'transcribe',
    return_timestamps: true,
  };
}
