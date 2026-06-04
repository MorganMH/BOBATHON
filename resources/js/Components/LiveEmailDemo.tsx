import { useState } from 'react';
import { Button, InlineLoading, Tag, Tile, ToastNotification } from '@carbon/react';
import { Email, Idea } from '@carbon/icons-react';
import api from '@/lib/api';

interface Action {
    title: string;
    owner: string | null;
    due: string | null;
    priority: string;
}
interface Result {
    email: { from: string; subject: string; body: string; project?: string };
    summary: string;
    actions: Action[];
    blockers: { title: string; severity: string }[];
    source: string;
}

type Stage = 'idle' | 'processing' | 'done';

/**
 * The "an email just arrived" wow-moment. Triggers POST /ai/process-email, which
 * summarises + extracts actions/blockers (via Gemini when a key is set, otherwise
 * a deterministic fallback), then animates the result in. No DB write — repeatable.
 */
export default function LiveEmailDemo() {
    const [stage, setStage] = useState<Stage>('idle');
    const [result, setResult] = useState<Result | null>(null);

    const trigger = async () => {
        setStage('processing');
        setResult(null);
        const start = Date.now();
        try {
            const { data } = await api.post('/ai/process-email', {});
            const wait = Math.max(0, 1700 - (Date.now() - start)); // let the "processing" beat land
            window.setTimeout(() => {
                setResult(data);
                setStage('done');
            }, wait);
        } catch {
            setStage('idle');
        }
    };

    return (
        <div style={{ marginBottom: '1.5rem' }}>
            <Button kind="tertiary" size="sm" renderIcon={Email} onClick={trigger} disabled={stage === 'processing'}>
                Simulate inbound email
            </Button>

            {/* Processing / success toast (fixed, top-right) */}
            {stage === 'processing' ? (
                <div style={{ position: 'fixed', top: '3.5rem', right: '1rem', zIndex: 9000 }}>
                    <ToastNotification kind="info" lowContrast hideCloseButton title="New email received" subtitle="From: Tom Wilson — API Integration Update">
                        <div style={{ marginTop: '0.5rem' }}>
                            <InlineLoading description="Atlas is reading and extracting actions…" />
                        </div>
                    </ToastNotification>
                </div>
            ) : null}

            {stage === 'done' && result ? (
                <>
                    <div style={{ position: 'fixed', top: '3.5rem', right: '1rem', zIndex: 9000 }}>
                        <ToastNotification
                            kind="success"
                            lowContrast
                            timeout={6000}
                            title="Email processed"
                            subtitle={`${result.actions.length} actions · ${result.blockers.length} blocker${result.blockers.length === 1 ? '' : 's'} · summary generated`}
                            onClose={() => undefined}
                        />
                    </div>

                    <Tile className="cc-new" style={{ marginTop: '1rem', padding: '1.25rem' }}>
                        <div className="cc-spread">
                            <div className="cc-row" style={{ gap: '0.5rem' }}>
                                <Email />
                                <strong>{result.email.subject}</strong>
                                <Tag type="blue" size="sm">New</Tag>
                            </div>
                            <Tag type="purple" size="sm">{result.source === 'gemini' ? 'Gemini' : 'AI (offline)'}</Tag>
                        </div>
                        <div className="cc-muted" style={{ fontSize: '0.8rem', margin: '0.25rem 0 0.75rem' }}>
                            From {result.email.from} · {result.email.project}
                        </div>

                        <div style={{ borderLeft: '4px solid var(--cc-blue)', paddingLeft: '0.75rem', marginBottom: '1rem' }}>
                            <div className="cc-row cc-muted" style={{ gap: '0.4rem', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                <Idea size={14} /> AI summary
                            </div>
                            <p style={{ margin: '0.3rem 0 0' }}>{result.summary}</p>
                        </div>

                        <div className="cc-grid cc-grid--2">
                            <div>
                                <strong style={{ fontSize: '0.85rem' }}>Actions captured</strong>
                                <ul style={{ margin: '0.4rem 0 0', paddingLeft: '1.1rem' }}>
                                    {result.actions.map((a, i) => (
                                        <li key={i} style={{ marginBottom: '0.25rem' }}>
                                            {a.title}
                                            {a.owner ? <span className="cc-muted"> — {a.owner}</span> : null}
                                            {a.due ? <Tag type="cool-gray" size="sm" style={{ marginLeft: '0.4rem' }}>{a.due}</Tag> : null}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <strong style={{ fontSize: '0.85rem' }}>Blockers detected</strong>
                                <ul style={{ margin: '0.4rem 0 0', paddingLeft: '1.1rem' }}>
                                    {result.blockers.map((b, i) => (
                                        <li key={i} style={{ color: 'var(--cc-red)', marginBottom: '0.25rem' }}>{b.title}</li>
                                    ))}
                                    {result.blockers.length === 0 ? <li className="cc-muted">None</li> : null}
                                </ul>
                            </div>
                        </div>
                        <p className="cc-muted" style={{ fontSize: '0.78rem', margin: '0.75rem 0 0' }}>
                            ✦ Captured automatically — Kathy didn't read the email or type a thing.
                        </p>
                    </Tile>
                </>
            ) : null}
        </div>
    );
}
