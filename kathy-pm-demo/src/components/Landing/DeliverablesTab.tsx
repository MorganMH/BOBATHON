import { Grid, Column, Accordion, AccordionItem, Tile, Tag } from '@carbon/react';
import { useAppContext } from '../../context/AppContext';
import type { Action, Communication, Project } from '../../types';
import './DeliverablesTab.scss';

export default function DeliverablesTab() {
  const { state } = useAppContext();

  const getProjectActions = (projectId: string) => {
    return state.actions.filter((action: Action) => action.projectId === projectId);
  };

  return (
    <div className="deliverables-tab">
      <h2 className="tab-title">Deliverables & Communications</h2>
      
      <Grid>
        <Column lg={8} md={4} sm={4}>
          <Tile className="deliverables-section">
            <h3>Recent Communications</h3>
            {state.communications.slice(0, 5).map((comm: Communication) => (
              <div key={comm.id} className="communication-item">
                <div className="comm-header">
                  <Tag size="sm">{comm.type}</Tag>
                  <strong>{comm.subject}</strong>
                </div>
                <p className="comm-meta">
                  From: {comm.from} | {new Date(comm.date).toLocaleDateString()}
                </p>
                {comm.aiSummary && (
                  <p className="comm-summary">{comm.aiSummary}</p>
                )}
              </div>
            ))}
          </Tile>
        </Column>

        <Column lg={8} md={4} sm={4}>
          <Tile className="deliverables-section">
            <h3>Project Actions</h3>
            <Accordion>
              {state.projects.map((project: Project) => {
                const actions = getProjectActions(project.id);
                return (
                  <AccordionItem key={project.id} title={`${project.name} (${actions.length} actions)`}>
                    {actions.length > 0 ? (
                      <ul className="action-list">
                        {actions.map((action: Action) => (
                          <li key={action.id}>
                            <Tag type={action.status === 'overdue' ? 'red' : 'blue'} size="sm">
                              {action.status}
                            </Tag>
                            <span>{action.title}</span>
                            <small> - {action.owner}</small>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No pending actions</p>
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