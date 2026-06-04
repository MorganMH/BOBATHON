import { Button } from '@carbon/react';
import { Close, Microphone } from '@carbon/icons-react';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    voiceConfigured: boolean;
}

/**
 * Placeholder shell for the realtime voice assistant ("Atlas").
 * Replaced in the voice build step with the full Gemini Live session
 * (useVoiceSession + MicCapture + PcmPlayer + agent tools).
 */
export default function VoiceOrb({ open, onOpenChange, voiceConfigured }: Props) {
    if (!open) return null;

    return (
        <div
            style={{
                position: 'fixed',
                bottom: '1.5rem',
                right: '1.5rem',
                width: '360px',
                background: 'var(--cds-layer, #fff)',
                boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
                borderRadius: '8px',
                padding: '1.25rem',
                zIndex: 9000,
            }}
        >
            <div className="cc-spread" style={{ marginBottom: '1rem' }}>
                <strong>Atlas — voice assistant</strong>
                <Button
                    hasIconOnly
                    kind="ghost"
                    size="sm"
                    renderIcon={Close}
                    iconDescription="Close"
                    onClick={() => onOpenChange(false)}
                />
            </div>
            <div className="cc-voice">
                <button type="button" className="cc-voice__orb cc-voice__orb--idle" disabled>
                    <Microphone size={32} />
                </button>
                <p className="cc-muted" style={{ textAlign: 'center' }}>
                    {voiceConfigured
                        ? 'Realtime voice is being wired up. Press the orb to start a conversation.'
                        : 'Add a GEMINI_API_KEY to .env to enable realtime voice.'}
                </p>
            </div>
        </div>
    );
}
