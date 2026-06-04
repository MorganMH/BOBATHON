import { lazy, Suspense, useEffect, useState, type ReactNode } from 'react';
import { router, usePage } from '@inertiajs/react';
import {
    Theme,
    Header,
    HeaderName,
    HeaderNavigation,
    HeaderMenuItem,
    HeaderGlobalBar,
    HeaderGlobalAction,
    SkipToContent,
    ToastNotification,
} from '@carbon/react';
import { Microphone } from '@carbon/icons-react';
import type { SharedProps } from '@/types';

// Voice (and the Gemini SDK it pulls in) loads only when the orb opens.
const VoiceOrb = lazy(() => import('@/Voice/VoiceOrb'));

const NAV: { label: string; href: string }[] = [
    { label: 'Command Centre', href: '/' },
    { label: 'Stakeholders', href: '/stakeholders' },
    { label: 'Commitments', href: '/commitments' },
    { label: 'Communications', href: '/communications' },
    { label: 'Topics', href: '/topics' },
    { label: 'Projects', href: '/projects' },
];

export default function AppLayout({ children }: { children: ReactNode }) {
    const page = usePage<SharedProps>();
    const { currentUser, voiceConfigured, flash } = page.props;
    const url = page.url;

    const [voiceOpen, setVoiceOpen] = useState(false);
    const [toast, setToast] = useState<string | null>(null);

    useEffect(() => {
        if (!flash) return;
        setToast(flash);
        const t = setTimeout(() => setToast(null), 5000);
        return () => clearTimeout(t);
    }, [flash]);

    // Any "Ask Atlas" button on a page can open the global voice orb.
    useEffect(() => {
        const open = () => setVoiceOpen(true);
        window.addEventListener('atlas:open', open);
        return () => window.removeEventListener('atlas:open', open);
    }, []);

    const go = (href: string) => (e: React.MouseEvent) => {
        e.preventDefault();
        router.visit(href);
    };

    const isActive = (href: string) => (href === '/' ? url === '/' : url.startsWith(href));

    return (
        <Theme theme="white">
            <Header aria-label="Kathy's Command Centre">
                <SkipToContent />
                <HeaderName href="/" prefix="Kathy" onClick={go('/')}>
                    Command Centre
                </HeaderName>
                <HeaderNavigation aria-label="Primary navigation">
                    {NAV.map((item) => (
                        <HeaderMenuItem
                            key={item.href}
                            href={item.href}
                            isActive={isActive(item.href)}
                            onClick={go(item.href)}
                        >
                            {item.label}
                        </HeaderMenuItem>
                    ))}
                </HeaderNavigation>
                <HeaderGlobalBar>
                    <HeaderGlobalAction
                        aria-label="Talk to Atlas (voice)"
                        isActive={voiceOpen}
                        onClick={() => setVoiceOpen((o) => !o)}
                        tooltipAlignment="end"
                    >
                        <Microphone size={20} />
                    </HeaderGlobalAction>
                    <span
                        className="cc-avatar"
                        title={`${currentUser.name} · ${currentUser.role}`}
                        style={{ margin: '0 0.75rem' }}
                    >
                        {currentUser.initials}
                    </span>
                </HeaderGlobalBar>
            </Header>

            <main id="main-content" className="cc-main">
                {children}
            </main>

            {voiceOpen ? (
                <Suspense fallback={null}>
                    <VoiceOrb open={voiceOpen} onOpenChange={setVoiceOpen} voiceConfigured={voiceConfigured} />
                </Suspense>
            ) : null}

            {toast ? (
                <div style={{ position: 'fixed', top: '3.5rem', right: '1rem', zIndex: 9000 }}>
                    <ToastNotification
                        kind="success"
                        title="Done"
                        subtitle={toast}
                        lowContrast
                        onClose={() => setToast(null)}
                    />
                </div>
            ) : null}
        </Theme>
    );
}
