import { Head, Link, router } from '@inertiajs/react';
import { Button, Tag, Tile } from '@carbon/react';
import { ArrowLeft, Send } from '@carbon/icons-react';
import {
    Avatar,
    AvailabilityTag,
    EmptyState,
    LevelTag,
    Meter,
    PriorityTag,
    SectionTitle,
    SourceIcon,
    StatusTag,
} from '@/Components/ui';
import type { Commitment, Communication, Person, ProjectBrief, Reminder, Topic } from '@/types';

interface ProjectMembership extends ProjectBrief {
    role_on_project: string | null;
}

interface Props {
    stakeholder: Person;
    commitments: Commitment[];
    projects: ProjectMembership[];
    communications: Communication[];
    topics: Topic[];
    reminders: Reminder[];
}

export default function StakeholderShow({ stakeholder: s, commitments, projects, communications, topics, reminders }: Props) {
    const open = commitments.filter((c) => c.status !== 'done');
    const nudge = (id: number) => router.post(`/commitments/${id}/nudge`, {}, { preserveScroll: true });

    return (
        <>
            <Head title={s.name} />

            <Link href="/stakeholders" className="cc-row cc-muted" style={{ marginBottom: '1rem', fontSize: '0.85rem' }}>
                <ArrowLeft size={16} /> All stakeholders
            </Link>

            {/* Identity header */}
            <div className="cc-spread" style={{ marginBottom: '1.5rem', alignItems: 'flex-start' }}>
                <div className="cc-person">
                    <Avatar person={s} size="lg" />
                    <div>
                        <h1 style={{ margin: 0, fontWeight: 400 }}>{s.name}</h1>
                        <p className="cc-muted" style={{ margin: '0.15rem 0 0.5rem' }}>{s.role}{s.team ? ` · ${s.team}` : ''}</p>
                        <div className="cc-row" style={{ gap: '0.25rem' }}>
                            <AvailabilityTag availability={s.availability} />
                            <LevelTag level={s.influence} suffix="influence" />
                            <LevelTag level={s.interest} suffix="interest" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="cc-grid cc-grid--2">
                {/* LEFT — profile & memory */}
                <div>
                    <section className="cc-section">
                        <SectionTitle title="Profile" />
                        <Tile>
                            {s.expertise ? <p style={{ marginTop: 0 }}>{s.expertise}</p> : null}
                            <div className="cc-row" style={{ gap: '0.25rem', margin: '0.5rem 0 1rem' }}>
                                {s.skills.map((sk) => <Tag key={sk} type="cool-gray" size="sm">{sk}</Tag>)}
                            </div>
                            <dl style={{ margin: 0 }}>
                                <ContactRow label="Email" value={s.email} />
                                <ContactRow label="Phone" value={s.phone} />
                                <ContactRow label="Location" value={s.location} />
                                <ContactRow label="Prefers" value={s.comms_preference} />
                                <ContactRow label="Last contacted" value={s.last_contacted} />
                            </dl>
                        </Tile>
                    </section>

                    {s.personal_notes ? (
                        <section className="cc-section">
                            <SectionTitle title="Personal notes" />
                            <Tile><p style={{ margin: 0 }}>{s.personal_notes}</p></Tile>
                        </section>
                    ) : null}

                    <section className="cc-section">
                        <SectionTitle title="Signals" />
                        <Tile>
                            <Signal label={`Reliability · ${s.reliability}%`} value={s.reliability} good />
                            <div style={{ height: '0.75rem' }} />
                            <Signal label={`Workload · ${s.workload}%`} value={s.workload} />
                        </Tile>
                    </section>

                    <section className="cc-section">
                        <SectionTitle title="Projects" />
                        <div className="cc-stack">
                            {projects.map((p) => (
                                <Tile key={p.id} className="cc-tile-link">
                                    <div className="cc-spread">
                                        <Link href={`/projects/${p.id}`}><strong>{p.name}</strong></Link>
                                        <Tag type="outline" size="sm">{p.role_on_project ?? 'Member'}</Tag>
                                    </div>
                                </Tile>
                            ))}
                            {projects.length === 0 ? <EmptyState title="Not on any projects yet" /> : null}
                        </div>
                    </section>
                </div>

                {/* RIGHT — activity */}
                <div>
                    {reminders.length > 0 ? (
                        <section className="cc-section">
                            <SectionTitle title="Suggested chases" />
                            <div className="cc-stack">
                                {reminders.map((r) => (
                                    <Tile key={r.id}>
                                        <div className="cc-spread">
                                            <span>{r.reason}</span>
                                            <PriorityTag priority={r.priority} />
                                        </div>
                                        {r.draft_message ? (
                                            <p className="cc-muted" style={{ fontSize: '0.85rem', margin: '0.5rem 0 0', fontStyle: 'italic' }}>
                                                “{r.draft_message}”
                                            </p>
                                        ) : null}
                                    </Tile>
                                ))}
                            </div>
                        </section>
                    ) : null}

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
                                            {c.direction === 'mine' ? 'Kathy owes · ' : ''}{c.is_overdue ? 'Overdue · ' : 'Due '} {c.due_label} · {c.project?.code}
                                        </span>
                                        {c.status !== 'done' && c.direction === 'theirs' ? (
                                            <Button size="sm" kind="ghost" renderIcon={Send} onClick={() => nudge(c.id)}>Nudge</Button>
                                        ) : null}
                                    </div>
                                </Tile>
                            ))}
                            {commitments.length === 0 ? <EmptyState title="No commitments on record" /> : null}
                        </div>
                    </section>

                    <section className="cc-section">
                        <SectionTitle title="Recent communications" />
                        <div className="cc-stack">
                            {communications.map((c) => (
                                <Tile key={c.id}>
                                    <div className="cc-row" style={{ gap: '0.5rem' }}>
                                        <SourceIcon type={c.type} />
                                        <strong>{c.subject}</strong>
                                    </div>
                                    <div className="cc-muted" style={{ fontSize: '0.75rem', margin: '0.2rem 0 0.4rem' }}>{c.occurred_label}</div>
                                    {c.ai_summary ? <p style={{ margin: 0, fontSize: '0.85rem' }}>{c.ai_summary}</p> : null}
                                </Tile>
                            ))}
                            {communications.length === 0 ? <EmptyState title="No messages yet" /> : null}
                        </div>
                    </section>

                    {topics.length > 0 ? (
                        <section className="cc-section">
                            <SectionTitle title="Topics" />
                            <div className="cc-stack">
                                {topics.map((t) => (
                                    <Tile key={t.id}>
                                        <div className="cc-spread"><strong>{t.title}</strong><PriorityTag priority={t.importance} /></div>
                                        <p className="cc-muted" style={{ margin: '0.4rem 0 0', fontSize: '0.85rem' }}>{t.summary}</p>
                                    </Tile>
                                ))}
                            </div>
                        </section>
                    ) : null}
                </div>
            </div>
        </>
    );
}

function ContactRow({ label, value }: { label: string; value: string | null }) {
    if (!value) return null;
    return (
        <div className="cc-spread" style={{ padding: '0.3rem 0', borderTop: '1px solid var(--cds-border-subtle, #e0e0e0)' }}>
            <dt className="cc-muted" style={{ fontSize: '0.8rem' }}>{label}</dt>
            <dd style={{ margin: 0, fontSize: '0.85rem', textAlign: 'right' }}>{value}</dd>
        </div>
    );
}

function Signal({ label, value, good }: { label: string; value: number; good?: boolean }) {
    const color = good
        ? value < 65 ? 'var(--cc-red)' : value < 80 ? 'var(--cc-yellow)' : 'var(--cc-green)'
        : value > 85 ? 'var(--cc-red)' : value > 70 ? 'var(--cc-yellow)' : 'var(--cc-green)';
    return (
        <div>
            <div className="cc-muted" style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}>{label}</div>
            <Meter value={value} color={color} />
        </div>
    );
}
