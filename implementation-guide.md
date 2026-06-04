# Implementation Quick Reference Guide

## Getting Started

### Prerequisites
```bash
# Required software
- Node.js 18+ and npm
- Ollama installed locally
- Git
- Code editor (VS Code recommended)
```

### Initial Setup Commands
```bash
# Create project
npm create vite@latest kathy-pm-demo -- --template react-ts
cd kathy-pm-demo

# Install dependencies
npm install @carbon/react @carbon/icons-react
npm install -D @types/node

# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh
ollama pull llama2

# Start development
npm run dev
```

---

## Project Structure Quick Reference

```
src/
├── components/          # All React components
│   ├── Dashboard/      # Main dashboard components
│   ├── Projects/       # Project-related components
│   ├── Actions/        # Action tracking components
│   ├── Blockers/       # Blocker management components
│   ├── Reminders/      # Reminder system components
│   ├── Communications/ # Communication hub components
│   └── Common/         # Shared components
├── services/           # Business logic and API calls
├── data/              # Mock JSON data files
├── types/             # TypeScript type definitions
├── utils/             # Helper functions
├── App.tsx            # Main app component
└── main.tsx           # Entry point
```

---

## Key Carbon Components to Use

### Layout
```tsx
import { Grid, Column } from '@carbon/react';

<Grid>
  <Column lg={16} md={8} sm={4}>
    {/* Content */}
  </Column>
</Grid>
```

### Cards/Tiles
```tsx
import { Tile, ClickableTile } from '@carbon/react';

<Tile>
  <h4>Project Name</h4>
  <p>Description</p>
</Tile>
```

### Data Tables
```tsx
import { DataTable, Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from '@carbon/react';

<DataTable rows={rows} headers={headers}>
  {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
    <Table {...getTableProps()}>
      <TableHead>
        <TableRow>
          {headers.map(header => (
            <TableHeader {...getHeaderProps({ header })}>
              {header.header}
            </TableHeader>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map(row => (
          <TableRow {...getRowProps({ row })}>
            {row.cells.map(cell => (
              <TableCell key={cell.id}>{cell.value}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )}
</DataTable>
```

### Status Tags
```tsx
import { Tag } from '@carbon/react';

<Tag type="green">On Track</Tag>
<Tag type="yellow">At Risk</Tag>
<Tag type="red">Delayed</Tag>
```

### Buttons
```tsx
import { Button } from '@carbon/react';
import { Add } from '@carbon/icons-react';

<Button renderIcon={Add}>Add Action</Button>
```

### Modals
```tsx
import { Modal } from '@carbon/react';

<Modal
  open={isOpen}
  onRequestClose={() => setIsOpen(false)}
  modalHeading="Action Details"
  primaryButtonText="Save"
  secondaryButtonText="Cancel"
>
  {/* Modal content */}
</Modal>
```

---

## Mock Data Templates

### Project Data
```typescript
{
  "id": "proj-001",
  "name": "Business-Critical App Launch",
  "description": "Launch of customer-facing mobile application",
  "status": "at-risk",
  "health": "yellow",
  "progress": 65,
  "startDate": "2026-04-01",
  "endDate": "2026-07-15",
  "team": [
    {
      "id": "user-001",
      "name": "Sarah Chen",
      "role": "Lead Developer",
      "avatar": "/avatars/sarah.jpg"
    }
  ],
  "activeBlockers": 3,
  "pendingActions": 18,
  "lastUpdated": "2026-06-04T10:30:00Z"
}
```

### Action Data
```typescript
{
  "id": "act-001",
  "projectId": "proj-001",
  "title": "Complete API authentication module",
  "description": "Implement OAuth 2.0 authentication for API endpoints",
  "owner": "user-001",
  "dueDate": "2026-06-10",
  "status": "in-progress",
  "priority": "high",
  "source": {
    "type": "meeting",
    "reference": "Sprint Planning - June 3",
    "extractedBy": "ai"
  },
  "createdDate": "2026-06-03T14:00:00Z"
}
```

