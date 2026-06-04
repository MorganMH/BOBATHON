import { Head, router } from '@inertiajs/react';
import { Grid, Column, Tile, Tag, Button, StructuredListWrapper, StructuredListHead, StructuredListRow, StructuredListCell, StructuredListBody } from '@carbon/react';
import { ArrowLeft, Calendar, User, Folder, Edit, CheckmarkOutline } from '@carbon/icons-react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import type { Commitment, SharedProps } from '@/types';

interface CommitmentDetailProps extends SharedProps {
    commitment: Commitment;
}

export default function CommitmentDetail({ commitment }: CommitmentDetailProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'done': return 'green';
            case 'in_progress': return 'blue';
            case 'blocked': return 'red';
            case 'overdue': return 'red';
            default: return 'gray';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'red';
            case 'medium': return 'blue';
            case 'low': return 'gray';
            default: return 'gray';
        }
    };

    const getDirectionLabel = (direction: string) => {
        return direction === 'mine' ? 'My Promise' : 'Promise to Me';
    };

    const getDirectionColor = (direction: string) => {
        return direction === 'mine' ? 'blue' : 'green';
    };

    return (
        <>
            <Head title={`Commitment: ${commitment.title}`} />
            
            <div className="commitment-detail-page">
                <div className="detail-header">
                    <Button
                        kind="ghost"
                        renderIcon={ArrowLeft}
                        onClick={() => router.visit('/deliverables-timeline')}
                    >
                        Back to Timeline
                    </Button>
                </div>

                <Grid>
                    <Column lg={12} md={6} sm={4}>
                        <Tile className="commitment-main-tile">
                            <div className="commitment-title-section">
                                <h1>{commitment.title}</h1>
                                <div className="commitment-badges">
                                    <Tag type={getDirectionColor(commitment.direction)} size="md">
                                        {getDirectionLabel(commitment.direction)}
                                    </Tag>
                                    <Tag type={getStatusColor(commitment.status)} size="md">
                                        {commitment.status}
                                    </Tag>
                                    <Tag type={getPriorityColor(commitment.priority)} size="md">
                                        {commitment.priority} priority
                                    </Tag>
                                    {commitment.is_overdue && (
                                        <Tag type="red" size="md">Overdue</Tag>
                                    )}
                                </div>
                            </div>

                            {commitment.description && (
                                <div className="commitment-description">
                                    <h3>Description</h3>
                                    <p>{commitment.description}</p>
                                </div>
                            )}

                            <div className="commitment-details-grid">
                                <div className="detail-item">
                                    <Calendar size={20} />
                                    <div>
                                        <span className="detail-label">Due Date</span>
                                        <span className="detail-value">
                                            {commitment.due_label || commitment.due_date || 'Not set'}
                                        </span>
                                    </div>
                                </div>

                                {commitment.stakeholder && (
                                    <div className="detail-item">
                                        <User size={20} />
                                        <div>
                                            <span className="detail-label">
                                                {commitment.direction === 'mine' ? 'Committed To' : 'Committed By'}
                                            </span>
                                            <span className="detail-value">
                                                {commitment.stakeholder.name}
                                                {commitment.stakeholder.role && ` - ${commitment.stakeholder.role}`}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {commitment.project && (
                                    <div className="detail-item">
                                        <Folder size={20} />
                                        <div>
                                            <span className="detail-label">Project</span>
                                            <span className="detail-value">{commitment.project.name}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="commitment-actions">
                                <Button kind="primary" renderIcon={Edit}>
                                    Edit Commitment
                                </Button>
                                {commitment.status !== 'done' && (
                                    <Button kind="secondary" renderIcon={CheckmarkOutline}>
                                        Mark as Done
                                    </Button>
                                )}
                            </div>
                        </Tile>
                    </Column>

                    <Column lg={4} md={2} sm={4}>
                        <Tile className="commitment-meta-tile">
                            <h3>Metadata</h3>
                            <StructuredListWrapper>
                                <StructuredListBody>
                                    <StructuredListRow>
                                        <StructuredListCell>Source</StructuredListCell>
                                        <StructuredListCell>
                                            <Tag size="sm">{commitment.source_type}</Tag>
                                        </StructuredListCell>
                                    </StructuredListRow>
                                    {commitment.captured_by_ai && (
                                        <StructuredListRow>
                                            <StructuredListCell>Captured</StructuredListCell>
                                            <StructuredListCell>
                                                <Tag type="purple" size="sm">AI Detected</Tag>
                                            </StructuredListCell>
                                        </StructuredListRow>
                                    )}
                                    {commitment.last_nudged && (
                                        <StructuredListRow>
                                            <StructuredListCell>Last Nudged</StructuredListCell>
                                            <StructuredListCell>{commitment.last_nudged}</StructuredListCell>
                                        </StructuredListRow>
                                    )}
                                    {commitment.source_ref && (
                                        <StructuredListRow>
                                            <StructuredListCell>Reference</StructuredListCell>
                                            <StructuredListCell className="source-ref">
                                                {commitment.source_ref}
                                            </StructuredListCell>
                                        </StructuredListRow>
                                    )}
                                </StructuredListBody>
                            </StructuredListWrapper>
                        </Tile>

                        {commitment.direction === 'theirs' && commitment.status !== 'done' && (
                            <Tile className="commitment-action-tile">
                                <h3>Quick Actions</h3>
                                <div className="quick-actions">
                                    <Button kind="tertiary" size="sm">
                                        Send Reminder
                                    </Button>
                                    <Button kind="tertiary" size="sm">
                                        Schedule Follow-up
                                    </Button>
                                    <Button kind="tertiary" size="sm">
                                        View Related Comms
                                    </Button>
                                </div>
                            </Tile>
                        )}
                    </Column>
                </Grid>
            </div>
        </>
    );
}

CommitmentDetail.layout = (page: React.ReactNode) => <SidebarLayout>{page}</SidebarLayout>;

// Made with Bob