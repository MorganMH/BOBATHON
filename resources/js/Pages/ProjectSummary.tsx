import { Head } from '@inertiajs/react';
import { Tile } from '@carbon/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import type { Project } from '@/types';
import type { ReactNode } from 'react';

interface ProjectSummaryProps {
    projects: Project[];
}

export default function ProjectSummary({ projects }: ProjectSummaryProps) {
    return (
        <>
            <Head title="Project Summary" />
            
            <div className="cc-page-header">
                <h1>Project Summary</h1>
                <p>AI-generated summaries and insights for all your projects</p>
            </div>

            <div className="cc-stack">
                {projects.map((project) => (
                    <Tile key={project.id}>
                        <h3>{project.name}</h3>
                        <p className="cc-muted">
                            Status: {project.health} · Progress: {project.progress}%
                        </p>
                        <p style={{ marginTop: '1rem' }}>
                            AI-generated summary will appear here with key insights, 
                            risks, and recommendations for this project.
                        </p>
                    </Tile>
                ))}
            </div>
        </>
    );
}

ProjectSummary.layout = (page: ReactNode) => <SidebarLayout>{page}</SidebarLayout>;

// Made with Bob
