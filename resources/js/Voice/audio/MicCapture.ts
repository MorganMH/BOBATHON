import { bytesToBase64, downsample, float32ToInt16 } from './pcm';

/**
 * Captures the microphone and emits base64 16 kHz mono PCM16 chunks — the
 * format Gemini Live expects for realtime input.
 *
 * Uses a ScriptProcessorNode (deprecated but universally supported and
 * dependency-free) rather than an AudioWorklet to keep the demo robust.
 */
export class MicCapture {
    private ctx: AudioContext | null = null;
    private stream: MediaStream | null = null;
    private source: MediaStreamAudioSourceNode | null = null;
    private processor: ScriptProcessorNode | null = null;
    private muted = false;

    constructor(
        private readonly onChunk: (base64: string) => void,
        private readonly onLevel?: (level: number) => void,
    ) {}

    async start(): Promise<void> {
        this.stream = await navigator.mediaDevices.getUserMedia({
            audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true, autoGainControl: true },
        });

        this.ctx = new AudioContext();
        if (this.ctx.state === 'suspended') await this.ctx.resume();

        this.source = this.ctx.createMediaStreamSource(this.stream);
        this.processor = this.ctx.createScriptProcessor(4096, 1, 1);

        this.processor.onaudioprocess = (e) => {
            if (this.muted || !this.ctx) return;
            const input = e.inputBuffer.getChannelData(0);

            if (this.onLevel) {
                let sum = 0;
                for (let i = 0; i < input.length; i++) sum += input[i] * input[i];
                this.onLevel(Math.sqrt(sum / input.length));
            }

            const down = downsample(input, this.ctx.sampleRate, 16000);
            const pcm16 = float32ToInt16(down);
            this.onChunk(bytesToBase64(pcm16.buffer));
        };

        // Output buffer is left silent, so connecting to destination makes no sound
        // but keeps onaudioprocess firing across browsers.
        this.source.connect(this.processor);
        this.processor.connect(this.ctx.destination);
    }

    setMuted(muted: boolean): void {
        this.muted = muted;
    }

    async stop(): Promise<void> {
        this.processor?.disconnect();
        this.source?.disconnect();
        this.stream?.getTracks().forEach((t) => t.stop());
        if (this.ctx && this.ctx.state !== 'closed') await this.ctx.close();
        this.processor = null;
        this.source = null;
        this.stream = null;
        this.ctx = null;
    }
}
