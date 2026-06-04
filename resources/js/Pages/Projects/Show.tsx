import { Head, Link, router } from '@inertiajs/react';
import { Tag, Tile } from '@carbon/react';
import { ArrowLeft, Send } from '@carbon/icons-react';
import { Button } from '@carbon/react';
import {
    Avatar,
    EmptyState,
    HealthTag,
    Meter,
    PriorityTag,
    SectionTitle,
    SourceIcon,
    StatusTag,
} from '@/Components/ui';
import type { Commitment, Communication, PersonBrief, Project, Topic } from '@/types';

interface TeamMember extends PersonBrief {
    role_on_project: string | null;
}

interface Props {
    project: Project;
    team: TeamMember[];
    commitments: Commitment[];
    communications: Communication[];
    topics: Topic[];
}

export default function ProjectShow({ project: p, team, commitments, communications, topics }: Props) {
    const open = commitments.filter((c) => c.status !== 'done');
    const nudge = (id: number) => router.post(`/commitments/${id}/nudge`, {}, { preserveScroll: true });

    return (
        <>
            <Head title={p.name} />

            <Link href="/projects" className="cc-row cc-muted" style={{ marginBottom: '1rem', fontSize: '0.85rem' }}>
                <ArrowLeft size={16} /> All projects
            </Link>

            <div className="cc-spread" style={{ marginBottom: '1.5rem', alignItems: 'flex-start' }}>
                <div>
                    <h1 style={{ margin: 0, fontWeight: 400 }}>{p.name}</h1>
                    <p className="cc-muted" style={{ margin: '0.15rem 0 0.5rem' }}>{p.code} · ends {p.end_label}</p>
                    <HealthTag health={p.health} />
                </div>
                <div style={{ minWidth: 220 }}>
                    <div className="cc-muted" style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}>{p.progress}% complete</div>
                    <Meter value={p.progress} color={p.health === 'red' ? 'var(--cc-red)' : p.health === 'yellow' ? 'var(--cc-yellow)' : 'var(--cc-green)'} />
                </div>
            </div>

            {p.description ? <p style={{ maxWidth: 760, marginBottom: '1.5rem' }}>{p.description}</p> : null}

            <section className="cc-section">
                <SectionTitle title={`Team (${team.length})`} />
                <div className="cc-grid cc-grid--3">
                    {team.map((m) => (
                        <Tile key={m.id} className="cc-tile-link">
                            <div className="cc-person">
                                <Avatar person={m} />
                                <div>
                                    <Link href={`/stakeholders/${m.id}`}><strong>{m.name}</strong></Link>
                                    <div className="cc-muted" style={{ fontSize: '0.78rem' }}>{m.role}</div>
                                </div>
                            </div>
                            <Tag type="outline" size="sm" style={{ marginTop: '0.5rem' }}>{m.role_on_project ?? 'Member'}</Tag>
                        </Tile>
                    ))}
                </div>
            </section>

            <div className="cc-grid cc-grid--2">
                <section className="cc-section">
                    <SectionTitle title={`Commitments (${open.length} open)`} />
                    <div className="cc-stack">
                        {commitments.map((c) => (
                            <Tile key={c.id}>
                                <div className="cc-spread">
                                    <strong>{c.title}</strong>
                                    <StatusTag status={c.status} />
                                </div>
                                <div className="cc-spread" style={{ marginTop: '0.5rem' }}>
                                    <span className="cc-muted" style={{ fontSize: '0.8rem', color: c.is_overdue ? 'var(--cc-red)' : undefined }}>
                                        {c.stakeholder?.name} · {c.is_overdue ? 'Overdue · ' : 'Due '}{c.due_label}
                                    </span>
                                    {c.status !== 'done' && c.direction === 'theirs' ? (
                                        <Button size="sm" kind="ghost" renderIcon={Send} onClick={() => nudge(c.id)}>Nudge</Button>
                                    ) : null}
                                </div>
                            </Tile>
                        ))}
                        {commitments.length === 0 ? <EmptyState title="No commitments" /> : null}
                    </div>
                </section>

                <div>
                    <section className="cc-section">
                        <SectionTitle title="Topics" />
                        <div className="cc-stack">
                            {topics.map((t) => (
                                <Tile key={t.id}>
                                    <div className="cc-spread"><strong>{t.title}</strong><PriorityTag priority={t.importance} /></div>
                                    <p className="cc-muted" style={{ margin: '0.4rem 0 0', fontSize: '0.85rem' }}>{t.summary}</p>
                                </Tile>
                            ))}
                            {topics.length === 0 ? <EmptyState title="No topics yet" /> : null}
                        </div>
                    </section>

                    <section className="cc-section">
                        <SectionTitle title="Recent communications" />
                        <div className="cc-stack">
                            {communications.map((c) => (
                                <Tile key={c.id}>
                                    <div className="cc-row" style={{ gap: '0.5rem' }}>
                                        <SourceIcon type={c.type} />
                                        <strong style={{ fontSize: '0.9rem' }}>{c.subject}</strong>
                                    </div>
                                    <div className="cc-muted" style={{ fontSize: '0.75rem', margin: '0.2rem 0 0' }}>
                                        {c.stakeholder?.name} · {c.occurred_label}
                                    </div>
                                </Tile>
                            ))}
                            {communications.length === 0 ? <EmptyState title="No messages" /> : null}
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}
