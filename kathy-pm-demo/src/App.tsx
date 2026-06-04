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

// Made with Bob
