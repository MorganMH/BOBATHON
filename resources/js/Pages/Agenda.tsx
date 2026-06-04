import { Head } from '@inertiajs/react';
import { Tile } from '@carbon/react';
import SidebarLayout from '@/Layouts/SidebarLayout';
import type { Project } from '@/types';
import type { ReactNode } from 'react';

interface AgendaProps {
    projects: Project[];
}

export default function Agenda({ projects }: AgendaProps) {
    return (
        <>
            <Head title="Agenda" />
            
            <div className="cc-page-header">
                <h1>Meeting Agenda</h1>
                <p>Upcoming meetings and their agendas</p>
            </div>

            <Tile>
                <h3>This Week's Meetings</h3>
                <p className="cc-muted">
                    This page will display upcoming meetings with their agendas, action items,
                    and preparation materials for each project.
                </p>
                <div style={{ marginTop: '1rem' }}>
                    <p><strong>Projects with scheduled meetings:</strong></p>
                    <ul>
                        {projects.map((project) => (
                            <li key={project.id}>{project.name}</li>
                        ))}
                    </ul>
                </div>
            </Tile>
        </>
    );
}

Agenda.layout = (page: ReactNode) => <SidebarLayout>{page}</SidebarLayout>;

// Made with Bob
