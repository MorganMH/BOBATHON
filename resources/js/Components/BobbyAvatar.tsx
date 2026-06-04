import { useState } from 'react';

/**
 * Bobby's face. Renders the AI logo from /public; if it isn't there yet it
 * falls back to a clean "B" badge so the demo never shows a broken image.
 *
 * Drop the logo at: public/bobby.png
 */
export default function BobbyAvatar({ size = 24, className }: { size?: number; className?: string }) {
    const [failed, setFailed] = useState(false);

    if (failed) {
        return (
            <span
                className={['cc-bobby cc-bobby--fallback', className].filter(Boolean).join(' ')}
                style={{ width: size, height: size, fontSize: size * 0.5 }}
                aria-hidden="true"
            >
                B
            </span>
        );
    }

    return (
        <img
            src="/bobby.png"
            alt=""
            aria-hidden="true"
            width={size}
            height={size}
            className={['cc-bobby', className].filter(Boolean).join(' ')}
            style={{ width: size, height: size }}
            onError={() => setFailed(true)}
        />
    );
}
