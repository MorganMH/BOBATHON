# Kathy's Command Centre - Step-by-Step Implementation Guide

## Prerequisites

- Node.js and npm installed
- Existing kathy-pm-demo project
- Familiarity with React, TypeScript, and Carbon Design System

---

## Phase 1: Setup and Dependencies

### Step 1: Install React Router
```bash
cd BOBATHON/kathy-pm-demo
npm install react-router-dom
npm install --save-dev @types/react-router-dom
```

### Step 2: Create New Directory Structure
```bash
# Create new component directories
mkdir -p src/components/Landing
mkdir -p src/components/Navigation
mkdir -p src/components/Pages

# Create new data files
touch src/data/meetings.json
touch src/data/agenda.json

# Create new type files
touch src/types/meeting.types.ts
touch src/types/navigation.types.ts
```

---

## Phase 2: Type Definitions

### Step 3: Create Meeting Types
**File**: `src/types/meeting.types.ts`

```typescript
export interface Meeting {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  attendees: string[];
  projectId: string;
  location: string;
  type: 'standup' | 'planning' | 'review' | 'retrospective' | 'general';
}

export interface AgendaItem {
  id: string;
  meetingId: string;
  items: string[];
  notes?: string;
}
```

### Step 4: Create Navigation Types
**File**: `src/types/navigation.types.ts`

```typescript
export type NavigationItem = {
  id: string;
  label: string;
  path: string;
  icon?: string;
};

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { id: 'main', label: 'Main Page', path: '/' },
  { id: 'summary', label: 'Project Summary', path: '/app/summary' },
  { id: 'overview', label: 'Project Overview', path: '/app/projects' },
  { id: 'deliverables', label: 'Deliverables', path: '/app/deliverables' },
  { id: 'agenda', label: 'Agenda', path: '/app/agenda' },
  { id: 'prep', label: 'Prep', path: '/app/prep' },
];
```

---

## Phase 3: Mock Data

### Step 5: Create Meetings Data
**File**: `src/data/meetings.json`

```json
[
  {
    "id": "meet-001",
    "title": "Daily Standup",
    "date": "2026-06-04",
    "startTime": "09:00",
    "endTime": "09:15",
    "attendees": ["Sarah Chen", "Tom Wilson", "Maria Garcia", "James Park"],
    "projectId": "proj-001",
    "location": "Virtual - Teams",
    "type": "standup"
  },
  {
    "id": "meet-002",
    "title": "Sprint Planning",
    "date": "2026-06-05",
    "startTime": "10:00",
    "endTime": "11:30",
    "attendees": ["Sarah Chen", "Tom Wilson", "Maria Garcia", "James Park"],
    "projectId": "proj-001",
    "location": "Conference Room A",
    "type": "planning"
  },
  {
    "id": "meet-003",
    "title": "Design Review",
    "date": "2026-06-05",
    "startTime": "14:00",
    "endTime": "15:00",
    "attendees": ["Lisa Anderson", "David Kim", "Rachel Brown"],
    "projectId": "proj-002",
    "location": "Virtual - Teams",
    "type": "review"
  },
  {
    "id": "meet-004",
    "title": "API Integration Sync",
    "date": "2026-06-06",
    "startTime": "11:00",
    "endTime": "12:00",
    "attendees": ["Michael Zhang", "Emma Taylor", "Chris Johnson"],
    "projectId": "proj-003",
    "location": "Conference Room B",
    "type": "general"
  },
  {
    "id": "meet-005",
    "title": "Weekly Status Update",
    "date": "2026-06-07",
    "startTime": "15:00",
    "endTime": "16:00",
    "attendees": ["All Team Members"],
    "projectId": "proj-001",
    "location": "Virtual - Teams",
    "type": "general"
  }
]
```

### Step 6: Create Agenda Data
**File**: `src/data/agenda.json`

