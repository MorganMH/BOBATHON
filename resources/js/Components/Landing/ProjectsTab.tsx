import { Grid, Column, ClickableTile, Tag } from '@carbon/react';
import { router } from '@inertiajs/react';
import { HealthTag, Meter } from '@/Components/ui';
import type { Project } from '@/types';

interface ProjectsTabProps {
    projects: Project[];
}

export default function ProjectsTab({ projects }: ProjectsTabProps) {
    const handleProjectClick = () => {
        router.visit('/projects-overview');
    };

    return (
        <div className="projects-tab">
            <h2 className="tab-title">Your Projects</h2>
            <Grid className="projects-grid">
                {projects.map((project) => (
                    <Column key={project.id} lg={5} md={4} sm={4}>
                        <ClickableTile
                            className="project-card-landing"
                            onClick={handleProjectClick}
                        >
                            <div className="project-card-header">
                                <h3>{project.name}</h3>
                                <HealthTag health={project.health} />
                            </div>
                            <p className="project-description">
                                {project.code} - Track progress and manage deliverables
                            </p>
                            <div className="project-progress">
                                <Meter 
                                    value={project.progress} 
                                    color={
                                        project.health === 'red' ? 'var(--cc-red)' : 
                                        project.health === 'yellow' ? 'var(--cc-yellow)' : 
                                        'var(--cc-green)'
                                    } 
                                />
                                <span className="progress-text">{project.progress}% complete</span>
                            </div>
                            <div className="project-stats">
                                <span>{project.open_commitments_count || 0} open commitments</span>
                                <span>{project.stakeholders_count || 0} stakeholders</span>
                            </div>
                        </ClickableTile>
                    </Column>
                ))}
            </Grid>
        </div>
    );
}

// Made with Bob
