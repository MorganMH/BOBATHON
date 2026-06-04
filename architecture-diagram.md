# Kathy's Command Centre - Architecture Overview

## System Architecture

```mermaid
graph TB
    subgraph "User Interface Layer"
        UI[Command Centre Dashboard]
        UI --> NAV[Navigation & Header]
        UI --> STATS[Quick Stats Panel]
        UI --> MAIN[Main Content Area]
    end
    
    subgraph "Main Content Components"
        MAIN --> PROJ[Project Overview]
        MAIN --> ACT[Actions Panel]
        MAIN --> BLOCK[Blockers Panel]
        MAIN --> REM[Reminders Panel]
        MAIN --> COMM[Communications Hub]
    end
    
    subgraph "Data Layer"
        PROJ --> DS[Data Service]
        ACT --> DS
        BLOCK --> DS
        REM --> DS
        COMM --> DS
        
        DS --> MOCK[Mock Data Store]
        MOCK --> PD[projects.json]
        MOCK --> AD[actions.json]
        MOCK --> CD[communications.json]
        MOCK --> BD[blockers.json]
    end
    
    subgraph "AI Services Layer"
        DS --> AI[AI Service Manager]
        AI --> OLLAMA[Ollama Integration]
        
        OLLAMA --> SUM[Summary Generation]
        OLLAMA --> EXT[Action Extraction]
        OLLAMA --> DET[Blocker Detection]
        OLLAMA --> SUG[Smart Suggestions]
    end
    
    subgraph "Carbon Design System"
        UI --> CARBON[Carbon Components]
        CARBON --> GRID[Grid/Layout]
        CARBON --> TABLE[DataTable]
        CARBON --> TILE[Tiles/Cards]
        CARBON --> TAG[Tags/Status]
        CARBON --> BTN[Buttons/Actions]
    end
    
    style UI fill:#0f62fe,color:#fff
    style AI fill:#24a148,color:#fff
    style OLLAMA fill:#f1c21b,color:#000
    style CARBON fill:#8a3ffc,color:#fff
```

## Component Hierarchy

```mermaid
graph TD
    APP[App.tsx] --> LAYOUT[Layout Component]
    
    LAYOUT --> HEADER[Header]
    LAYOUT --> SIDEBAR[Sidebar]
    LAYOUT --> CONTENT[Content Area]
    
    HEADER --> PROJSEL[Project Selector]
    HEADER --> USERMENU[User Menu]
    
    SIDEBAR --> NAVITEMS[Navigation Items]
    
    CONTENT --> DASHBOARD[Dashboard View]
    CONTENT --> PROJVIEW[Projects View]
    CONTENT --> ACTVIEW[Actions View]
    CONTENT --> BLOCKVIEW[Blockers View]
    CONTENT --> REMVIEW[Reminders View]
    CONTENT --> COMMVIEW[Communications View]
    
    DASHBOARD --> QUICKSTATS[Quick Stats]
    DASHBOARD --> PROJCARDS[Project Cards]
    DASHBOARD --> PANELS[Four Main Panels]
    
    PANELS --> ACTPANEL[Actions Panel]
    PANELS --> BLOCKPANEL[Blockers Panel]
    PANELS --> REMPANEL[Reminders Panel]
    PANELS --> COMMPANEL[Comms Panel]
    
    ACTPANEL --> ACTLIST[Action List]
    ACTPANEL --> ACTMODAL[Action Details Modal]
    
    BLOCKPANEL --> BLOCKLIST[Blocker List]
    BLOCKPANEL --> DEPGRAPH[Dependency Graph]
    
    REMPANEL --> REMLIST[Reminder List]
    REMPANEL --> QUICKSEND[Quick Send]
    
    COMMPANEL --> EMAILTAB[Email Tab]
    COMMPANEL --> CHATTAB[Chat Tab]
    COMMPANEL --> MEETTAB[Meeting Tab]
    
    style APP fill:#0f62fe,color:#fff
    style DASHBOARD fill:#24a148,color:#fff
    style PANELS fill:#f1c21b,color:#000
```

## Data Flow

```mermaid
sequenceDiagram
    participant User
    participant Dashboard
    participant DataService
    participant MockData
    participant OllamaAI
    
    User->>Dashboard: Opens Command Centre
    Dashboard->>DataService: Request all projects
    DataService->>MockData: Load projects.json
    MockData-->>DataService: Return project data
    DataService-->>Dashboard: Projects with stats
    Dashboard-->>User: Display overview
    
    User->>Dashboard: Select project
    Dashboard->>DataService: Request project details
    DataService->>MockData: Load actions, blockers, comms
    MockData-->>DataService: Return detailed data
    
    DataService->>OllamaAI: Request AI summary
    OllamaAI-->>DataService: Generated summary
    DataService-->>Dashboard: Complete project view
    Dashboard-->>User: Show detailed dashboard
    
    User->>Dashboard: View communication
    Dashboard->>OllamaAI: Extract actions from text
    OllamaAI-->>Dashboard: Extracted action items
    Dashboard-->>User: Display auto-captured actions
```

