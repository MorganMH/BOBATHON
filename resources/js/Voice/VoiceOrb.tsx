import { useEffect } from 'react';
import { Button, InlineLoading, InlineNotification, Tag } from '@carbon/react';
import { Close, Microphone, MicrophoneOff } from '@carbon/icons-react';
import { useVoiceSession } from './useVoiceSession';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    voiceConfigured: boolean;
}

export default function VoiceOrb({ open, onOpenChange, voiceConfigured }: Props) {
    const voice = useVoiceSession();
    const { status, error, muted, speaking, turns, pendingConfirm, lastAction } = voice;

    // Stop the session if the panel is closed.
    useEffect(() => {
        if (!open && status !== 'idle') void voice.stop();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    // Stop on unmount.
    useEffect(() => () => void voice.stop(), []); // eslint-disable-line react-hooks/exhaustive-deps

    if (!open) return null;

    const live = status === 'live';
    const connecting = status === 'connecting';

    const orbClass = [
        'cc-voice__orb',
        live ? 'cc-voice__orb--live' : '',
        status === 'idle' || status === 'error' ? 'cc-voice__orb--idle' : '',
    ].join(' ');

    const onOrb = () => {
        if (live || connecting) void voice.stop();
        else void voice.start();
    };

    const statusLabel = connecting
        ? 'Connecting…'
        : speaking
          ? 'Atlas is speaking…'
          : live
            ? muted
                ? 'Muted — tap mic to unmute'
                : 'Listening… just talk'
            : 'Tap to talk to Atlas';

    return (
        <div
            role="dialog"
            aria-label="Atlas voice assistant"
            style={{
                position: 'fixed',
                bottom: '1.5rem',
                right: '1.5rem',
                width: '380px',
                maxWidth: 'calc(100vw - 2rem)',
                background: 'var(--cds-layer, #fff)',
                boxShadow: '0 12px 40px rgba(0,0,0,0.22)',
                borderRadius: '10px',
                padding: '1.25rem',
                zIndex: 9000,
            }}
        >
            <div className="cc-spread" style={{ marginBottom: '1rem' }}>
                <strong className="cc-row" style={{ gap: '0.5rem' }}>
                    Atlas
                    {live ? <Tag type="green" size="sm">Live</Tag> : null}
                </strong>
                <Button hasIconOnly kind="ghost" size="sm" renderIcon={Close} iconDescription="Close" onClick={() => onOpenChange(false)} />
            </div>

            <div className="cc-voice">
                <button
                    type="button"
                    className={orbClass}
                    onClick={onOrb}
                    aria-label={live ? 'Stop' : 'Start talking'}
                    style={speaking ? { transform: 'scale(1.05)' } : undefined}
                >
                    {connecting ? <InlineLoading /> : <Microphone size={34} />}
                </button>

                <p className="cc-muted" style={{ textAlign: 'center', margin: 0 }}>{statusLabel}</p>

                {live ? (
                    <div className="cc-row" style={{ justifyContent: 'center', gap: '0.5rem' }}>
                        <Button size="sm" kind={muted ? 'danger--tertiary' : 'tertiary'} renderIcon={muted ? MicrophoneOff : Microphone} onClick={voice.toggleMute}>
                            {muted ? 'Unmute' : 'Mute'}
                        </Button>
                        <Button size="sm" kind="ghost" onClick={() => void voice.stop()}>End</Button>
                    </div>
                ) : null}

                {!voiceConfigured && status !== 'error' ? (
                    <InlineNotification
                        kind="info"
                        lowContrast
                        hideCloseButton
                        title="Voice not configured"
                        subtitle="Add a GEMINI_API_KEY to .env, then tap the orb."
                    />
                ) : null}

                {error ? (
                    <InlineNotification kind="warning" lowContrast title="Voice" subtitle={error} onClose={() => void voice.stop()} />
                ) : null}

                {pendingConfirm ? (
                    <div style={{ border: '1px solid var(--cc-blue)', borderRadius: 6, padding: '0.75rem' }}>
                        <p style={{ margin: '0 0 0.5rem' }}>
                            <strong>Confirm:</strong> {humanize(pendingConfirm)}
                        </p>
                        <div className="cc-row" style={{ gap: '0.5rem' }}>
                            <Button size="sm" onClick={voice.confirmPending}>Confirm &amp; save</Button>
                            <Button size="sm" kind="ghost" onClick={voice.dismissPending}>Cancel</Button>
                        </div>
                    </div>
                ) : null}

                {lastAction ? <p className="cc-muted" style={{ fontSize: '0.8rem', margin: 0 }}>✓ {lastAction}</p> : null}

                {turns.length > 0 ? (
                    <div className="cc-voice__transcript">
                        {turns.map((t, i) => (
                            <div key={i} className="cc-voice__turn">
                                <div className="cc-voice__who">{t.role === 'user' ? 'Kathy' : 'Atlas'}</div>
                                <div>{t.text}</div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="cc-muted" style={{ fontSize: '0.8rem', textAlign: 'center', margin: 0 }}>
                        Try: “Who should I chase today?” · “Tell me about Priya” · “Who knows our payment gateway?”
                    </p>
                )}
            </div>
        </div>
    );
}

function humanize(p: { name: string; args: Record<string, unknown> }): string {
    if (p.name === 'create_reminder') {
        return `Draft a reminder to chase ${p.args.stakeholder ?? 'someone'} — “${p.args.reason ?? ''}”.`;
    }
    return `Run ${p.name}.`;
}
