import { Head, router } from '@inertiajs/react';
import { ClickableTile } from '@carbon/react';
import { Avatar, HealthTag, Meter, PageHeader } from '@/Components/ui';
import type { Project } from '@/types';

export default function ProjectsIndex({ projects }: { projects: Project[] }) {
    return (
        <>
            <Head title="Projects" />
            <PageHeader title="Projects" subtitle="Delivery context — health, progress and the people on each." />

            <div className="cc-grid cc-grid--2">
                {projects.map((p) => (
                    <ClickableTile key={p.id} onClick={() => router.visit(`/projects/${p.id}`)}>
                        <div className="cc-spread">
                            <div>
                                <strong style={{ fontSize: '1.05rem' }}>{p.name}</strong>
                                <div className="cc-muted" style={{ fontSize: '0.8rem' }}>{p.code}</div>
                            </div>
                            <HealthTag health={p.health} />
                        </div>

                        {p.description ? <p className="cc-muted" style={{ margin: '0.75rem 0' }}>{p.description}</p> : null}

                        <Meter value={p.progress} color={p.health === 'red' ? 'var(--cc-red)' : p.health === 'yellow' ? 'var(--cc-yellow)' : 'var(--cc-green)'} />
                        <div className="cc-spread" style={{ marginTop: '0.5rem' }}>
                            <span className="cc-muted" style={{ fontSize: '0.8rem' }}>
                                {p.progress}% complete · {p.open_commitments_count} open · ends {p.end_label}
                            </span>
                        </div>

                        <div className="cc-row" style={{ marginTop: '0.75rem', gap: '0.25rem' }}>
                            {(p.team ?? []).map((m) => <Avatar key={m.id} person={m} />)}
                            {p.stakeholders_count && p.team && p.stakeholders_count > p.team.length ? (
                                <span className="cc-muted" style={{ fontSize: '0.8rem', alignSelf: 'center' }}>+{p.stakeholders_count - p.team.length}</span>
                            ) : null}
                        </div>
                    </ClickableTile>
                ))}
            </div>
        </>
    );
}
