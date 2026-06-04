import { Tile, Tag, ProgressBar } from '@carbon/react';
import { useAppContext, useSelectedProject } from '../../context/AppContext';
import { getHealthColor, getHealthLabel } from '../../utils/statusHelpers';
import { formatDate } from '../../utils/dateHelpers';
import type { Project } from '../../types';
import './ProjectOverview.scss';

export default function ProjectOverview() {
  const { state } = useAppContext();
  const selectedProject = useSelectedProject();

  if (!state.selectedProjectId) {
    // Show all projects
    return (
      <div className="project-overview-grid">
        {state.projects.map((project: Project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    );
  }

  // Show selected project details
  if (!selectedProject) return null;

  return (
    <div className="project-detail">
      <Tile className="project-detail-tile">
        <div className="project-header">
          <div>
            <h2>{selectedProject.name}</h2>
            <p className="project-description">{selectedProject.description}</p>
          </div>
          <Tag type={getHealthColor(selectedProject.health)} size="md">
            {getHealthLabel(selectedProject.health)}
          </Tag>
        </div>

        <div className="project-stats">
          <div className="stat-item">
            <span className="stat-label">Progress</span>
            <ProgressBar
              label=""
              value={selectedProject.progress}
              max={100}
              size="big"
            />
            <span className="stat-value">{selectedProject.progress}%</span>
          </div>

          <div className="stat-row">
            <div className="stat-item">
              <span className="stat-label">Team Size</span>
              <span className="stat-value">{selectedProject.team.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Pending Actions</span>
              <span className="stat-value">{selectedProject.pendingActions}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Active Blockers</span>
              <span className="stat-value">{selectedProject.activeBlockers}</span>
            </div>
          </div>
        </div>

        {selectedProject.aiSummary && (
          <div className="ai-summary">
            <h4>AI Summary</h4>
            <p>{selectedProject.aiSummary}</p>
            <span className="summary-timestamp">
              Last updated {formatDate(selectedProject.lastUpdated)}
            </span>
          </div>
        )}
      </Tile>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Tile className="project-card">
      <div className="project-card-header">
        <h3>{project.name}</h3>
        <Tag type={getHealthColor(project.health)} size="sm">
          {getHealthLabel(project.health)}
        </Tag>
      </div>
      <p className="project-card-description">{project.description}</p>
      <ProgressBar
        label=""
        value={project.progress}
        max={100}
        size="small"
      />
      <div className="project-card-stats">
        <span>{project.progress}% complete</span>
        <span>{project.activeBlockers} blockers</span>
        <span>{project.pendingActions} actions</span>
      </div>
    </Tile>
  );
}

// Made with Bob
