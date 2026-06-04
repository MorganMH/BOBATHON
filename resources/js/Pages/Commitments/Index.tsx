import { useMemo, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
    Button,
    ContentSwitcher,
    Dropdown,
    Search,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableHeader,
    TableRow,
} from '@carbon/react';
import { CheckmarkOutline, Send } from '@carbon/icons-react';
import { Avatar, PageHeader, PriorityTag, StatusTag } from '@/Components/ui';
import type { Commitment } from '@/types';

const STATUS_FILTERS = ['All statuses', 'Open', 'Overdue', 'Blocked', 'Done'];

export default function CommitmentsIndex({ commitments }: { commitments: Commitment[] }) {
    const [query, setQuery] = useState('');
    const [status, setStatus] = useState('All statuses');
    const [direction, setDirection] = useState(0); // 0 all, 1 theirs, 2 mine

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return commitments.filter((c) => {
            if (direction === 1 && c.direction !== 'theirs') return false;
            if (direction === 2 && c.direction !== 'mine') return false;
            if (status === 'Open' && c.status === 'done') return false;
            if (status === 'Overdue' && !c.is_overdue) return false;
            if (status === 'Blocked' && c.status !== 'blocked') return false;
            if (status === 'Done' && c.status !== 'done') return false;
            if (!q) return true;
            return (
                c.title.toLowerCase().includes(q) ||
                (c.stakeholder?.name ?? '').toLowerCase().includes(q) ||
                (c.project?.code ?? '').toLowerCase().includes(q)
            );
        });
    }, [commitments, query, status, direction]);

    const nudge = (id: number) => router.post(`/commitments/${id}/nudge`, {}, { preserveScroll: true });
    const markDone = (id: number) => router.patch(`/commitments/${id}`, { status: 'done' }, { preserveScroll: true });

    return (
        <>
            <Head title="Commitments" />
            <PageHeader title="Commitments" subtitle="Every promise made — who owes what, by when, and what needs chasing." />

            <div className="cc-row" style={{ gap: '1rem', marginBottom: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 240 }}>
                    <Search labelText="Filter" placeholder="Filter by title, person or project" value={query} onChange={(e) => setQuery(e.target.value)} />
                </div>
                <div style={{ width: 200 }}>
                    <Dropdown
                        id="status-filter"
                        titleText="Status"
                        label="Status"
                        items={STATUS_FILTERS}
                        selectedItem={status}
                        onChange={({ selectedItem }) => setStatus(selectedItem ?? 'All statuses')}
                    />
                </div>
                <ContentSwitcher onChange={({ index }) => setDirection(index ?? 0)} selectedIndex={direction} size="md">
                    <Switch name="all" text="Everyone" />
                    <Switch name="theirs" text="They owe" />
                    <Switch name="mine" text="Kathy owes" />
                </ContentSwitcher>
            </div>

            <TableContainer>
                <Table size="lg">
                    <TableHead>
                        <TableRow>
                            <TableHeader>Owner</TableHeader>
                            <TableHeader>Commitment</TableHeader>
                            <TableHeader>Project</TableHeader>
                            <TableHeader>Due</TableHeader>
                            <TableHeader>Priority</TableHeader>
                            <TableHeader>Status</TableHeader>
                            <TableHeader>Actions</TableHeader>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filtered.map((c) => (
                            <TableRow key={c.id}>
                                <TableCell>
                                    {c.stakeholder ? (
                                        <Link href={`/stakeholders/${c.stakeholder.id}`} className="cc-person">
                                            <Avatar person={c.stakeholder} />
                                            <span>{c.stakeholder.name}</span>
                                        </Link>
                                    ) : '—'}
                                </TableCell>
                                <TableCell>
                                    {c.title}
                                    {c.captured_by_ai ? <span className="cc-muted" style={{ fontSize: '0.7rem', display: 'block' }}>✦ captured by AI from {c.source_type}</span> : null}
                                </TableCell>
                                <TableCell>{c.project?.code ?? '—'}</TableCell>
                                <TableCell>
                                    <span style={{ color: c.is_overdue ? 'var(--cc-red)' : undefined }}>
                                        {c.is_overdue ? 'Overdue · ' : ''}{c.due_label}
                                    </span>
                                </TableCell>
                                <TableCell><PriorityTag priority={c.priority} /></TableCell>
                                <TableCell><StatusTag status={c.status} /></TableCell>
                                <TableCell>
                                    <div className="cc-row" style={{ gap: '0.25rem' }}>
                                        {c.status !== 'done' ? (
                                            <>
                                                {c.direction === 'theirs' ? (
                                                    <Button hasIconOnly size="sm" kind="ghost" renderIcon={Send} iconDescription="Log a nudge" tooltipPosition="left" onClick={() => nudge(c.id)} />
                                                ) : null}
                                                <Button hasIconOnly size="sm" kind="ghost" renderIcon={CheckmarkOutline} iconDescription="Mark done" tooltipPosition="left" onClick={() => markDone(c.id)} />
                                            </>
                                        ) : <span className="cc-muted" style={{ fontSize: '0.75rem' }}>✓ done</span>}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {filtered.length === 0 ? <p className="cc-muted" style={{ marginTop: '1rem' }}>No commitments match.</p> : null}
        </>
    );
}
