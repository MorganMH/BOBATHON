import { Grid, Column, ClickableTile, Tag, ProgressBar } from '@carbon/react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { getHealthColor, getHealthLabel } from '../../utils/statusHelpers';
import type { Project } from '../../types';
import './ProjectsTab.scss';

export default function ProjectsTab() {
  const { state } = useAppContext();
  const navigate = useNavigate();

  const handleProjectClick = () => {
    navigate('/app/projects');
  };

  return (
    <div className="projects-tab">
      <h2 className="tab-title">Your Projects</h2>
      <Grid className="projects-grid">
        {state.projects.map((project: Project) => (
          <Column key={project.id} lg={5} md={4} sm={4}>
            <ClickableTile
              className="project-card-landing"
              onClick={handleProjectClick}
            >
              <div className="project-card-header">
                <h3>{project.name}</h3>
                <Tag type={getHealthColor(project.health)} size="sm">
                  {getHealthLabel(project.health)}
                </Tag>
              </div>
              <p className="project-description">{project.description}</p>
              <div className="project-progress">
                <ProgressBar
                  label=""
                  value={project.progress}
                  max={100}
                  size="small"
                />
                <span className="progress-text">{project.progress}% complete</span>
              </div>
              <div className="project-stats">
                <span>{project.activeBlockers} blockers</span>
                <span>{project.pendingActions} actions</span>
              </div>
            </ClickableTile>
          </Column>
        ))}
      </Grid>
    </div>
  );
}

// Made with Bob