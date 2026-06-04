import { useId, useState, type ReactNode } from 'react';
import { Tag } from '@carbon/react';

/**
 * The "Atlas" AI brand mark. Prefers a user-supplied /ailogo.png if present,
 * otherwise renders a crisp inline gradient sparkle (no network, no flash).
 */
let pngMissing = false;

export function AtlasMark({ size = 28, className }: { size?: number; className?: string }) {
    const id = useId().replace(/:/g, '');
    const [missing, setMissing] = useState(pngMissing);

    if (!missing) {
        return (
            <img
                src="/ailogo.png"
                width={size}
                height={size}
                alt="Atlas"
                className={className}
                style={{ borderRadius: size * 0.28, display: 'block' }}
                onError={() => {
                    pngMissing = true;
                    setMissing(true);
                }}
            />
        );
    }

    return (
        <svg width={size} height={size} viewBox="0 0 48 48" className={className} role="img" aria-label="Atlas">
            <defs>
                <linearGradient id={`atlas-${id}`} x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#4589ff" />
                    <stop offset="0.55" stopColor="#8a3ffc" />
                    <stop offset="1" stopColor="#007d79" />
                </linearGradient>
            </defs>
            <rect width="48" height="48" rx="13" fill={`url(#atlas-${id})`} />
            <path d="M24 10.5c1.3 6.6 2.7 8 9.3 9.3-6.6 1.3-8 2.7-9.3 9.3-1.3-6.6-2.7-8-9.3-9.3C21.3 17.2 22.7 15.8 24 10.5Z" fill="#fff" />
            <path d="M33.5 28c.55 2.6 1.1 3.15 3.7 3.7-2.6.55-3.15 1.1-3.7 3.7-.55-2.6-1.1-3.15-3.7-3.7 2.6-.55 3.15-1.1 3.7-3.7Z" fill="#fff" fillOpacity="0.88" />
        </svg>
    );
}

export function AiShimmer({ lines = 3 }: { lines?: number }) {
    return (
        <div className="cc-shimmer" aria-label="Atlas is thinking">
            {Array.from({ length: lines }).map((_, i) => (
                <span key={i} className="cc-shimmer__line" style={{ width: `${90 - i * 12}%` }} />
            ))}
        </div>
    );
}

/** A panel that visually marks AI-generated content. */
export function AiPanel({
    title = 'Atlas',
    source,
    loading,
    eyebrow,
    children,
    action,
}: {
    title?: string;
    source?: string | null;
    loading?: boolean;
    eyebrow?: string;
    children?: ReactNode;
    action?: ReactNode;
}) {
    return (
        <div className={`cc-ai-panel${loading ? ' cc-ai-panel--loading' : ''}`}>
            <div className="cc-ai-panel__inner">
                <div className="cc-ai-panel__head">
                    <AtlasMark size={24} />
                    <span className="cc-ai-panel__title">{eyebrow ?? title}</span>
                    {source ? (
                        <Tag type={source === 'gemini' ? 'purple' : 'cool-gray'} size="sm">
                            {source === 'gemini' ? 'Gemini' : 'offline'}
                        </Tag>
                    ) : null}
                    <span style={{ flex: 1 }} />
                    {action}
                </div>
                <div className="cc-ai-panel__body">{loading ? <AiShimmer /> : children}</div>
            </div>
        </div>
    );
}

/** Small inline "AI" chip used to label AI-derived fields. */
export function AiChip({ label = 'AI' }: { label?: string }) {
    return (
        <span className="cc-ai-chip">
            <AtlasMark size={13} />
            {label}
        </span>
    );
}
