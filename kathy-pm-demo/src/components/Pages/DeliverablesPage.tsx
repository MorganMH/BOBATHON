import { Accordion, AccordionItem, Tile, Tag } from '@carbon/react';
import { useAppContext } from '../../context/AppContext';
import type { Action, Project } from '../../types';

export default function DeliverablesPage() {
  const { state } = useAppContext();

  const getProjectActions = (projectId: string) => {
    return state.actions.filter((action: Action) => action.projectId === projectId);
  };

  return (
    <div className="deliverables-page">
      <h1>Deliverables</h1>
      <p className="page-subtitle">All deliverables across projects</p>
      
      <Tile>
        <h3 style={{ marginBottom: '1rem' }}>Project Actions</h3>
        <Accordion>
          {state.projects.map((project: Project) => {
            const actions = getProjectActions(project.id);
            return (
              <AccordionItem key={project.id} title={`${project.name} (${actions.length} actions)`}>
                {actions.length > 0 ? (
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {actions.map((action: Action) => (
                      <li key={action.id} style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--cds-border-subtle)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Tag type={action.status === 'overdue' ? 'red' : 'blue'} size="sm">
                          {action.status}
                        </Tag>
                        <span style={{ flex: 1 }}>{action.title}</span>
                        <small style={{ color: 'var(--cds-text-secondary)' }}>{action.owner}</small>
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
    </div>
  );
}

// Made with Bob