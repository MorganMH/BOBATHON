import { Head } from '@inertiajs/react';
import { Tile } from '@carbon/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import type { Project } from '@/types';
import type { ReactNode } from 'react';

interface DeliverablesProps {
    projects: Project[];
}

export default function Deliverables({ projects }: DeliverablesProps) {
    return (
        <>
            <Head title="Deliverables" />
            
            <div className="cc-page-header">
                <h1>Deliverables</h1>
                <p>Track all deliverables across your projects</p>
            </div>

            <Tile>
                <h3>All Project Deliverables</h3>
                <p className="cc-muted">
                    This page will show all deliverables grouped by project, with status tracking,
                    due dates, and responsible parties.
                </p>
                <ul style={{ marginTop: '1rem' }}>
                    {projects.map((project) => (
                        <li key={project.id}>
                            <strong>{project.name}</strong> - {project.code}
                        </li>
                    ))}
                </ul>
            </Tile>
        </>
    );
}

Deliverables.layout = (page: ReactNode) => <SidebarLayout>{page}</SidebarLayout>;

// Made with Bob