```json
[
  {
    "id": "agenda-001",
    "meetingId": "meet-002",
    "items": [
      "Review sprint goals and objectives",
      "Assign tasks to team members",
      "Discuss current blockers",
      "Set sprint timeline and milestones",
      "Q&A session"
    ],
    "notes": "Focus on authentication module completion"
  },
  {
    "id": "agenda-002",
    "meetingId": "meet-003",
    "items": [
      "Present new design mockups",
      "Review accessibility compliance",
      "Discuss user feedback",
      "Finalize design decisions"
    ]
  },
  {
    "id": "agenda-003",
    "meetingId": "meet-004",
    "items": [
      "API documentation review",
      "Integration timeline discussion",
      "Blocker resolution",
      "Next steps planning"
    ]
  }
]
```

---

## Phase 4: Landing Page Components

### Step 7: Create Landing Page Component
**File**: `src/components/Landing/LandingPage.tsx`

```typescript
import { Grid, Column, Tabs, TabList, Tab, TabPanels, TabPanel, Tile } from '@carbon/react';
import { UserAvatar } from '@carbon/icons-react';
import ProjectsTab from './ProjectsTab';
import CalendarTab from './CalendarTab';
import DeliverablesTab from './DeliverablesTab';
import './LandingPage.scss';

export default function LandingPage() {
  return (
    <div className="landing-page">
      <Grid className="landing-grid">
        <Column lg={16} md={8} sm={4}>
          <div className="user-profile-section">
            <Tile className="user-profile-tile">
              <div className="user-avatar-container">
                <UserAvatar size={120} />
              </div>
              <h1 className="user-greeting">Welcome, Kathy</h1>
              <p className="user-subtitle">Project Manager</p>
            </Tile>
          </div>
        </Column>

        <Column lg={16} md={8} sm={4}>
          <Tabs>
            <TabList aria-label="Main navigation tabs" contained>
              <Tab>Projects</Tab>
              <Tab>Calendar</Tab>
              <Tab>Deliverables</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <ProjectsTab />
              </TabPanel>
              <TabPanel>
                <CalendarTab />
              </TabPanel>
              <TabPanel>
                <DeliverablesTab />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Column>
      </Grid>
    </div>
  );
}
```

### Step 8: Create Landing Page Styles
**File**: `src/components/Landing/LandingPage.scss`

```scss
.landing-page {
  min-height: 100vh;
  background-color: var(--cds-background);
  padding: 2rem 0;
}

.landing-grid {
  max-width: 1200px;
  margin: 0 auto;
}

.user-profile-section {
  margin-bottom: 2rem;
}

.user-profile-tile {
  text-align: center;
  padding: 3rem 2rem;
  background: linear-gradient(135deg, #f4f4f4 0%, #ffffff 100%);
}

.user-avatar-container {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
  
  svg {
    width: 120px;
    height: 120px;
    padding: 1rem;
    background-color: #0f62fe;
    color: white;
    border-radius: 50%;
  }
}

.user-greeting {
  font-size: 2rem;
  font-weight: 400;
  margin-bottom: 0.5rem;
  color: var(--cds-text-primary);
}

.user-subtitle {
  font-size: 1rem;
  color: var(--cds-text-secondary);
}
```

### Step 9: Create Projects Tab Component
**File**: `src/components/Landing/ProjectsTab.tsx`

