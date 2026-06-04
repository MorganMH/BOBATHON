import React, { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { Project, Action, Blocker, Communication, Reminder } from '../types';

// Import mock data
import projectsData from '../data/projects.json';
import actionsData from '../data/actions.json';
import blockersData from '../data/blockers.json';
import communicationsData from '../data/communications.json';
import remindersData from '../data/reminders.json';

interface AppState {
  projects: Project[];
  actions: Action[];
  blockers: Blocker[];
  communications: Communication[];
  reminders: Reminder[];
  selectedProjectId: string | null;
  loading: boolean;
  error: string | null;
}

type AppAction =
  | { type: 'SET_PROJECTS'; payload: Project[] }
  | { type: 'SET_ACTIONS'; payload: Action[] }
  | { type: 'SET_BLOCKERS'; payload: Blocker[] }
  | { type: 'SET_COMMUNICATIONS'; payload: Communication[] }
  | { type: 'SET_REMINDERS'; payload: Reminder[] }
  | { type: 'SELECT_PROJECT'; payload: string | null }
  | { type: 'ADD_ACTIONS'; payload: Action[] }
  | { type: 'ADD_BLOCKERS'; payload: Blocker[] }
  | { type: 'ADD_COMMUNICATION'; payload: Communication }
  | { type: 'UPDATE_ACTION'; payload: { id: string; updates: Partial<Action> } }
  | { type: 'UPDATE_BLOCKER'; payload: { id: string; updates: Partial<Blocker> } }
  | { type: 'UPDATE_PROJECT_STATS'; payload: { projectId: string; pendingActions: number; activeBlockers: number } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: AppState = {
  projects: projectsData as Project[],
  actions: actionsData as Action[],
  blockers: blockersData as Blocker[],
  communications: communicationsData as Communication[],
  reminders: remindersData as Reminder[],
  selectedProjectId: 'proj-001', // Default to Business-Critical App
  loading: false,
  error: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_PROJECTS':
      return { ...state, projects: action.payload };
    
    case 'SET_ACTIONS':
      return { ...state, actions: action.payload };
    
    case 'SET_BLOCKERS':
      return { ...state, blockers: action.payload };
    
    case 'SET_COMMUNICATIONS':
      return { ...state, communications: action.payload };
    
    case 'SET_REMINDERS':
      return { ...state, reminders: action.payload };
    
    case 'SELECT_PROJECT':
      return { ...state, selectedProjectId: action.payload };
    
    case 'ADD_ACTIONS':
      return {
        ...state,
        actions: [...state.actions, ...action.payload],
      };
    
    case 'ADD_BLOCKERS':
      return {
        ...state,
        blockers: [...state.blockers, ...action.payload],
      };
    
    case 'ADD_COMMUNICATION':
      return {
        ...state,
        communications: [...state.communications, action.payload],
      };
    
    case 'UPDATE_ACTION':
      return {
        ...state,
        actions: state.actions.map(a =>
          a.id === action.payload.id ? { ...a, ...action.payload.updates } : a
        ),
      };
    
    case 'UPDATE_BLOCKER':
      return {
        ...state,
        blockers: state.blockers.map(b =>
          b.id === action.payload.id ? { ...b, ...action.payload.updates } : b
        ),
      };
    
    case 'UPDATE_PROJECT_STATS':
      return {
        ...state,
        projects: state.projects.map(p =>
          p.id === action.payload.projectId
            ? {
                ...p,
                pendingActions: action.payload.pendingActions,
                activeBlockers: action.payload.activeBlockers,
                lastUpdated: new Date().toISOString(),
              }
            : p
        ),
      };
    
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

// Selector hooks for convenience
export function useSelectedProject() {
  const { state } = useAppContext();
  return state.projects.find(p => p.id === state.selectedProjectId) || null;
}

export function useProjectActions(projectId?: string) {
  const { state } = useAppContext();
  const id = projectId || state.selectedProjectId;
  return id ? state.actions.filter(a => a.projectId === id) : state.actions;
}

export function useProjectBlockers(projectId?: string) {
  const { state } = useAppContext();
  const id = projectId || state.selectedProjectId;
  return id ? state.blockers.filter(b => b.projectId === id) : state.blockers;
}

export function useProjectCommunications(projectId?: string) {
  const { state } = useAppContext();
  const id = projectId || state.selectedProjectId;
  return id ? state.communications.filter(c => c.projectId === id) : state.communications;
}

export function useProjectReminders(projectId?: string) {
  const { state } = useAppContext();
  const id = projectId || state.selectedProjectId;
  return id ? state.reminders.filter(r => r.projectId === id) : state.reminders;
}

// Made with Bob
