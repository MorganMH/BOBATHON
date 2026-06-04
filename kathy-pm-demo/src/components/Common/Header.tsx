import { Header as CarbonHeader, HeaderName, HeaderGlobalBar, HeaderGlobalAction, Select, SelectItem } from '@carbon/react';
import { Notification, UserAvatar } from '@carbon/icons-react';
import { useAppContext } from '../../context/AppContext';
import type { Project } from '../../types';

export default function Header() {
  const { state, dispatch } = useAppContext();

  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({ type: 'SELECT_PROJECT', payload: e.target.value || null });
  };

  return (
    <CarbonHeader aria-label="Kathy's Command Centre">
      <HeaderName prefix="">
        Kathy's Command Centre
      </HeaderName>
      
      <div style={{ marginLeft: 'auto', marginRight: '1rem', display: 'flex', alignItems: 'center' }}>
        <Select
          id="project-selector"
          labelText=""
          hideLabel
          value={state.selectedProjectId || ''}
          onChange={handleProjectChange}
          style={{ minWidth: '250px' }}
        >
          <SelectItem value="" text="All Projects" />
          {state.projects.map((project: Project) => (
            <SelectItem key={project.id} value={project.id} text={project.name} />
          ))}
        </Select>
      </div>

      <HeaderGlobalBar>
        <HeaderGlobalAction aria-label="Notifications" tooltipAlignment="end">
          <Notification size={20} />
        </HeaderGlobalAction>
        <HeaderGlobalAction aria-label="User Profile" tooltipAlignment="end">
          <UserAvatar size={20} />
        </HeaderGlobalAction>
      </HeaderGlobalBar>
    </CarbonHeader>
  );
}

// Made with Bob