```typescript
import { Grid, Column, ClickableTile, Tag, ProgressBar } from '@carbon/react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { getHealthColor, getHealthLabel } from '../../utils/statusHelpers';
import type { Project } from '../../types';
import './ProjectsTab.scss';

export default function ProjectsTab() {
  const { state } = useAppContext();
  const navigate = useNavigate();

  const handleProjectClick = () => {
    navigate('/app/projects');
  };

  return (
    <div className="projects-tab">
      <h2 className="tab-title">Your Projects</h2>
      <Grid className="projects-grid">
        {state.projects.map((project: Project) => (
          <Column key={project.id} lg={5} md={4} sm={4}>
            <ClickableTile
              className="project-card-landing"
              onClick={handleProjectClick}
            >
              <div className="project-card-header">
                <h3>{project.name}</h3>
                <Tag type={getHealthColor(project.health)} size="sm">
                  {getHealthLabel(project.health)}
                </Tag>
              </div>
              <p className="project-description">{project.description}</p>
              <div className="project-progress">
                <ProgressBar
                  label=""
                  value={project.progress}
                  max={100}
                  size="small"
                />
                <span className="progress-text">{project.progress}% complete</span>
              </div>
              <div className="project-stats">
                <span>{project.activeBlockers} blockers</span>
                <span>{project.pendingActions} actions</span>
              </div>
            </ClickableTile>
          </Column>
        ))}
      </Grid>
    </div>
  );
}
```

### Step 10: Create Calendar Tab Component
**File**: `src/components/Landing/CalendarTab.tsx`

```typescript
import { Grid, Column, Tile, StructuredListWrapper, StructuredListHead, StructuredListRow, StructuredListCell, StructuredListBody, Tag } from '@carbon/react';
import { useAppContext } from '../../context/AppContext';
import { formatDate } from '../../utils/dateHelpers';
import meetingsData from '../../data/meetings.json';
import type { Meeting } from '../../types/meeting.types';
import type { Action, Reminder } from '../../types';
import './CalendarTab.scss';

export default function CalendarTab() {
  const { state } = useAppContext();
  const meetings = meetingsData as Meeting[];
  
  // Get today's date
  const today = new Date().toISOString().split('T')[0];
  
  // Filter today's actions
  const todayActions = state.actions.filter((action: Action) => 
    action.dueDate === today && action.status !== 'completed'
  );
  
  // Get active reminders
  const activeReminders = state.reminders.filter((reminder: Reminder) => 
    reminder.status === 'active'
  );

  return (
    <div className="calendar-tab">
      <h2 className="tab-title">This Week's Schedule</h2>
      
      <Grid>
        <Column lg={10} md={5} sm={4}>
          <Tile className="calendar-section">
            <h3>Upcoming Meetings</h3>
            <StructuredListWrapper>
              <StructuredListHead>
                <StructuredListRow head>
                  <StructuredListCell head>Meeting</StructuredListCell>
                  <StructuredListCell head>Date & Time</StructuredListCell>
                  <StructuredListCell head>Type</StructuredListCell>
                </StructuredListRow>
              </StructuredListHead>
              <StructuredListBody>
                {meetings.map((meeting) => (
                  <StructuredListRow key={meeting.id}>
                    <StructuredListCell>
                      <strong>{meeting.title}</strong>
                      <br />
                      <small>{meeting.location}</small>
                    </StructuredListCell>
                    <StructuredListCell>
                      {formatDate(meeting.date)}
                      <br />
                      {meeting.startTime} - {meeting.endTime}
                    </StructuredListCell>
                    <StructuredListCell>
                      <Tag size="sm">{meeting.type}</Tag>
                    </StructuredListCell>
                  </StructuredListRow>
                ))}
              </StructuredListBody>
            </StructuredListWrapper>
          </Tile>
        </Column>

        <Column lg={6} md={3} sm={4}>
          <Tile className="calendar-section">
            <h3>Today's Actions</h3>
            {todayActions.length > 0 ? (
              <ul className="action-list">
                {todayActions.slice(0, 5).map((action: Action) => (
                  <li key={action.id}>
                    <Tag type={action.priority === 'high' ? 'red' : 'blue'} size="sm">
                      {action.priority}
                    </Tag>
                    <span>{action.title}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No actions due today</p>
            )}
          </Tile>

          <Tile className="calendar-section" style={{ marginTop: '1rem' }}>
            <h3>Active Reminders</h3>
            {activeReminders.length > 0 ? (
              <ul className="reminder-list">
                {activeReminders.slice(0, 5).map((reminder: Reminder) => (
                  <li key={reminder.id}>
                    <strong>{reminder.title}</strong>
                    <br />
                    <small>{reminder.message}</small>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No active reminders</p>
            )}
          </Tile>
        </Column>
      </Grid>
    </div>
  );
}
```

