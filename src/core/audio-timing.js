// Ignore codec padding and long TTS lead-in/out silence, preserving quiet consonants.
export function speechBounds(buffer) {
  const samples = buffer.getChannelData(0),
    rate = buffer.sampleRate;
  const frame = Math.max(1, Math.round(rate * 0.01)),
    threshold = 0.004;
  let first = -1,
    last = -1;
  for (let start = 0; start < samples.length; start += frame) {
    let energy = 0;
    const end = Math.min(start + frame, samples.length);
    for (let i = start; i < end; i++) energy += samples[i] * samples[i];
    if (Math.sqrt(energy / (end - start)) > threshold) {
      if (first < 0) first = start;
      last = end;
    }
  }
  if (first < 0) throw new Error("Recording contains no audible speech");
  const start = Math.max(0, first / rate - 0.07),
    end = Math.min(buffer.duration, last / rate + 0.09);
  return { offset: start, duration: end - start };
}
export function speechSchedule(buffers, now) {
  const rate = buffers.length > 1 ? 1.08 : 1;
  let at = now + 0.025;
  return buffers.map((buffer) => {
    const span = speechBounds(buffer);
    const entry = { buffer, at, rate, ...span };
    at += span.duration / rate + 0.035;
    return entry;
  });
}
