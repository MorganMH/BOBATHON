export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar?: string;
}

export type ProjectStatus = 'on-track' | 'at-risk' | 'delayed';
export type ProjectHealth = 'green' | 'yellow' | 'red';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  health: ProjectHealth;
  progress: number; // 0-100
  startDate: string;
  endDate: string;
  team: TeamMember[];
  activeBlockers: number;
  pendingActions: number;
  lastUpdated: string;
  aiSummary?: string;
}

// Made with Bob
