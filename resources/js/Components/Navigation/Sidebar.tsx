import { SideNav, SideNavItems, SideNavLink } from '@carbon/react';
import { Home, Dashboard, Grid, ChartLine, DeliveryTruck, Calendar, Document, Events } from '@carbon/icons-react';
import { router, usePage } from '@inertiajs/react';

export default function Sidebar() {
  const page = usePage();
  const currentPath = page.url;

  const navItems = [
    { path: '/', label: 'Main Page', icon: Home },
    { path: '/dashboard', label: 'Command Centre', icon: Dashboard },
    { path: '/projects-overview', label: 'Projects', icon: Grid },
    { path: '/project-summary', label: 'Summary', icon: ChartLine },
    { path: '/deliverables-timeline', label: 'Timeline', icon: Events },
    { path: '/deliverables', label: 'Deliverables', icon: DeliveryTruck },
    { path: '/agenda', label: 'Agenda', icon: Calendar },
    { path: '/prep', label: 'Prep', icon: Document },
  ];

  const handleNavigation = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    router.visit(path);
  };

  return (
    <SideNav
      aria-label="Side navigation"
      expanded
      isFixedNav
      className="app-sidebar"
    >
      <SideNavItems>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;
          
          return (
            <SideNavLink
              key={item.path}
              renderIcon={Icon}
              href={item.path}
              onClick={handleNavigation(item.path)}
              isActive={isActive}
            >
              {item.label}
            </SideNavLink>
          );
        })}
      </SideNavItems>
    </SideNav>
  );
}

// Made with Bob
