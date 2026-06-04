import { Head, router } from '@inertiajs/react';
import { Grid, Column, ClickableTile } from '@carbon/react';
import { Application, Catalog, Integration } from '@carbon/icons-react';
import { HealthTag } from '@/Components/ui';
import SidebarLayout from '@/Layouts/SidebarLayout';
import type { Project } from '@/types';
import type { ReactNode } from 'react';

interface ProjectsOverviewProps {
    projects: Project[];
}

export default function ProjectsOverview({ projects }: ProjectsOverviewProps) {
    const projectIcons = [Application, Catalog, Integration];

    const handleProjectClick = (projectId: number) => {
        router.visit(`/projects/${projectId}`);
    };

    return (
        <>
            <Head title="Projects Overview" />
            
            <div className="projects-overview-page">
                <h1>Your Projects</h1>
                <p className="page-subtitle">Select a project to view details and manage deliverables</p>
                
                <Grid className="projects-overview-grid">
                    {projects.map((project, index) => {
                        const IconComponent = projectIcons[index % projectIcons.length];
                        
                        return (
                            <Column key={project.id} lg={5} md={4} sm={4}>
                                <ClickableTile
                                    className="project-tile"
                                    onClick={() => handleProjectClick(project.id)}
                                >
                                    <div className="project-icon">
                                        <IconComponent size={64} />
                                    </div>
                                    <div className="project-info">
                                        <h3>{project.name}</h3>
                                        <HealthTag health={project.health} />
                                        <div className="project-metrics">
                                            <span>{project.progress}% complete</span>
                                            <span>{project.open_commitments_count || 0} open commitments</span>
                                            <span>{project.stakeholders_count || 0} stakeholders</span>
                                        </div>
                                    </div>
                                </ClickableTile>
                            </Column>
                        );
                    })}
                </Grid>
            </div>
        </>
    );
}

// Use sidebar layout for this page
ProjectsOverview.layout = (page: ReactNode) => <SidebarLayout>{page}</SidebarLayout>;

// Made with Bob
