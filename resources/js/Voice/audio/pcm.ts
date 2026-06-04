// PCM / base64 helpers shared by mic capture and audio playback.

export function base64ToBytes(b64: string): Uint8Array {
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
}

export function bytesToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
        binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
    }
    return btoa(binary);
}

export function float32ToInt16(input: Float32Array): Int16Array {
    const out = new Int16Array(input.length);
    for (let i = 0; i < input.length; i++) {
        const s = Math.max(-1, Math.min(1, input[i]));
        out[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    return out;
}

export function int16ToFloat32(input: Int16Array): Float32Array {
    const out = new Float32Array(input.length);
    for (let i = 0; i < input.length; i++) out[i] = input[i] / 0x8000;
    return out;
}

/** Linear-interpolation downsample (e.g. 48 kHz mic → 16 kHz for Gemini). */
export function downsample(input: Float32Array, inRate: number, outRate: number): Float32Array {
    if (outRate >= inRate) return input;
    const ratio = inRate / outRate;
    const length = Math.floor(input.length / ratio);
    const out = new Float32Array(length);
    for (let i = 0; i < length; i++) {
        const pos = i * ratio;
        const idx = Math.floor(pos);
        const frac = pos - idx;
        out[i] = (input[idx] ?? 0) * (1 - frac) + (input[idx + 1] ?? 0) * frac;
    }
    return out;
}