### Step 11: Create Deliverables Tab Component
**File**: `src/components/Landing/DeliverablesTab.tsx`

```typescript
import { Grid, Column, Accordion, AccordionItem, Tile, Tag } from '@carbon/react';
import { useAppContext } from '../../context/AppContext';
import type { Action, Communication, Project } from '../../types';
import './DeliverablesTab.scss';

export default function DeliverablesTab() {
  const { state } = useAppContext();

  const getProjectActions = (projectId: string) => {
    return state.actions.filter((action: Action) => action.projectId === projectId);
  };

  const getProjectCommunications = (projectId: string) => {
    return state.communications.filter((comm: Communication) => comm.projectId === projectId);
  };

  return (
    <div className="deliverables-tab">
      <h2 className="tab-title">Deliverables & Communications</h2>
      
      <Grid>
        <Column lg={8} md={4} sm={4}>
          <Tile className="deliverables-section">
            <h3>Recent Communications</h3>
            {state.communications.slice(0, 5).map((comm: Communication) => (
              <div key={comm.id} className="communication-item">
                <div className="comm-header">
                  <Tag size="sm">{comm.type}</Tag>
                  <strong>{comm.subject}</strong>
                </div>
                <p className="comm-meta">
                  From: {comm.from} | {new Date(comm.date).toLocaleDateString()}
                </p>
                {comm.aiSummary && (
                  <p className="comm-summary">{comm.aiSummary}</p>
                )}
              </div>
            ))}
          </Tile>
        </Column>

        <Column lg={8} md={4} sm={4}>
          <Tile className="deliverables-section">
            <h3>Project Actions</h3>
            <Accordion>
              {state.projects.map((project: Project) => {
                const actions = getProjectActions(project.id);
                return (
                  <AccordionItem key={project.id} title={`${project.name} (${actions.length} actions)`}>
                    {actions.length > 0 ? (
                      <ul className="action-list">
                        {actions.map((action: Action) => (
                          <li key={action.id}>
                            <Tag type={action.status === 'overdue' ? 'red' : 'blue'} size="sm">
                              {action.status}
                            </Tag>
                            <span>{action.title}</span>
                            <small> - {action.owner}</small>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No pending actions</p>
                    )}
                  </AccordionItem>
                );
              })}
            </Accordion>
          </Tile>
        </Column>
      </Grid>
    </div>
  );
}
```

---

## Phase 5: Navigation Components

### Step 12: Create Sidebar Component
**File**: `src/components/Navigation/Sidebar.tsx`

```typescript
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
```

### Step 13: Create Main App Layout
**File**: `src/components/Navigation/MainAppLayout.tsx`

```typescript
import { Outlet } from 'react-router-dom';
import { Content } from '@carbon/react';
import Header from '../Common/Header';
import Sidebar from './Sidebar';
import './MainAppLayout.scss';

export default function MainAppLayout() {
  return (
    <div className="main-app-layout">
      <Header />
      <div className="app-container">
        <Sidebar />
        <Content className="app-content">
          <Outlet />
        </Content>
      </div>
    </div>
  );
}
```

---

## Phase 6: Page Components

### Step 14: Create Projects Overview Page
**File**: `src/components/Projects/ProjectsOverviewPage.tsx`

