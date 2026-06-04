import { Grid, Column, Content, Tabs, TabList, Tab, TabPanels, TabPanel } from '@carbon/react';
import Header from '../Common/Header';
import QuickStats from './QuickStats';
import ProjectOverview from '../Projects/ProjectOverview';
import ActionsPanel from '../Actions/ActionsPanel';
import BlockersPanel from '../Blockers/BlockersPanel';
import RemindersPanel from '../Reminders/RemindersPanel';
import CommunicationsHub from '../Communications/CommunicationsHub';
import './CommandCentre.scss';

export default function CommandCentre() {
  return (
    <div className="command-centre">
      <Header />
      <Content>
        <Grid className="command-centre-grid">
          <Column lg={16} md={8} sm={4}>
            <h1 className="page-title">Project Command Centre</h1>
            <QuickStats />
          </Column>

          <Column lg={16} md={8} sm={4}>
            <ProjectOverview />
          </Column>

          <Column lg={16} md={8} sm={4}>
            <Tabs>
              <TabList aria-label="Command Centre Tabs" contained>
                <Tab>Actions & Promises</Tab>
                <Tab>Blockers & Dependencies</Tab>
                <Tab>Smart Reminders</Tab>
                <Tab>Communications</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <ActionsPanel />
                </TabPanel>
                <TabPanel>
                  <BlockersPanel />
                </TabPanel>
                <TabPanel>
                  <RemindersPanel />
                </TabPanel>
                <TabPanel>
                  <CommunicationsHub />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Column>
        </Grid>
      </Content>
    </div>
  );
}

// Made with Bob
