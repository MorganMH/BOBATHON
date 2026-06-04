import { SideNav, SideNavItems, SideNavLink } from '@carbon/react';
import { Home, ChartLine, Grid, DeliveryTruck, Calendar, Document } from '@carbon/icons-react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.scss';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Main Page', icon: Home },
    { path: '/app/summary', label: 'Project Summary', icon: ChartLine },
    { path: '/app/projects', label: 'Project Overview', icon: Grid },
    { path: '/app/deliverables', label: 'Deliverables', icon: DeliveryTruck },
    { path: '/app/agenda', label: 'Agenda', icon: Calendar },
    { path: '/app/prep', label: 'Prep', icon: Document },
  ];

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
          return (
            <SideNavLink
              key={item.path}
              renderIcon={Icon}
              onClick={() => navigate(item.path)}
              isActive={location.pathname === item.path}
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