### Communication Data
```typescript
{
  "id": "comm-001",
  "type": "email",
  "projectId": "proj-001",
  "subject": "API Specs Update",
  "from": "tom.wilson@company.com",
  "to": ["sarah.chen@company.com", "kathy.manager@company.com"],
  "date": "2026-06-04T09:15:00Z",
  "content": "Hi team, I've updated the API specifications...",
  "extractedActions": ["act-001", "act-002"],
  "aiSummary": "Tom shared updated API specs and committed to completing authentication by June 10",
  "hasBlockers": false
}
```

---

## Ollama Integration Examples

### Service Setup
```typescript
// services/ollamaService.ts
const OLLAMA_API = 'http://localhost:11434/api/generate';

export async function generateCompletion(prompt: string): Promise<string> {
  const response = await fetch(OLLAMA_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama2',
      prompt: prompt,
      stream: false
    })
  });
  
  const data = await response.json();
  return data.response;
}
```

### Extract Actions
```typescript
export async function extractActions(text: string): Promise<Action[]> {
  const prompt = `Extract action items from this text. For each action, identify the task, owner, and due date. Format as JSON array.

Text: ${text}

Return only valid JSON array of actions with fields: title, owner, dueDate, priority.`;

  const response = await generateCompletion(prompt);
  
  try {
    return JSON.parse(response);
  } catch {
    // Fallback to mock data if parsing fails
    return [];
  }
}
```

### Generate Summary
```typescript
export async function generateSummary(communications: Communication[]): Promise<string> {
  const text = communications.map(c => c.content).join('\n\n');
  
  const prompt = `Summarize these project communications in 2-3 sentences, focusing on key decisions, commitments, and blockers:

${text}`;

  return await generateCompletion(prompt);
}
```

---

## State Management Pattern

### Context Setup
```typescript
// App.tsx or context file
interface AppState {
  projects: Project[];
  selectedProjectId: string | null;
  actions: Action[];
  blockers: Blocker[];
  loading: boolean;
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_PROJECTS':
      return { ...state, projects: action.payload };
    case 'SELECT_PROJECT':
      return { ...state, selectedProjectId: action.payload };
    case 'UPDATE_ACTION':
      return {
        ...state,
        actions: state.actions.map(a =>
          a.id === action.payload.id ? { ...a, ...action.payload.updates } : a
        )
      };
    default:
      return state;
  }
}
```

### Using Context
```typescript
function MyComponent() {
  const { state, dispatch } = useContext(AppContext);
  
  const handleProjectSelect = (projectId: string) => {
    dispatch({ type: 'SELECT_PROJECT', payload: projectId });
  };
  
  return (
    <div>
      {state.projects.map(project => (
        <ProjectCard
          key={project.id}
          project={project}
          onClick={() => handleProjectSelect(project.id)}
        />
      ))}
    </div>
  );
}
```

---

## Common Patterns

### Loading States
```tsx
import { Loading } from '@carbon/react';

{loading ? (
  <Loading description="Loading projects..." />
) : (
  <ProjectList projects={projects} />
)}
```

### Error Handling
```tsx
import { InlineNotification } from '@carbon/react';

{error && (
  <InlineNotification
    kind="error"
    title="Error"
    subtitle={error.message}
    onClose={() => setError(null)}
  />
)}
```

### Empty States
```tsx
import { Tile } from '@carbon/react';

{items.length === 0 ? (
  <Tile>
    <h4>No actions found</h4>
    <p>All caught up! No pending actions for this project.</p>
  </Tile>
) : (
  <ActionsList items={items} />
)}
```

---

## Styling Guidelines

### Carbon Theme
```tsx
// main.tsx or App.tsx
import '@carbon/react/scss/styles.scss';
```

### Custom Styles
```css
/* Use CSS modules or styled-components */
.command-centre {
  min-height: 100vh;
  background-color: var(--cds-background);
}

.project-card {
  margin-bottom: var(--cds-spacing-05);
  transition: transform 0.2s;
}

.project-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
```

### Carbon Design Tokens
```css
/* Spacing */
--cds-spacing-03: 0.5rem;
--cds-spacing-05: 1rem;
--cds-spacing-07: 1.5rem;

/* Colors */
--cds-background: #f4f4f4;
--cds-ui-01: #ffffff;
--cds-interactive-01: #0f62fe;
--cds-support-01: #da1e28; /* Error */
--cds-support-02: #24a148; /* Success */
--cds-support-03: #f1c21b; /* Warning */
```

