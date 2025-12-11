// DSP Audio Engine - Gospel Claws Protocol
// Ported from Python

export interface SignalParams {
  duration: number;
  sampleRate: number;
  threshold: number;
  smoothness: number;
  sparkGain: number;
  humGain: number;
}

export function generateSignal(params: SignalParams): {
  audioBuffer: Float32Array;
  envelope: Float32Array;
  timeArray: Float32Array;
} {
  const { duration, sampleRate, threshold, smoothness, sparkGain, humGain } = params;
  const numSamples = Math.floor(sampleRate * duration);

  // Time array
  const timeArray = new Float32Array(numSamples);
  for (let i = 0; i < numSamples; i++) {
    timeArray[i] = i / sampleRate;
  }

  // A. The Carrier: 60Hz Mains Hum ("Looming Darkness")
  const hum = new Float32Array(numSamples);
  for (let i = 0; i < numSamples; i++) {
    const t = timeArray[i];
    hum[i] = humGain * (
      Math.sin(2 * Math.PI * 60 * t) +
      0.4 * Math.sin(2 * Math.PI * 120 * t) +
      0.3 * Math.sin(2 * Math.PI * 180 * t) +
      0.2 * Math.sin(2 * Math.PI * 300 * t)
    );
  }

  // B. The Modulator: Stochastic Contact ("Hand on the Cable")
  const rawNoise = new Float32Array(numSamples);
  for (let i = 0; i < numSamples; i++) {
    rawNoise[i] = Math.random();
  }

  // Smooth the noise (Low Pass Filter)
  const windowSize = Math.max(1, Math.floor(smoothness));
  const envelope = movingAverage(rawNoise, windowSize);

  // Normalize envelope
  let maxVal = envelope[0];
  let minVal = envelope[0];
  for (let i = 1; i < envelope.length; i++) {
    if (envelope[i] > maxVal) maxVal = envelope[i];
    if (envelope[i] < minVal) minVal = envelope[i];
  }
  if (maxVal > minVal) {
    for (let i = 0; i < numSamples; i++) {
      envelope[i] = (envelope[i] - minVal) / (maxVal - minVal);
    }
  }

  // C. The Spark: Derivative of envelope
  const friction = new Float32Array(numSamples);
  friction[0] = 0;
  for (let i = 1; i < numSamples; i++) {
    friction[i] = Math.abs(envelope[i] - envelope[i - 1]);
  }

  // D. Synthesis
  const audioBuffer = new Float32Array(numSamples);
  for (let i = 0; i < numSamples; i++) {
    const connectionMask = envelope[i] > threshold ? 1 : 0;
    const spark = (Math.random() - 0.5) * 2 * friction[i] * sparkGain;
    audioBuffer[i] = Math.max(-1, Math.min(1, hum[i] * connectionMask + spark));
  }

  return { audioBuffer, envelope, timeArray };
}

function movingAverage(arr: Float32Array, windowSize: number): Float32Array {
  const result = new Float32Array(arr.length);
  for (let i = 0; i < arr.length; i++) {
    let sum = 0;
    let count = 0;
    for (let j = Math.max(0, i - Math.floor(windowSize / 2));
         j < Math.min(arr.length, i + Math.ceil(windowSize / 2)); j++) {
      sum += arr[j];
      count++;
    }
    result[i] = sum / count;
  }
  return result;
}

export function createWavFile(audioBuffer: Float32Array, sampleRate: number): Blob {
  const numChannels = 1;
  const bitsPerSample = 16;
  const bytesPerSample = bitsPerSample / 8;
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = audioBuffer.length * bytesPerSample;

  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  // RIFF header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  // Audio data
  let offset = 44;
  for (let i = 0; i < audioBuffer.length; i++) {
    const sample = Math.max(-1, Math.min(1, audioBuffer[i]));
    view.setInt16(offset, sample * 32767, true);
    offset += 2;
  }

  return new Blob([buffer], { type: 'audio/wav' });
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}
