import { useMemo, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button, Dropdown, InlineLoading, Search, Tag, Tile } from '@carbon/react';
import { ArrowUpRight, Search as SearchIcon } from '@carbon/icons-react';
import { Avatar, AvailabilityTag, LevelTag, Meter, PageHeader } from '@/Components/ui';
import api from '@/lib/api';
import type { Person, PersonBrief } from '@/types';

interface Match {
    stakeholder: PersonBrief;
    reason: string | null;
    expertise: string | null;
}

interface Props {
    stakeholders: Person[];
    teams: string[];
}

export default function StakeholdersIndex({ stakeholders, teams }: Props) {
    const [query, setQuery] = useState('');
    const [team, setTeam] = useState('All teams');

    const [aiQuery, setAiQuery] = useState('');
    const [aiLoading, setAiLoading] = useState(false);
    const [aiAnswer, setAiAnswer] = useState<string | null>(null);
    const [aiMatches, setAiMatches] = useState<Match[]>([]);
    const [aiSource, setAiSource] = useState<string | null>(null);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return stakeholders.filter((s) => {
            if (team !== 'All teams' && s.team !== team) return false;
            if (!q) return true;
            return (
                s.name.toLowerCase().includes(q) ||
                s.role.toLowerCase().includes(q) ||
                (s.expertise ?? '').toLowerCase().includes(q) ||
                s.skills.some((sk) => sk.toLowerCase().includes(q))
            );
        });
    }, [stakeholders, query, team]);

    const runFinder = async () => {
        if (!aiQuery.trim()) return;
        setAiLoading(true);
        setAiAnswer(null);
        setAiMatches([]);
        try {
            const { data } = await api.post('/ai/find-stakeholder', { query: aiQuery });
            setAiAnswer(data.answer);
            setAiMatches(data.matches ?? []);
            setAiSource(data.source);
        } catch {
            setAiAnswer('Sorry — the finder is unavailable right now.');
        } finally {
            setAiLoading(false);
        }
    };

    return (
        <>
            <Head title="Stakeholders" />
            <PageHeader title="Stakeholders" subtitle="Kathy's people — who they are, what they're great at, and how to work with them." />

            {/* AI stakeholder finder */}
            <Tile style={{ marginBottom: '1.5rem' }}>
                <div className="cc-row" style={{ gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <SearchIcon />
                    <strong>Find the right stakeholder</strong>
                    {aiSource ? <Tag type="purple" size="sm">{aiSource === 'gemini' ? 'Gemini' : 'local match'}</Tag> : null}
                </div>
                <p className="cc-muted" style={{ marginTop: 0 }}>
                    Ask in plain English, e.g. “Who knows our payment gateway?” or “Who can sign off accessibility?”
                </p>
                <div className="cc-row" style={{ gap: '0.5rem' }}>
                    <div style={{ flex: 1 }}>
                        <Search
                            labelText="Find a stakeholder"
                            placeholder="Who can help with…"
                            value={aiQuery}
                            onChange={(e) => setAiQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && runFinder()}
                        />
                    </div>
                    <Button onClick={runFinder} disabled={aiLoading}>Ask</Button>
                </div>

                {aiLoading ? <InlineLoading description="Thinking…" style={{ marginTop: '1rem' }} /> : null}

                {aiAnswer ? (
                    <div style={{ marginTop: '1rem' }}>
                        <p style={{ marginTop: 0 }}>{aiAnswer}</p>
                        <div className="cc-grid cc-grid--3">
                            {aiMatches.map((m) => (
                                <Tile key={m.stakeholder.id} className="cc-tile-link">
                                    <div className="cc-person" style={{ marginBottom: '0.5rem' }}>
                                        <Avatar person={m.stakeholder} />
                                        <div>
                                            <Link href={`/stakeholders/${m.stakeholder.id}`}><strong>{m.stakeholder.name}</strong></Link>
                                            <div className="cc-muted" style={{ fontSize: '0.8rem' }}>{m.stakeholder.role}</div>
                                        </div>
                                    </div>
                                    {m.reason ? <p style={{ margin: 0, fontSize: '0.85rem' }}>{m.reason}</p> : null}
                                </Tile>
                            ))}
                        </div>
                    </div>
                ) : null}
            </Tile>

            {/* Filters */}
            <div className="cc-row" style={{ gap: '1rem', marginBottom: '1rem', alignItems: 'flex-end' }}>
                <div style={{ flex: 1, minWidth: 240 }}>
                    <Search labelText="Filter" placeholder="Filter by name, role or skill" value={query} onChange={(e) => setQuery(e.target.value)} />
                </div>
                <div style={{ width: 220 }}>
                    <Dropdown
                        id="team-filter"
                        titleText="Team"
                        label="Team"
                        items={['All teams', ...teams]}
                        selectedItem={team}
                        onChange={({ selectedItem }) => setTeam(selectedItem ?? 'All teams')}
                    />
                </div>
            </div>

            {/* Directory */}
            <div className="cc-grid cc-grid--3">
                {filtered.map((s) => (
                    <Tile key={s.id}>
                        <div className="cc-person" style={{ marginBottom: '0.75rem' }}>
                            <Avatar person={s} size="lg" />
                            <div>
                                <Link href={`/stakeholders/${s.id}`}><strong>{s.name}</strong></Link>
                                <div className="cc-muted" style={{ fontSize: '0.8rem' }}>{s.role}{s.team ? ` · ${s.team}` : ''}</div>
                            </div>
                        </div>

                        <div className="cc-row" style={{ gap: '0.25rem', marginBottom: '0.75rem' }}>
                            {s.skills.slice(0, 4).map((sk) => <Tag key={sk} type="cool-gray" size="sm">{sk}</Tag>)}
                        </div>

                        <div className="cc-muted" style={{ fontSize: '0.75rem', marginBottom: '0.2rem' }}>
                            Reliability {s.reliability}%
                        </div>
                        <Meter value={s.reliability} color={s.reliability < 65 ? 'var(--cc-red)' : s.reliability < 80 ? 'var(--cc-yellow)' : 'var(--cc-green)'} />

                        <div className="cc-row" style={{ gap: '0.25rem', marginTop: '0.75rem' }}>
                            <AvailabilityTag availability={s.availability} />
                            <LevelTag level={s.influence} suffix="influence" />
                        </div>

                        <Link href={`/stakeholders/${s.id}`} className="cc-row cc-muted" style={{ marginTop: '0.75rem', fontSize: '0.8rem' }}>
                            Open dossier <ArrowUpRight size={14} />
                        </Link>
                    </Tile>
                ))}
            </div>
            {filtered.length === 0 ? <p className="cc-muted">No stakeholders match your filter.</p> : null}
        </>
    );
}
