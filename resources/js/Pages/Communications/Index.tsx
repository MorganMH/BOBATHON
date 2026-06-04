import { useMemo, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button, ContentSwitcher, InlineLoading, Switch, Tag, Tile } from '@carbon/react';
import { AiGenerate, Idea } from '@carbon/icons-react';
import { Avatar, PageHeader, SentimentTag, SourceIcon } from '@/Components/ui';
import api from '@/lib/api';
import type { Communication } from '@/types';

interface Extracted {
    actions: { title: string; owner: string | null; due: string | null; priority: string }[];
    blockers: { title: string; severity: string }[];
}

export default function CommunicationsIndex({ communications }: { communications: Communication[] }) {
    const [typeIndex, setTypeIndex] = useState(0); // 0 all, 1 email, 2 chat, 3 meeting
    const [selectedId, setSelectedId] = useState<number | null>(communications[0]?.id ?? null);

    const [aiBusy, setAiBusy] = useState(false);
    const [aiSummary, setAiSummary] = useState<string | null>(null);
    const [extracted, setExtracted] = useState<Extracted | null>(null);

    const types = ['all', 'email', 'chat', 'meeting'];
    const filtered = useMemo(
        () => communications.filter((c) => typeIndex === 0 || c.type === types[typeIndex]),
        [communications, typeIndex],
    );

    const selected = communications.find((c) => c.id === selectedId) ?? filtered[0] ?? null;

    const select = (id: number) => {
        setSelectedId(id);
        setAiSummary(null);
        setExtracted(null);
    };

    const summarize = async () => {
        if (!selected) return;
        setAiBusy(true);
        try {
            const { data } = await api.post('/ai/summarize', { text: selected.body });
            setAiSummary(data.summary);
        } finally {
            setAiBusy(false);
        }
    };

    const extract = async () => {
        if (!selected) return;
        setAiBusy(true);
        try {
            const { data } = await api.post('/ai/extract', { text: selected.body });
            setExtracted({ actions: data.actions ?? [], blockers: data.blockers ?? [] });
        } finally {
            setAiBusy(false);
        }
    };

    return (
        <>
            <Head title="Communications" />
            <PageHeader title="Communications" subtitle="Email, chat and meetings in one place — with AI summaries and action extraction." />

            <ContentSwitcher onChange={({ index }) => setTypeIndex(index ?? 0)} selectedIndex={typeIndex} size="md" style={{ maxWidth: 480, marginBottom: '1rem' }}>
                <Switch name="all" text="All" />
                <Switch name="email" text="Email" />
                <Switch name="chat" text="Chat" />
                <Switch name="meeting" text="Meetings" />
            </ContentSwitcher>

            <div className="cc-grid" style={{ gridTemplateColumns: 'minmax(280px, 1fr) 2fr' }}>
                {/* List */}
                <div className="cc-stack" style={{ maxHeight: '70vh', overflowY: 'auto', paddingRight: '0.25rem' }}>
                    {filtered.map((c) => (
                        <Tile
                            key={c.id}
                            className="cc-tile-link"
                            style={{
                                cursor: 'pointer',
                                outline: c.id === selected?.id ? '2px solid var(--cc-blue)' : 'none',
                            }}
                            onClick={() => select(c.id)}
                        >
                            <div className="cc-row" style={{ gap: '0.4rem', justifyContent: 'space-between' }}>
                                <span className="cc-row" style={{ gap: '0.4rem' }}>
                                    <SourceIcon type={c.type} />
                                    <strong style={{ fontSize: '0.9rem' }}>{c.subject}</strong>
                                </span>
                                {c.is_unread ? <Tag type="blue" size="sm">New</Tag> : null}
                            </div>
                            <div className="cc-muted" style={{ fontSize: '0.75rem', margin: '0.25rem 0 0' }}>
                                {c.stakeholder?.name} · {c.occurred_label}
                            </div>
                            <div className="cc-row" style={{ gap: '0.25rem', marginTop: '0.4rem' }}>
                                {c.has_blocker ? <Tag type="red" size="sm">Blocker</Tag> : null}
                                {c.has_action ? <Tag type="teal" size="sm">Action</Tag> : null}
                            </div>
                        </Tile>
                    ))}
                </div>

                {/* Detail */}
                {selected ? (
                    <Tile>
                        <div className="cc-spread">
                            <div className="cc-person">
                                {selected.stakeholder ? <Avatar person={selected.stakeholder} /> : null}
                                <div>
                                    <h3 style={{ margin: 0, fontWeight: 400 }}>{selected.subject}</h3>
                                    <div className="cc-muted" style={{ fontSize: '0.8rem' }}>
                                        {selected.stakeholder ? (
                                            <Link href={`/stakeholders/${selected.stakeholder.id}`}>{selected.stakeholder.name}</Link>
                                        ) : 'Unknown'}{' '}· {selected.occurred_label} · {selected.project?.code}
                                    </div>
                                </div>
                            </div>
                            {selected.sentiment ? <SentimentTag sentiment={selected.sentiment} /> : null}
                        </div>

                        {selected.participants.length ? (
                            <p className="cc-muted" style={{ fontSize: '0.8rem', margin: '0.75rem 0 0' }}>
                                Participants: {selected.participants.join(', ')}
                            </p>
                        ) : null}

                        <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', margin: '1rem 0', lineHeight: 1.5 }}>
                            {selected.body}
                        </pre>

                        {selected.ai_summary ? (
                            <div style={{ background: 'var(--cds-layer-02, #fff)', borderLeft: '4px solid var(--cc-blue)', padding: '0.75rem 1rem', marginBottom: '1rem' }}>
                                <div className="cc-row cc-muted" style={{ gap: '0.4rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                    <Idea size={14} /> AI summary
                                </div>
                                <p style={{ margin: '0.4rem 0 0' }}>{selected.ai_summary}</p>
                            </div>
                        ) : null}

                        <div className="cc-row" style={{ gap: '0.5rem' }}>
                            <Button size="sm" kind="tertiary" renderIcon={AiGenerate} onClick={summarize} disabled={aiBusy}>Re-summarise</Button>
                            <Button size="sm" kind="tertiary" renderIcon={Idea} onClick={extract} disabled={aiBusy}>Extract actions</Button>
                            {aiBusy ? <InlineLoading description="Working…" /> : null}
                        </div>

                        {aiSummary ? <p style={{ marginTop: '1rem' }}><strong>Fresh summary:</strong> {aiSummary}</p> : null}

                        {extracted ? (
                            <div style={{ marginTop: '1rem' }}>
                                {extracted.actions.length > 0 && (
                                    <>
                                        <strong>Actions</strong>
                                        <ul>
                                            {extracted.actions.map((a, i) => (
                                                <li key={i}>{a.title}{a.owner ? ` — ${a.owner}` : ''}{a.due ? ` (${a.due})` : ''}</li>
                                            ))}
                                        </ul>
                                    </>
                                )}
                                {extracted.blockers.length > 0 && (
                                    <>
                                        <strong>Blockers</strong>
                                        <ul>
                                            {extracted.blockers.map((b, i) => <li key={i} style={{ color: 'var(--cc-red)' }}>{b.title}</li>)}
                                        </ul>
                                    </>
                                )}
                            </div>
                        ) : null}
                    </Tile>
                ) : <Tile>No message selected.</Tile>}
            </div>
        </>
    );
}