---

## Testing Checklist

### Functional Testing
- [ ] All projects load correctly
- [ ] Project switching updates all panels
- [ ] Actions can be filtered and sorted
- [ ] Blockers display with correct severity
- [ ] Reminders show appropriate follow-ups
- [ ] Communications aggregate from all sources
- [ ] AI summaries generate successfully
- [ ] Modal dialogs open and close properly
- [ ] Navigation works between all views

### UI/UX Testing
- [ ] Responsive on desktop (1920x1080, 1366x768)
- [ ] Responsive on tablet (768x1024)
- [ ] All interactive elements have hover states
- [ ] Loading states display during data fetch
- [ ] Error states show helpful messages
- [ ] Empty states provide guidance
- [ ] Keyboard navigation works
- [ ] Screen reader announces changes

### Performance Testing
- [ ] Initial load < 2 seconds
- [ ] Project switching < 500ms
- [ ] AI responses < 3 seconds (with loading state)
- [ ] No memory leaks during navigation
- [ ] Smooth scrolling on long lists

---

## Demo Preparation

### Pre-Demo Checklist
- [ ] Ollama service running (`ollama serve`)
- [ ] Model loaded (`ollama pull llama2`)
- [ ] Development server started (`npm run dev`)
- [ ] Browser window sized appropriately
- [ ] Demo data loaded and verified
- [ ] All features tested and working
- [ ] Backup plan ready (pre-generated AI responses)

### Demo Flow
1. **Opening** (2 min): Show problem - scattered tools
2. **Dashboard** (2 min): Overview of command centre
3. **Actions** (2 min): Automated capture demonstration
4. **Blockers** (2 min): Dependency visualization
5. **AI Features** (2 min): Summary generation
6. **Impact** (2 min): Before/after comparison

### Backup Plans
- Pre-generated AI responses in case Ollama is slow
- Screenshots of key features if live demo fails
- Recorded video walkthrough as ultimate backup

---

## Troubleshooting

### Ollama Not Responding
```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Restart Ollama
ollama serve

# Test model
ollama run llama2 "Hello"
```

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf .vite
npm run dev
```

### Carbon Components Not Styling
```tsx
// Ensure SCSS is imported
import '@carbon/react/scss/styles.scss';

// Check theme is set
<Theme theme="white">
  <App />
</Theme>
```

---

## Quick Commands Reference

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run preview         # Preview production build

# Code Quality
npm run lint            # Run ESLint
npm run format          # Format with Prettier
npm run type-check      # TypeScript type checking

# Ollama
ollama serve            # Start Ollama service
ollama pull llama2      # Download model
ollama list             # List installed models
ollama run llama2       # Interactive chat
```

---

## Resources

### Documentation
- [Carbon Design System](https://carbondesignsystem.com/)
- [Carbon React Components](https://react.carbondesignsystem.com/)
- [Ollama Documentation](https://ollama.ai/docs)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

### Carbon Component Explorer
- [Storybook](https://react.carbondesignsystem.com/?path=/story/components-accordion--default)
- [Code Sandbox Examples](https://codesandbox.io/examples/package/@carbon/react)

### Design Resources
- [Carbon Design Kit (Figma)](https://www.figma.com/community/file/1157761560874207208)
- [Carbon Icons](https://carbondesignsystem.com/guidelines/icons/library/)
- [Color Palette](https://carbondesignsystem.com/guidelines/color/overview/)

---

## Next Steps After Planning

1. **Set up project** using commands above
2. **Create folder structure** as outlined
3. **Install dependencies** (Carbon, TypeScript types)
4. **Create mock data files** in `src/data/`
5. **Build layout components** (Header, Sidebar, Grid)
6. **Implement dashboard** with quick stats
7. **Add project cards** with health indicators
8. **Build action panel** with filtering
9. **Create blocker visualization**
10. **Integrate Ollama** for AI features
11. **Test all scenarios**
12. **Polish and optimize**
13. **Prepare demo script**

---

**Document Version**: 1.0  
**Last Updated**: 2026-06-04  
**For**: Development Team