```typescript
import { Grid, Column, ClickableTile, Tag } from '@carbon/react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { getHealthColor, getHealthLabel } from '../../utils/statusHelpers';
import { Application, CloudApp, Integration } from '@carbon/icons-react';
import type { Project } from '../../types';
import './ProjectsOverviewPage.scss';

export default function ProjectsOverviewPage() {
  const { state, dispatch } = useAppContext();
  const navigate = useNavigate();

  const projectIcons = [Application, CloudApp, Integration];

  const handleProjectClick = (projectId: string) => {
    dispatch({ type: 'SELECT_PROJECT', payload: projectId });
    navigate(`/app/projects/${projectId}`);
  };

  return (
    <div className="projects-overview-page">
      <h1>Projects Overview</h1>
      <p className="page-subtitle">Select a project to view details</p>
      
      <Grid className="projects-overview-grid">
        {state.projects.map((project: Project, index: number) => {
          const Icon = projectIcons[index % projectIcons.length];
          return (
            <Column key={project.id} lg={5} md={4} sm={4}>
              <ClickableTile
                className="project-tile"
                onClick={() => handleProjectClick(project.id)}
              >
                <div className="project-icon">
                  <Icon size={64} />
                </div>
                <div className="project-info">
                  <h3>{project.name}</h3>
                  <Tag type={getHealthColor(project.health)} size="md">
                    {getHealthLabel(project.health)}
                  </Tag>
                  <div className="project-metrics">
                    <span>{project.progress}% Complete</span>
                    <span>{project.activeBlockers} Blockers</span>
                    <span>{project.pendingActions} Actions</span>
                  </div>
                </div>
              </ClickableTile>
            </Column>
          );
        })}
      </Grid>
    </div>
  );
}
```

### Step 15: Create Additional Page Components

**File**: `src/components/Pages/ProjectSummaryPage.tsx`
**File**: `src/components/Pages/DeliverablesPage.tsx`
**File**: `src/components/Pages/AgendaPage.tsx`
**File**: `src/components/Pages/PrepPage.tsx`

(Create placeholder components for now - these can be enhanced later)

---

## Phase 7: Routing Setup

### Step 16: Update App.tsx
**File**: `src/App.tsx`

```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Theme } from '@carbon/react';
import { AppProvider } from './context/AppContext';
import LandingPage from './components/Landing/LandingPage';
import MainAppLayout from './components/Navigation/MainAppLayout';
import ProjectsOverviewPage from './components/Projects/ProjectsOverviewPage';
import CommandCentre from './components/Dashboard/CommandCentre';
import ProjectSummaryPage from './components/Pages/ProjectSummaryPage';
import DeliverablesPage from './components/Pages/DeliverablesPage';
import AgendaPage from './components/Pages/AgendaPage';
import PrepPage from './components/Pages/PrepPage';
import '@carbon/react/index.scss';
import './App.scss';

function App() {
  return (
    <Theme theme="white">
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/app" element={<MainAppLayout />}>
              <Route path="projects" element={<ProjectsOverviewPage />} />
              <Route path="projects/:projectId" element={<CommandCentre />} />
              <Route path="summary" element={<ProjectSummaryPage />} />
              <Route path="deliverables" element={<DeliverablesPage />} />
              <Route path="agenda" element={<AgendaPage />} />
              <Route path="prep" element={<PrepPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </Theme>
  );
}

export default App;
```

---

## Phase 8: Testing

### Step 17: Test Navigation Flow
1. Start development server: `npm run dev`
2. Navigate to landing page
3. Test all three tabs
4. Click project card to navigate to overview
5. Click project tile to view details
6. Test all sidebar navigation items
7. Verify sidebar is hidden on landing page
8. Verify sidebar is visible on all other pages

---

## Completion Checklist

- [ ] React Router installed and configured
- [ ] Landing page with user profile created
- [ ] Three tabs (Projects, Calendar, Deliverables) implemented
- [ ] Projects overview page with clickable tiles created
- [ ] Sidebar navigation component created
- [ ] All navigation items functional
- [ ] Mock data for meetings and agenda created
- [ ] Routing properly configured
- [ ] Existing functionality preserved
- [ ] Responsive design tested
- [ ] All components styled with Carbon

---

**Document Version**: 1.0  
**Created**: 2026-06-04  
**Status**: Ready for Implementation