import { Tile, Grid, Column, Tag } from '@carbon/react';
import { useAppContext } from '../../context/AppContext';
import { getHealthColor, getHealthLabel } from '../../utils/statusHelpers';
import type { Project } from '../../types';

export default function ProjectSummaryPage() {
  const { state } = useAppContext();

  return (
    <div className="project-summary-page">
      <h1>Project Summary</h1>
      <p className="page-subtitle">AI-generated summaries for all projects</p>
      
      <Grid>
        {state.projects.map((project: Project) => (
          <Column key={project.id} lg={16} md={8} sm={4}>
            <Tile style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3>{project.name}</h3>
                <Tag type={getHealthColor(project.health)} size="md">
                  {getHealthLabel(project.health)}
                </Tag>
              </div>
              {project.aiSummary && (
                <p style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>{project.aiSummary}</p>
              )}
              <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--cds-text-secondary)' }}>
                Last updated: {new Date(project.lastUpdated).toLocaleString()}
              </div>
            </Tile>
          </Column>
        ))}
      </Grid>
    </div>
  );
}

// Made with Bob