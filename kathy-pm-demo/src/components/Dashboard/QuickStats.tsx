import { Tile } from '@carbon/react';
import { useAppContext, useProjectActions, useProjectBlockers } from '../../context/AppContext';
import './QuickStats.scss';

export default function QuickStats() {
  const { state } = useAppContext();
  const actions = useProjectActions();
  const blockers = useProjectBlockers();

  const stats = [
    {
      label: 'Active Projects',
      value: state.selectedProjectId ? 1 : state.projects.length,
      color: '#0f62fe',
    },
    {
      label: 'Pending Actions',
      value: actions.filter(a => a.status === 'pending' || a.status === 'in-progress').length,
      color: '#8a3ffc',
    },
    {
      label: 'Active Blockers',
      value: blockers.filter(b => b.status === 'active').length,
      color: '#da1e28',
    },
    {
      label: 'Overdue Items',
      value: actions.filter(a => a.status === 'overdue').length,
      color: '#f1c21b',
    },
  ];

  return (
    <div className="quick-stats">
      {stats.map((stat, index) => (
        <Tile key={index} className="stat-tile">
          <div className="stat-value" style={{ color: stat.color }}>
            {stat.value}
          </div>
          <div className="stat-label">{stat.label}</div>
        </Tile>
      ))}
    </div>
  );
}

// Made with Bob
