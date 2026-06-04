# Kathy's Command Centre - Architecture Diagram

## Application Flow Architecture

```mermaid
graph TB
    Start[User Opens App] --> Landing[Landing Page]
    
    Landing --> UserProfile[User Profile Section<br/>Kathy's Photo/Icon]
    Landing --> TabSection[Three Main Tabs]
    
    TabSection --> ProjectsTab[Projects Tab]
    TabSection --> CalendarTab[Calendar Tab]
    TabSection --> DeliverablesTab[Deliverables Tab]
    
    ProjectsTab --> P1[Business-Critical App<br/>Card]
    ProjectsTab --> P2[Customer Portal<br/>Card]
    ProjectsTab --> P3[API Integration<br/>Card]
    
    P1 --> Overview[Projects Overview Page]
    P2 --> Overview
    P3 --> Overview
    
    Overview --> Tile1[Project A Tile<br/>Clickable]
    Overview --> Tile2[Project B Tile<br/>Clickable]
    Overview --> Tile3[Project C Tile<br/>Clickable]
    
    Tile1 --> Detail[Project Detail Page<br/>with Sidebar]
    Tile2 --> Detail
    Tile3 --> Detail
    
    Detail --> Sidebar[Left Navigation Pane]
    
    Sidebar --> Nav1[Main Page]
    Sidebar --> Nav2[Project Summary]
    Sidebar --> Nav3[Project Overview]
    Sidebar --> Nav4[Deliverables]
    Sidebar --> Nav5[Agenda]
    Sidebar --> Nav6[Prep]
    
    Nav1 --> Landing
    Nav2 --> SummaryPage[Project Summary Page]
    Nav3 --> Overview
    Nav4 --> DeliverPage[Deliverables Page]
    Nav5 --> AgendaPage[Agenda Page]
    Nav6 --> PrepPage[Prep Page]
    
    CalendarTab --> Meetings[Weekly Meetings]
    CalendarTab --> DailyActions[Today's Actions]
    CalendarTab --> Reminders[Active Reminders]
    
    DeliverablesTab --> Comms[Communications Hub]
    DeliverablesTab --> ProjActions[Project Actions<br/>Grouped by Project]
    
    style Landing fill:#e5f6ff
    style Overview fill:#d0e2ff
    style Detail fill:#a6c8ff
    style Sidebar fill:#78a9ff
```

## Component Hierarchy

```mermaid
graph TD
    App[App.tsx<br/>Router Provider] --> Router{React Router}
    
    Router --> Route1[/ Landing Page Route]
    Router --> Route2[/app/* Main App Routes]
    
    Route1 --> LandingPage[LandingPage Component]
    
    LandingPage --> UserSection[User Profile Section]
    LandingPage --> TabsComponent[Tabs Component]
    
    TabsComponent --> Tab1[Projects Tab Content]
    TabsComponent --> Tab2[Calendar Tab Content]
    TabsComponent --> Tab3[Deliverables Tab Content]
    
    Tab1 --> ProjectCards[3 Project Cards]
    Tab2 --> CalendarContent[Calendar Grid + Actions + Reminders]
    Tab3 --> DeliverContent[Communications + Actions by Project]
    
    Route2 --> MainLayout[MainAppLayout Component]
    
    MainLayout --> SidebarNav[Sidebar Navigation]
    MainLayout --> ContentOutlet[Router Outlet]
    
    ContentOutlet --> Page1[Projects Overview Page]
    ContentOutlet --> Page2[Project Detail Page]
    ContentOutlet --> Page3[Project Summary Page]
    ContentOutlet --> Page4[Deliverables Page]
    ContentOutlet --> Page5[Agenda Page]
    ContentOutlet --> Page6[Prep Page]
    
    Page1 --> ProjectTiles[3 Clickable Project Tiles]
    Page2 --> ExistingDash[Existing CommandCentre<br/>Actions, Blockers, etc.]
    
    style App fill:#f4f4f4
    style LandingPage fill:#e5f6ff
    style MainLayout fill:#d0e2ff
    style SidebarNav fill:#a6c8ff
```

## Data Flow Architecture

```mermaid
graph LR
    MockData[Mock Data Files] --> Context[App Context]
    
    MockData --> Projects[projects.json]
    MockData --> Actions[actions.json]
    MockData --> Blockers[blockers.json]
    MockData --> Comms[communications.json]
    MockData --> Reminders[reminders.json]
    MockData --> Meetings[meetings.json NEW]
    MockData --> Agenda[agenda.json NEW]
    
    Context --> State[Global State]
    
    State --> Landing[Landing Page]
    State --> Overview[Projects Overview]
    State --> Detail[Project Detail]
    State --> Other[Other Pages]
    
    Landing --> Display1[Display Projects]
    Landing --> Display2[Display Calendar]
    Landing --> Display3[Display Deliverables]
    
    Overview --> Display4[Display Project Tiles]
    Detail --> Display5[Display Full Dashboard]
    
    style MockData fill:#f4f4f4
    style Context fill:#e5f6ff
    style State fill:#d0e2ff
```

