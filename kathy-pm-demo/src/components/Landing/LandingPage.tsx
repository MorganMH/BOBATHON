import { Grid, Column, Tabs, TabList, Tab, TabPanels, TabPanel, Tile } from '@carbon/react';
import { UserAvatar } from '@carbon/icons-react';
import Header from '../Common/Header';
import ProjectsTab from './ProjectsTab';
import CalendarTab from './CalendarTab';
import DeliverablesTab from './DeliverablesTab';
import './LandingPage.scss';

export default function LandingPage() {
  return (
    <div className="landing-page">
      <Header />
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

// Made with Bob