## AI Integration Flow

```mermaid
graph LR
    subgraph "Input Sources"
        EMAIL[Email Content]
        CHAT[Chat Messages]
        MEETING[Meeting Notes]
    end
    
    subgraph "AI Processing"
        EMAIL --> PROC[Text Processor]
        CHAT --> PROC
        MEETING --> PROC
        
        PROC --> OLLAMA[Ollama LLM]
        
        OLLAMA --> EXTRACT[Action Extractor]
        OLLAMA --> SUMMARIZE[Summarizer]
        OLLAMA --> DETECT[Blocker Detector]
        OLLAMA --> SUGGEST[Suggestion Engine]
    end
    
    subgraph "Output"
        EXTRACT --> ACTIONS[Action Items]
        SUMMARIZE --> SUMMARY[Project Summary]
        DETECT --> BLOCKERS[Identified Blockers]
        SUGGEST --> REMINDERS[Smart Reminders]
    end
    
    subgraph "Display"
        ACTIONS --> ACTPANEL[Actions Panel]
        SUMMARY --> PROJCARD[Project Card]
        BLOCKERS --> BLOCKPANEL[Blockers Panel]
        REMINDERS --> REMPANEL[Reminders Panel]
    end
    
    style OLLAMA fill:#f1c21b,color:#000
    style PROC fill:#0f62fe,color:#fff
```

## State Management

```mermaid
graph TB
    subgraph "Application State"
        APPSTATE[App State Context]
        
        APPSTATE --> PROJSTATE[Projects State]
        APPSTATE --> ACTSTATE[Actions State]
        APPSTATE --> BLOCKSTATE[Blockers State]
        APPSTATE --> REMSTATE[Reminders State]
        APPSTATE --> COMMSTATE[Communications State]
        APPSTATE --> UISTATE[UI State]
    end
    
    subgraph "State Updates"
        PROJSTATE --> PROJACTIONS[Project Actions]
        ACTSTATE --> ACTACTIONS[Action Actions]
        BLOCKSTATE --> BLOCKACTIONS[Blocker Actions]
        
        PROJACTIONS --> REDUCER[State Reducer]
        ACTACTIONS --> REDUCER
        BLOCKACTIONS --> REDUCER
        
        REDUCER --> APPSTATE
    end
    
    subgraph "Components Subscribe"
        APPSTATE --> COMP1[Dashboard]
        APPSTATE --> COMP2[Project View]
        APPSTATE --> COMP3[Actions Panel]
        APPSTATE --> COMP4[Blockers Panel]
    end
    
    style APPSTATE fill:#0f62fe,color:#fff
    style REDUCER fill:#24a148,color:#fff
```

## User Journey Flow

```mermaid
graph TD
    START[User Opens App] --> DASH[Dashboard View]
    
    DASH --> CHOICE{What does user need?}
    
    CHOICE -->|Check Status| STATS[View Quick Stats]
    CHOICE -->|Review Actions| ACTIONS[Actions Panel]
    CHOICE -->|Check Blockers| BLOCKERS[Blockers Panel]
    CHOICE -->|Follow Up| REMINDERS[Reminders Panel]
    CHOICE -->|Read Comms| COMMS[Communications Hub]
    
    STATS --> PROJDETAIL[Select Project]
    PROJDETAIL --> PROJVIEW[Detailed Project View]
    
    ACTIONS --> ACTDETAIL[View Action Details]
    ACTDETAIL --> ACTUPDATE[Update Action Status]
    ACTUPDATE --> NOTIFY[System Updates State]
    
    BLOCKERS --> BLOCKDETAIL[View Blocker Details]
    BLOCKDETAIL --> DEPVIEW[See Dependencies]
    DEPVIEW --> RESOLVE[Take Action to Resolve]
    
    REMINDERS --> REMDETAIL[View Reminder]
    REMDETAIL --> SEND[Send Follow-up]
    SEND --> TRACK[Track Response]
    
    COMMS --> COMMDETAIL[Read Communication]
    COMMDETAIL --> AIEXTRACT[AI Extracts Actions]
    AIEXTRACT --> ADDACTION[Add to Actions Panel]
    
    NOTIFY --> REFRESH[Refresh Dashboard]
    TRACK --> REFRESH
    ADDACTION --> REFRESH
    REFRESH --> DASH
    
    style START fill:#0f62fe,color:#fff
    style DASH fill:#24a148,color:#fff
    style NOTIFY fill:#f1c21b,color:#000
```

