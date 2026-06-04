import { Grid, Column, ClickableTile, Tag } from '@carbon/react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { getHealthColor, getHealthLabel } from '../../utils/statusHelpers';
import { Application, CloudApp, Integration } from '@carbon/icons-react';
import type { Project } from '../../types';
import './ProjectsOverviewPage.scss';

export default function ProjectsOverviewPage() {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();

  const projectIcons = [Application, CloudApp, Integration];

  const handleProjectClick = (projectId: string) => {
    dispatch({ type: 'SELECT_PROJECT', payload: projectId });
    navigate(`/app/projects/${projectId}`);
  };

  return (
    <div className="projects-overview-page">
      <h1>Projects Overview</h1>
      <p className="page-subtitle">Select a project to view details</p>
      
      <Grid className="projects-overview-grid">
        {state.projects.map((project: Project, index: number) => {
          const Icon = projectIcons[index % projectIcons.length];
          return (
            <Column key={project.id} lg={5} md={4} sm={4}>
              <ClickableTile
                className="project-tile"
                onClick={() => handleProjectClick(project.id)}
              >
                <div className="project-icon">
                  <Icon size={64} />
                </div>
                <div className="project-info">
                  <h3>{project.name}</h3>
                  <Tag type={getHealthColor(project.health)} size="md">
                    {getHealthLabel(project.health)}
                  </Tag>
                  <div className="project-metrics">
                    <span>{project.progress}% Complete</span>
                    <span>{project.activeBlockers} Blockers</span>
                    <span>{project.pendingActions} Actions</span>
                  </div>
                </div>
              </ClickableTile>
            </Column>
          );
        })}
      </Grid>
    </div>
  );
}

// Made with Bob