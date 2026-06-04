import { Head } from '@inertiajs/react';
import { Tile } from '@carbon/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import type { Project } from '@/types';
import type { ReactNode } from 'react';

interface PrepProps {
    projects: Project[];
}

export default function Prep({ projects }: PrepProps) {
    return (
        <>
            <Head title="Meeting Prep" />
            
            <div className="cc-page-header">
                <h1>Meeting Preparation</h1>
                <p>Prepare for upcoming meetings with key information and materials</p>
            </div>

            <Tile>
                <h3>Preparation Materials</h3>
                <p className="cc-muted">
                    This page will provide meeting preparation checklists, required materials,
                    pre-meeting briefings, and key discussion points for each upcoming meeting.
                </p>
                <div style={{ marginTop: '1rem' }}>
                    <p><strong>Active Projects:</strong></p>
                    <ul>
                        {projects.map((project) => (
                            <li key={project.id}>
                                {project.name} - <span className="cc-muted">{project.health} health</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </Tile>
        </>
    );
}

Prep.layout = (page: ReactNode) => <SidebarLayout>{page}</SidebarLayout>;

// Made with Bob
