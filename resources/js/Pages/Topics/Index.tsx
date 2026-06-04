import { useMemo, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Search, Tag, Tile } from '@carbon/react';
import { Idea } from '@carbon/icons-react';
import { PageHeader, PriorityTag, SourceIcon } from '@/Components/ui';
import type { Topic } from '@/types';

export default function TopicsIndex({ topics }: { topics: Topic[] }) {
    const [query, setQuery] = useState('');

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return topics;
        return topics.filter(
            (t) => t.title.toLowerCase().includes(q) || t.summary.toLowerCase().includes(q),
        );
    }, [topics, query]);

    return (
        <>
            <Head title="Topics" />
            <PageHeader
                title="Topics to remember"
                subtitle="Durable memory across chat, email and meetings — the things Kathy shouldn't have to hold in her head."
            />

            <div style={{ maxWidth: 420, marginBottom: '1.5rem' }}>
                <Search labelText="Search topics" placeholder="Search topics" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>

            <div className="cc-grid cc-grid--2">
                {filtered.map((t) => (
                    <Tile key={t.id}>
                        <div className="cc-spread">
                            <div className="cc-row" style={{ gap: '0.5rem' }}>
                                <Idea />
                                <strong>{t.title}</strong>
                            </div>
                            <PriorityTag priority={t.importance} />
                        </div>
                        <p style={{ margin: '0.6rem 0 0.75rem' }}>{t.summary}</p>
                        <div className="cc-spread">
                            <span className="cc-row cc-muted" style={{ gap: '0.4rem', fontSize: '0.75rem' }}>
                                <SourceIcon type={t.source_type === 'mixed' ? 'chat' : t.source_type} size={14} />
                                {t.mentions} mentions · last {t.last_mentioned}
                            </span>
                            {t.project ? <Tag type="outline" size="sm">{t.project.code}</Tag> : null}
                        </div>
                        {t.participants.length ? (
                            <div className="cc-muted" style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>
                                {t.participants.join(', ')}
                            </div>
                        ) : null}
                        {t.stakeholder ? (
                            <Link href={`/stakeholders/${t.stakeholder.id}`} className="cc-muted" style={{ fontSize: '0.75rem' }}>
                                Owner: {t.stakeholder.name}
                            </Link>
                        ) : null}
                    </Tile>
                ))}
            </div>
            {filtered.length === 0 ? <p className="cc-muted">No topics match.</p> : null}
        </>
    );
}