## Technology Stack Layers

```mermaid
graph TB
    subgraph "Presentation Layer"
        REACT[React 18+]
        CARBON[Carbon Design System]
        TS[TypeScript]
    end
    
    subgraph "State Management"
        CONTEXT[React Context API]
        HOOKS[Custom Hooks]
    end
    
    subgraph "Business Logic"
        SERVICES[Service Layer]
        UTILS[Utility Functions]
    end
    
    subgraph "Data Layer"
        MOCK[Mock Data]
        TYPES[TypeScript Types]
    end
    
    subgraph "AI Layer"
        OLLAMA[Ollama Integration]
        PROMPTS[Prompt Engineering]
    end
    
    subgraph "Build Tools"
        VITE[Vite]
        ESL[ESLint]
        PRET[Prettier]
    end
    
    REACT --> CONTEXT
    CARBON --> REACT
    TS --> REACT
    
    CONTEXT --> SERVICES
    HOOKS --> SERVICES
    
    SERVICES --> MOCK
    SERVICES --> OLLAMA
    
    MOCK --> TYPES
    OLLAMA --> PROMPTS
    
    VITE --> REACT
    ESL --> TS
    PRET --> TS
    
    style REACT fill:#0f62fe,color:#fff
    style CARBON fill:#8a3ffc,color:#fff
    style OLLAMA fill:#f1c21b,color:#000
```

## Deployment Architecture

```mermaid
graph LR
    subgraph "Development"
        DEV[Local Dev Server]
        DEV --> VITE[Vite Dev Server]
        DEV --> OLLAMA_LOCAL[Local Ollama]
    end
    
    subgraph "Build Process"
        BUILD[npm run build]
        BUILD --> BUNDLE[Optimized Bundle]
        BUNDLE --> DIST[dist/ folder]
    end
    
    subgraph "Demo Deployment"
        DIST --> STATIC[Static File Server]
        STATIC --> DEMO[Demo Environment]
        
        DEMO --> OLLAMA_DEMO[Demo Ollama Instance]
    end
    
    subgraph "Access"
        DEMO --> BROWSER[Web Browser]
        BROWSER --> USER[Demo Audience]
    end
    
    style DEV fill:#24a148,color:#fff
    style DEMO fill:#0f62fe,color:#fff
    style USER fill:#f1c21b,color:#000
```

## Security & Performance Considerations

```mermaid
graph TB
    subgraph "Performance Optimizations"
        LAZY[Lazy Loading]
        MEMO[React.memo]
        VIRTUAL[Virtualization]
        CACHE[Response Caching]
    end
    
    subgraph "Security Measures"
        SANITIZE[Input Sanitization]
        CSP[Content Security Policy]
        CORS[CORS Configuration]
    end
    
    subgraph "Accessibility"
        A11Y[WCAG 2.1 AA]
        KEYBOARD[Keyboard Navigation]
        SCREEN[Screen Reader Support]
        CONTRAST[High Contrast Mode]
    end
    
    subgraph "Monitoring"
        ERRORS[Error Boundaries]
        LOGGING[Console Logging]
        PERF[Performance Metrics]
    end
    
    LAZY --> APP[Application]
    MEMO --> APP
    VIRTUAL --> APP
    CACHE --> APP
    
    SANITIZE --> APP
    CSP --> APP
    CORS --> APP
    
    A11Y --> APP
    KEYBOARD --> APP
    SCREEN --> APP
    CONTRAST --> APP
    
    ERRORS --> APP
    LOGGING --> APP
    PERF --> APP
    
    style APP fill:#0f62fe,color:#fff
```

---

## Key Design Decisions

### 1. Component Architecture
- **Modular Design**: Each feature is a self-contained component
- **Reusability**: Common components shared across features
- **Separation of Concerns**: UI, logic, and data layers clearly separated

### 2. State Management
- **Context API**: Lightweight, built-in React solution
- **Local State**: Component-level state for UI interactions
- **Derived State**: Computed values from base state

### 3. AI Integration
- **Async Processing**: Non-blocking AI calls
- **Fallback Responses**: Pre-generated content for demo reliability
- **Caching**: Store AI responses to avoid redundant calls

### 4. Data Structure
- **Normalized Data**: Efficient lookups and updates
- **Relationships**: Clear links between projects, actions, blockers
- **Timestamps**: Track creation and updates

### 5. UI/UX Patterns
- **Progressive Disclosure**: Show details on demand
- **Consistent Navigation**: Predictable user flows
- **Visual Hierarchy**: Clear importance indicators
- **Responsive Feedback**: Immediate UI updates

---

**Document Version**: 1.0  
**Last Updated**: 2026-06-04  
**Companion to**: demo-plan.md