export type BlockerSeverity = 'critical' | 'high' | 'medium' | 'low';
export type BlockerStatus = 'active' | 'resolving' | 'resolved';

export interface Blocker {
  id: string;
  projectId: string;
  title: string;
  description: string;
  severity: BlockerSeverity;
  blockedBy: string; // Person or external factor
  affectedTasks: string[];
  identifiedDate: string;
  estimatedResolutionDate?: string;
  status: BlockerStatus;
  dependencies: string[]; // Other blocker IDs
  isNew?: boolean;
}

// Made with Bob
