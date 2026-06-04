import { ReactNode } from 'react';
import AppLayout from './AppLayout';
import Sidebar from '@/Components/Navigation/Sidebar';

interface SidebarLayoutProps {
    children: ReactNode;
}

export default function SidebarLayout({ children }: SidebarLayoutProps) {
    return (
        <AppLayout>
            <div className="app-with-sidebar">
                <Sidebar />
                <div className="sidebar-content">
                    {children}
                </div>
            </div>
        </AppLayout>
    );
}

// Made with Bob
