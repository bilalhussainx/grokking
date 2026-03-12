/**
 * AudioWorklet processor that captures mic audio and converts to PCM16.
 * Sends every frame immediately for lowest latency.
 */
class AudioCaptureProcessor extends AudioWorkletProcessor {
  process(inputs) {
    const input = inputs[0];
    if (!input || !input[0] || input[0].length === 0) return true;

    const float32 = input[0];

    // Convert Float32 [-1,1] to PCM16 Int16
    const pcm16 = new Int16Array(float32.length);
    for (let i = 0; i < float32.length; i++) {
      const s = Math.max(-1, Math.min(1, float32[i]));
      pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }

    // Send immediately — no buffering
    this.port.postMessage(pcm16.buffer, [pcm16.buffer]);

    return true;
  }
}

registerProcessor("audio-capture-processor", AudioCaptureProcessor);
