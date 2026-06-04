import { useCallback, useRef, useState } from 'react';
import { router } from '@inertiajs/react';
import { GoogleGenAI, Modality } from '@google/genai';
import api from '@/lib/api';
import { MicCapture } from './audio/MicCapture';
import { PcmPlayer } from './audio/PcmPlayer';

export type VoiceStatus = 'idle' | 'connecting' | 'live' | 'error';
export interface Turn {
    role: 'user' | 'atlas';
    text: string;
}
export interface PendingConfirm {
    name: string;
    args: Record<string, unknown>;
    message: string;
}

const PAGE_PATHS: Record<string, string> = {
    dashboard: '/',
    home: '/',
    stakeholders: '/stakeholders',
    people: '/stakeholders',
    commitments: '/commitments',
    communications: '/communications',
    inbox: '/communications',
    topics: '/topics',
    projects: '/projects',
};

function resolvePath(to?: string): string | null {
    if (!to) return null;
    if (to.startsWith('/')) return to;
    return PAGE_PATHS[to.toLowerCase().trim()] ?? null;
}

export function useVoiceSession() {
    const [status, setStatus] = useState<VoiceStatus>('idle');
    const [error, setError] = useState<string | null>(null);
    const [muted, setMuted] = useState(false);
    const [speaking, setSpeaking] = useState(false);
    const [level, setLevel] = useState(0);
    const [turns, setTurns] = useState<Turn[]>([]);
    const [pendingConfirm, setPendingConfirm] = useState<PendingConfirm | null>(null);
    const [lastAction, setLastAction] = useState<string | null>(null);

    const aiRef = useRef<GoogleGenAI | null>(null);
    const liveRef = useRef<any>(null);
    const micRef = useRef<MicCapture | null>(null);
    const playerRef = useRef<PcmPlayer | null>(null);
    const turnsRef = useRef<Turn[]>([]);

    const appendText = useCallback((role: 'user' | 'atlas', text: string) => {
        const arr = turnsRef.current;
        const last = arr[arr.length - 1];
        if (last && last.role === role) {
            last.text += text;
        } else {
            arr.push({ role, text });
        }
        setTurns([...arr]);
    }, []);

    const cleanup = useCallback(async () => {
        try {
            await micRef.current?.stop();
        } catch {
            /* noop */
        }
        try {
            await playerRef.current?.stop();
        } catch {
            /* noop */
        }
        try {
            liveRef.current?.close();
        } catch {
            /* noop */
        }
        micRef.current = null;
        playerRef.current = null;
        liveRef.current = null;
        aiRef.current = null;
    }, []);

    const handleToolCalls = useCallback(async (calls: any[]) => {
        const responses: any[] = [];
        for (const fc of calls) {
            const name: string = fc.name;
            const args = (fc.args ?? {}) as Record<string, unknown>;

            if (name === 'navigate') {
                const to = resolvePath(args.to as string);
                if (to) router.visit(to);
                responses.push({ id: fc.id, name, response: { result: { ok: !!to, navigated: to } } });
                continue;
            }

            try {
                const { data } = await api.post('/agent/tools/execute', { name, args });
                if (data.status === 'needs_confirmation') {
                    setPendingConfirm({ name, args, message: data.message });
                    responses.push({
                        id: fc.id,
                        name,
                        response: { result: { status: 'awaiting_user_confirmation', note: 'Kathy must confirm in the app before this is saved.' } },
                    });
                } else {
                    responses.push({ id: fc.id, name, response: { result: data.result } });
                }
            } catch {
                responses.push({ id: fc.id, name, response: { result: { error: 'tool failed' } } });
            }
        }
        try {
            liveRef.current?.sendToolResponse({ functionResponses: responses });
        } catch {
            /* session may have closed */
        }
    }, []);

    const handleMessage = useCallback(
        (m: any) => {
            const sc = m.serverContent;
            if (m.toolCall?.functionCalls?.length) {
                void handleToolCalls(m.toolCall.functionCalls);
            }
            if (sc?.inputTranscription?.text) appendText('user', sc.inputTranscription.text);
            if (sc?.outputTranscription?.text) appendText('atlas', sc.outputTranscription.text);
            const parts = sc?.modelTurn?.parts ?? [];
            for (const p of parts) {
                if (p.inlineData?.data) void playerRef.current?.enqueue(p.inlineData.data);
            }
            if (sc?.interrupted) playerRef.current?.interrupt();
        },
        [appendText, handleToolCalls],
    );

    const start = useCallback(async () => {
        setError(null);
        setStatus('connecting');
        turnsRef.current = [];
        setTurns([]);

        let session: any;
        try {
            const { data } = await api.get('/voice/session');
            session = data;
        } catch {
            setError('Could not reach the voice service.');
            setStatus('error');
            return;
        }

        if (!session.available) {
            setError(
                session.reason === 'no_key'
                    ? 'Add a GEMINI_API_KEY to your .env to enable realtime voice.'
                    : 'Voice is unavailable right now.',
            );
            setStatus('error');
            return;
        }

        try {
            const ai = new GoogleGenAI({ apiKey: session.apiKey ?? session.token });
            aiRef.current = ai;
            playerRef.current = new PcmPlayer(setSpeaking);

            const live = await ai.live.connect({
                model: session.model,
                config: {
                    responseModalities: [Modality.AUDIO],
                    systemInstruction: session.systemInstruction,
                    tools: session.tools,
                    inputAudioTranscription: {},
                    outputAudioTranscription: {},
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: session.voice } } },
                },
                callbacks: {
                    onopen: () => setStatus('live'),
                    onmessage: handleMessage,
                    onerror: () => {
                        setError('Voice connection error.');
                        setStatus('error');
                    },
                    onclose: () => {
                        setStatus((s) => (s === 'error' ? s : 'idle'));
                    },
                },
            });
            liveRef.current = live;

            const mic = new MicCapture(
                (b64) => liveRef.current?.sendRealtimeInput({ media: { data: b64, mimeType: 'audio/pcm;rate=16000' } }),
                setLevel,
            );
            micRef.current = mic;
            await mic.start();
        } catch (e: any) {
            setError(e?.message ?? 'Could not start the microphone or session.');
            setStatus('error');
            await cleanup();
        }
    }, [cleanup, handleMessage]);

    const stop = useCallback(async () => {
        await cleanup();
        setStatus('idle');
        setSpeaking(false);
        setLevel(0);
    }, [cleanup]);

    const toggleMute = useCallback(() => {
        setMuted((m) => {
            micRef.current?.setMuted(!m);
            return !m;
        });
    }, []);

    const confirmPending = useCallback(async () => {
        if (!pendingConfirm) return;
        try {
            const { data } = await api.post('/agent/tools/confirm', { name: pendingConfirm.name, args: pendingConfirm.args });
            setLastAction(data?.result?.created ?? 'Done.');
            router.reload();
        } catch {
            setLastAction('Could not complete that action.');
        } finally {
            setPendingConfirm(null);
        }
    }, [pendingConfirm]);

    const dismissPending = useCallback(() => setPendingConfirm(null), []);

    return {
        status,
        error,
        muted,
        speaking,
        level,
        turns,
        pendingConfirm,
        lastAction,
        start,
        stop,
        toggleMute,
        confirmPending,
        dismissPending,
    };
}
