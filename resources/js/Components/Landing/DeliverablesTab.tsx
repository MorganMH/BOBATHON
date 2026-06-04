import { Grid, Column, Accordion, AccordionItem, Tile, Tag } from '@carbon/react';
import { StatusTag, SourceIcon } from '@/Components/ui';
import type { Commitment, Communication, Project } from '@/types';

interface DeliverablesTabProps {
    communications: Communication[];
    actions: Commitment[];
    projects: Project[];
}

export default function DeliverablesTab({ communications, actions, projects }: DeliverablesTabProps) {
    const getProjectActions = (projectId: number) => {
        return actions.filter((action) => action.project?.id === projectId);
    };

    return (
        <div className="deliverables-tab">
            <h2 className="tab-title">Deliverables & Communications</h2>
            
            <Grid>
                <Column lg={8} md={4} sm={4}>
                    <Tile className="deliverables-section">
                        <h3 className="calendar-section-title">Recent Communications</h3>
                        <div className="cc-stack">
                            {communications.slice(0, 5).map((comm) => (
                                <div key={comm.id} className="communication-item">
                                    <div className="cc-row" style={{ marginBottom: '0.5rem' }}>
                                        <SourceIcon type={comm.type} />
                                        <strong>{comm.subject}</strong>
                                    </div>
                                    <p className="cc-muted" style={{ fontSize: '0.875rem', margin: '0.25rem 0' }}>
                                        {comm.stakeholder?.name} · {comm.occurred_label}
                                    </p>
                                    {comm.ai_summary && (
                                        <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                                            {comm.ai_summary}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </Tile>
                </Column>

                <Column lg={8} md={4} sm={4}>
                    <Tile className="deliverables-section">
                        <h3 className="calendar-section-title">Project Actions</h3>
                        <Accordion>
                            {projects.map((project) => {
                                const projectActions = getProjectActions(project.id);
                                return (
                                    <AccordionItem 
                                        key={project.id} 
                                        title={`${project.name} (${projectActions.length} actions)`}
                                    >
                                        {projectActions.length > 0 ? (
                                            <div className="cc-stack">
                                                {projectActions.map((action) => (
                                                    <div key={action.id} className="cc-row">
                                                        <StatusTag status={action.status} />
                                                        <span>{action.title}</span>
                                                        {action.stakeholder && (
                                                            <small className="cc-muted"> - {action.stakeholder.name}</small>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="cc-muted">No pending actions</p>
                                        )}
                                    </AccordionItem>
                                );
                            })}
                        </Accordion>
                    </Tile>
                </Column>
            </Grid>
        </div>
    );
}

// Made with Bob
