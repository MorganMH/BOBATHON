import { Head, Link, router } from '@inertiajs/react';
import { Button, ClickableTile, Tile } from '@carbon/react';
import { ArrowUpRight, Microphone, Send } from '@carbon/icons-react';
import {
    Avatar,
    EmptyState,
    HealthTag,
    Meter,
    PageHeader,
    PriorityTag,
    SectionTitle,
    SourceIcon,
    StatTile,
    StatusTag,
} from '@/Components/ui';
import LiveEmailDemo from '@/Components/LiveEmailDemo';
import type { Commitment, Communication, Project, Reminder, Topic } from '@/types';

interface Stats {
    stakeholders: number;
    open_commitments: number;
    overdue: number;
    blocked: number;
    at_risk_projects: number;
    unread: number;
    chase_today: number;
}

interface Props {
    stats: Stats;
    chaseToday: Reminder[];
    dueCommitments: Commitment[];
    projects: Project[];
    topics: Topic[];
    recentComms: Communication[];
}

export default function Dashboard({ stats, chaseToday, dueCommitments, projects, topics, recentComms }: Props) {
    const nudge = (id: number) =>
        router.post(`/commitments/${id}/nudge`, {}, { preserveScroll: true });

    return (
        <>
            <Head title="Command Centre" />

            <PageHeader
                title="Command Centre"
                subtitle="Good to see you, Kathy. Here's where things stand today."
                action={
                    <Button renderIcon={Microphone} onClick={() => window.dispatchEvent(new CustomEvent('atlas:open'))}>
                        Ask Atlas
                    </Button>
                }
            />

            <LiveEmailDemo />

            <div className="cc-stats">
                <StatTile label="Open commitments" value={stats.open_commitments} />
                <StatTile label="Overdue" value={stats.overdue} accent="var(--cc-red)" sub="need chasing" />
                <StatTile label="To chase today" value={stats.chase_today} accent="var(--cc-blue)" />
                <StatTile label="Blockers" value={stats.blocked} accent={stats.blocked ? 'var(--cc-red)' : undefined} />
                <StatTile label="At-risk projects" value={stats.at_risk_projects} accent="var(--cc-yellow)" />
                <StatTile label="Stakeholders" value={stats.stakeholders} sub={`${stats.unread} unread messages`} />
            </div>

            <div className="cc-grid cc-grid--2">
                {/* Who to chase today */}
                <section className="cc-section">
                    <SectionTitle
                        title="Who to chase today"
                        action={<Link href="/commitments" className="cc-muted">All commitments</Link>}
                    />
                    <div className="cc-stack">
                        {chaseToday.length === 0 ? (
                            <EmptyState title="Nothing urgent">You're all caught up — no chases suggested.</EmptyState>
                        ) : (
                            chaseToday.map((r) => (
                                <Tile key={r.id}>
                                    <div className="cc-spread">
                                        <div className="cc-person">
                                            {r.stakeholder ? <Avatar person={r.stakeholder} /> : null}
                                            <div>
                                                <strong>{r.stakeholder?.name}</strong>
                                                <div className="cc-muted" style={{ fontSize: '0.8rem' }}>
                                                    {r.stakeholder?.role} · via {r.channel}
                                                </div>
                                            </div>
                                        </div>
                                        <PriorityTag priority={r.priority} />
                                    </div>
                                    <p style={{ margin: '0.75rem 0 0' }}>{r.reason}</p>
                                    {r.stakeholder ? (
                                        <Link href={`/stakeholders/${r.stakeholder.id}`} className="cc-row cc-muted" style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>
                                            Open dossier <ArrowUpRight size={14} />
                                        </Link>
                                    ) : null}
                                </Tile>
                            ))
                        )}
                    </div>
                </section>

                {/* Commitments coming due */}
                <section className="cc-section">
                    <SectionTitle title="Commitments coming due" />
                    <div className="cc-stack">
                        {dueCommitments.map((c) => (
                            <Tile key={c.id}>
                                <div className="cc-spread">
                                    <div>
                                        <strong>{c.title}</strong>
                                        <div className="cc-muted" style={{ fontSize: '0.8rem', marginTop: '0.15rem' }}>
                                            {c.stakeholder?.name} · {c.project?.code ?? '—'}
                                        </div>
                                    </div>
                                    <StatusTag status={c.status} />
                                </div>
                                <div className="cc-spread" style={{ marginTop: '0.6rem' }}>
                                    <span style={{ color: c.is_overdue ? 'var(--cc-red)' : 'inherit', fontSize: '0.85rem' }}>
                                        {c.is_overdue ? 'Overdue · ' : 'Due '} {c.due_label}
                                    </span>
                                    <Button size="sm" kind="tertiary" renderIcon={Send} onClick={() => nudge(c.id)}>
                                        Nudge
                                    </Button>
                                </div>
                            </Tile>
                        ))}
                    </div>
                </section>
            </div>

            {/* Project health */}
            <section className="cc-section">
                <SectionTitle title="Project health" action={<Link href="/projects" className="cc-muted">All projects</Link>} />
                <div className="cc-grid cc-grid--3">
                    {projects.map((p) => (
                        <ClickableTile key={p.id} onClick={() => router.visit(`/projects/${p.id}`)}>
                            <div className="cc-spread">
                                <strong>{p.name}</strong>
                            </div>
                            <div style={{ margin: '0.5rem 0' }}>
                                <HealthTag health={p.health} />
                            </div>
                            <Meter value={p.progress} color={p.health === 'red' ? 'var(--cc-red)' : p.health === 'yellow' ? 'var(--cc-yellow)' : 'var(--cc-green)'} />
                            <div className="cc-muted" style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
                                {p.progress}% · {p.open_commitments_count} open · {p.stakeholders_count} people
                            </div>
                        </ClickableTile>
                    ))}
                </div>
            </section>

            <div className="cc-grid cc-grid--2">
                {/* Topics to remember */}
                <section className="cc-section">
                    <SectionTitle title="Topics to remember" action={<Link href="/topics" className="cc-muted">All topics</Link>} />
                    <div className="cc-stack">
                        {topics.map((t) => (
                            <Tile key={t.id}>
                                <div className="cc-spread">
                                    <strong>{t.title}</strong>
                                    <PriorityTag priority={t.importance} />
                                </div>
                                <p className="cc-muted" style={{ margin: '0.5rem 0 0', fontSize: '0.85rem' }}>{t.summary}</p>
                                <div className="cc-muted" style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>
                                    {t.project?.code ?? 'General'} · last mentioned {t.last_mentioned}
                                </div>
                            </Tile>
                        ))}
                    </div>
                </section>

                {/* Recent communications */}
                <section className="cc-section">
                    <SectionTitle title="Recent communications" action={<Link href="/communications" className="cc-muted">Inbox</Link>} />
                    <div className="cc-stack">
                        {recentComms.map((c) => (
                            <Tile key={c.id}>
                                <div className="cc-row" style={{ gap: '0.5rem' }}>
                                    <SourceIcon type={c.type} />
                                    <strong>{c.subject}</strong>
                                </div>
                                <div className="cc-muted" style={{ fontSize: '0.8rem', margin: '0.25rem 0 0.5rem' }}>
                                    {c.stakeholder?.name} · {c.occurred_label}
                                </div>
                                {c.ai_summary ? <p style={{ margin: 0, fontSize: '0.85rem' }}>{c.ai_summary}</p> : null}
                            </Tile>
                        ))}
                    </div>
                </section>
            </div>
        </>
    );
}

import SidebarLayout from '@/Layouts/SidebarLayout';
import type { ReactNode } from 'react';


// Use sidebar layout for dashboard
Dashboard.layout = (page: ReactNode) => <SidebarLayout>{page}</SidebarLayout>;
