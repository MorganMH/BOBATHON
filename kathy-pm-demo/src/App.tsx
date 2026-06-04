import { Theme } from '@carbon/react';
import { AppProvider } from './context/AppContext';
import CommandCentre from './components/Dashboard/CommandCentre';
import '@carbon/react/index.scss';
import './App.scss';

function App() {
  return (
    <Theme theme="white">
      <AppProvider>
        <CommandCentre />
      </AppProvider>
    </Theme>
  );
}

export default App;

// Made with Bob
