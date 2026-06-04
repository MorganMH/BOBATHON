import { base64ToBytes, int16ToFloat32 } from './pcm';

/**
 * Plays a stream of base64 24 kHz mono PCM16 chunks from Gemini Live, scheduling
 * each buffer back-to-back for gapless playback. Supports interruption (barge-in).
 */
export class PcmPlayer {
    private ctx: AudioContext | null = null;
    private queueTime = 0;
    private sources = new Set<AudioBufferSourceNode>();
    private readonly sampleRate = 24000;

    constructor(private readonly onPlayingChange?: (playing: boolean) => void) {}

    private ensureCtx(): AudioContext {
        if (!this.ctx) {
            this.ctx = new AudioContext({ sampleRate: this.sampleRate });
        }
        return this.ctx;
    }

    async enqueue(base64: string): Promise<void> {
        const ctx = this.ensureCtx();
        if (ctx.state === 'suspended') await ctx.resume();

        const int16 = new Int16Array(base64ToBytes(base64).buffer);
        if (int16.length === 0) return;
        const float32 = int16ToFloat32(int16);

        const buffer = ctx.createBuffer(1, float32.length, this.sampleRate);
        buffer.copyToChannel(float32, 0);

        const src = ctx.createBufferSource();
        src.buffer = buffer;
        src.connect(ctx.destination);

        const startAt = Math.max(ctx.currentTime, this.queueTime);
        src.start(startAt);
        this.queueTime = startAt + buffer.duration;

        this.sources.add(src);
        this.onPlayingChange?.(true);
        src.onended = () => {
            this.sources.delete(src);
            if (this.sources.size === 0) this.onPlayingChange?.(false);
        };
    }

    /** Stop anything still scheduled (model was interrupted by the user). */
    interrupt(): void {
        this.sources.forEach((s) => {
            try {
                s.stop();
            } catch {
                /* already stopped */
            }
        });
        this.sources.clear();
        this.queueTime = this.ctx?.currentTime ?? 0;
        this.onPlayingChange?.(false);
    }

    async stop(): Promise<void> {
        this.interrupt();
        if (this.ctx && this.ctx.state !== 'closed') await this.ctx.close();
        this.ctx = null;
        this.queueTime = 0;
    }
}
