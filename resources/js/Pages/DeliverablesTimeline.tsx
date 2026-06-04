import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Grid, Column, Tile, Tag, Button, Dropdown } from '@carbon/react';
import { Calendar, ArrowRight } from '@carbon/icons-react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import type { Commitment, SharedProps } from '@/types';

interface DeliverablesTimelineProps extends SharedProps {
    commitments: Commitment[];
}

export default function DeliverablesTimeline({ commitments }: DeliverablesTimelineProps) {
    const [filterDirection, setFilterDirection] = useState<'all' | 'mine' | 'theirs'>('all');

    // Filter commitments
    const filteredCommitments = commitments.filter(c => {
        if (filterDirection === 'all') return true;
        return c.direction === filterDirection;
    });

    // Group commitments by month
    const groupedByMonth = filteredCommitments.reduce((acc, commitment) => {
        if (!commitment.due_date) return acc;
        
        const date = new Date(commitment.due_date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const monthLabel = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
        
        if (!acc[monthKey]) {
            acc[monthKey] = {
                label: monthLabel,
                commitments: []
            };
        }
        
        acc[monthKey].commitments.push(commitment);
        return acc;
    }, {} as Record<string, { label: string; commitments: Commitment[] }>);

    // Sort months chronologically
    const sortedMonths = Object.entries(groupedByMonth).sort(([a], [b]) => a.localeCompare(b));

    const handleCommitmentClick = (id: number) => {
        router.visit(`/commitment/${id}`);
    };

    const getCommitmentColor = (commitment: Commitment) => {
        if (commitment.direction === 'mine') {
            return 'commitment-mine'; // Blue - user's promises
        }
        return 'commitment-theirs'; // Green - others' promises to user
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'done': return 'green';
            case 'in_progress': return 'blue';
            case 'blocked': return 'red';
            case 'overdue': return 'red';
            default: return 'gray';
        }
    };

    return (
        <>
            <Head title="Deliverables Timeline" />
            
            <div className="deliverables-timeline-page">
                <div className="timeline-header">
                    <Grid>
                        <Column lg={12} md={6} sm={4}>
                            <h1 className="page-title">Deliverables Timeline</h1>
                            <p className="page-subtitle">Track all commitments and promises across projects</p>
                        </Column>
                        <Column lg={4} md={2} sm={4}>
                            <div className="timeline-filters">
                                <Dropdown
                                    id="direction-filter"
                                    titleText="Filter by"
                                    label="All Commitments"
                                    items={[
                                        { id: 'all', text: 'All Commitments' },
                                        { id: 'mine', text: 'My Promises' },
                                        { id: 'theirs', text: 'Promises to Me' }
                                    ]}
                                    itemToString={(item) => item?.text || ''}
                                    onChange={({ selectedItem }) => {
                                        if (selectedItem) {
                                            setFilterDirection(selectedItem.id as 'all' | 'mine' | 'theirs');
                                        }
                                    }}
                                />
                            </div>
                        </Column>
                    </Grid>
                </div>

                <div className="timeline-legend">
                    <div className="legend-item">
                        <div className="legend-color commitment-mine-legend"></div>
                        <span>My Promises</span>
                    </div>
                    <div className="legend-item">
                        <div className="legend-color commitment-theirs-legend"></div>
                        <span>Promises to Me</span>
                    </div>
                </div>

                <div className="timeline-container">
                    {sortedMonths.length === 0 ? (
                        <Tile className="empty-state">
                            <Calendar size={48} />
                            <h3>No commitments found</h3>
                            <p>There are no commitments matching your filter criteria.</p>
                        </Tile>
                    ) : (
                        <div className="timeline-scroll">
                            {sortedMonths.map(([monthKey, { label, commitments: monthCommitments }]) => (
                                <div key={monthKey} className="timeline-month">
                                    <div className="month-header">
                                        <h2>{label}</h2>
                                        <span className="month-count">{monthCommitments.length} commitment{monthCommitments.length !== 1 ? 's' : ''}</span>
                                    </div>
                                    <div className="timeline-track">
                                        {monthCommitments
                                            .sort((a, b) => (a.due_date || '').localeCompare(b.due_date || ''))
                                            .map((commitment) => (
                                                <div
                                                    key={commitment.id}
                                                    className={`timeline-item ${getCommitmentColor(commitment)} ${commitment.is_overdue ? 'overdue' : ''}`}
                                                    onClick={() => handleCommitmentClick(commitment.id)}
                                                >
                                                    <div className="timeline-item-date">
                                                        {commitment.due_label || commitment.due_date}
                                                    </div>
                                                    <div className="timeline-item-content">
                                                        <h4>{commitment.title}</h4>
                                                        {commitment.stakeholder && (
                                                            <p className="timeline-item-stakeholder">
                                                                {commitment.direction === 'mine' ? 'To: ' : 'From: '}
                                                                {commitment.stakeholder.name}
                                                            </p>
                                                        )}
                                                        {commitment.project && (
                                                            <p className="timeline-item-project">{commitment.project.name}</p>
                                                        )}
                                                        <div className="timeline-item-tags">
                                                            <Tag type={getStatusColor(commitment.status)} size="sm">
                                                                {commitment.status}
                                                            </Tag>
                                                            {commitment.priority === 'high' && (
                                                                <Tag type="red" size="sm">High Priority</Tag>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="timeline-item-arrow">
                                                        <ArrowRight size={20} />
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

DeliverablesTimeline.layout = (page: React.ReactNode) => <SidebarLayout>{page}</SidebarLayout>;

// Made with Bob