## Navigation State Machine

```mermaid
stateDiagram-v2
    [*] --> LandingPage: App Loads
    
    LandingPage --> ProjectsTab: View Projects
    LandingPage --> CalendarTab: View Calendar
    LandingPage --> DeliverablesTab: View Deliverables
    
    ProjectsTab --> ProjectsOverview: Click Project Card
    CalendarTab --> LandingPage: Switch Tab
    DeliverablesTab --> LandingPage: Switch Tab
    
    ProjectsOverview --> ProjectDetail: Click Project Tile
    
    ProjectDetail --> MainPage: Click Main Page Nav
    ProjectDetail --> ProjectSummary: Click Summary Nav
    ProjectDetail --> ProjectsOverview: Click Overview Nav
    ProjectDetail --> DeliverablesPage: Click Deliverables Nav
    ProjectDetail --> AgendaPage: Click Agenda Nav
    ProjectDetail --> PrepPage: Click Prep Nav
    
    MainPage --> LandingPage: Navigate Home
    ProjectSummary --> ProjectDetail: Back to Detail
    ProjectsOverview --> ProjectDetail: Select Project
    DeliverablesPage --> ProjectDetail: Back to Detail
    AgendaPage --> ProjectDetail: Back to Detail
    PrepPage --> ProjectDetail: Back to Detail
    
    note right of LandingPage
        No Sidebar Visible
    end note
    
    note right of ProjectDetail
        Sidebar Always Visible
    end note
```

## Page Layout Structure

### Landing Page Layout
```
┌─────────────────────────────────────────────────────────┐
│                    Header (Carbon)                       │
│              Kathy's Command Centre                      │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│                                                          │
│              ┌─────────────────────┐                    │
│              │                     │                    │
│              │   User Photo/Icon   │                    │
│              │   (Placeholder)     │                    │
│              │                     │                    │
│              └─────────────────────┘                    │
│                                                          │
│              Welcome, Kathy                              │
│                                                          │
└─────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────┐
│  ┌─────────┬─────────┬─────────┐                       │
│  │Projects │Calendar │Deliver. │  (Tabs)               │
│  └─────────┴─────────┴─────────┘                       │
│  ┌───────────────────────────────────────────────────┐ │
│  │                                                   │ │
│  │              Tab Content Area                     │ │
│  │                                                   │ │
│  │  - Projects: 3 Project Cards                     │ │
│  │  - Calendar: Meetings + Actions + Reminders      │ │
│  │  - Deliverables: Communications + Actions        │ │
│  │                                                   │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### Main App Layout (with Sidebar)
```
┌─────────────────────────────────────────────────────────┐
│                    Header (Carbon)                       │
└─────────────────────────────────────────────────────────┘
┌──────────────┬──────────────────────────────────────────┐
│              │                                          │
│   Sidebar    │         Content Area                     │
│   (256px)    │                                          │
│              │                                          │
│ ┌──────────┐ │  ┌────────────────────────────────┐    │
│ │Main Page │ │  │                                │    │
│ └──────────┘ │  │                                │    │
│ ┌──────────┐ │  │     Page Content               │    │
│ │Project   │ │  │     (Route-based)              │    │
│ │Summary   │ │  │                                │    │
│ └──────────┘ │  │                                │    │
│ ┌──────────┐ │  │                                │    │
│ │Project   │ │  │                                │    │
│ │Overview  │ │  │                                │    │
│ └──────────┘ │  └────────────────────────────────┘    │
│ ┌──────────┐ │                                          │
│ │Deliver.  │ │                                          │
│ └──────────┘ │                                          │
│ ┌──────────┐ │                                          │
│ │Agenda    │ │                                          │
│ └──────────┘ │                                          │
│ ┌──────────┐ │                                          │
│ │Prep      │ │                                          │
│ └──────────┘ │                                          │
│              │                                          │
└──────────────┴──────────────────────────────────────────┘
```

## Technology Stack

```mermaid
graph TB
    subgraph Frontend
        React[React 19]
        Router[React Router v6]
        Carbon[Carbon Design System]
        TypeScript[TypeScript]
        Sass[Sass/SCSS]
    end
    
    subgraph State
        Context[React Context API]
        Hooks[Custom Hooks]
    end
    
    subgraph Data
        JSON[Mock JSON Data]
        Types[TypeScript Interfaces]
    end
    
    subgraph Build
        Vite[Vite Build Tool]
    end
    
    React --> Router
    React --> Carbon
    React --> Context
    Context --> Hooks
    JSON --> Context
    Types --> Context
    TypeScript --> React
    Sass --> React
    Vite --> React
```

---

**Document Version**: 1.0  
**Created**: 2026-06-04  
**Purpose**: Visual architecture reference for implementation