export type ActionStatus = 'pending' | 'in-progress' | 'completed' | 'overdue';
export type ActionPriority = 'high' | 'medium' | 'low';
export type SourceType = 'email' | 'chat' | 'meeting' | 'ado';
export type ExtractedBy = 'ai' | 'manual';

export interface ActionSource {
  type: SourceType;
  reference: string;
  extractedBy: ExtractedBy;
}

export interface Action {
  id: string;
  projectId: string;
  title: string;
  description: string;
  owner: string;
  dueDate: string;
  status: ActionStatus;
  priority: ActionPriority;
  source: ActionSource;
  createdDate: string;
  isNew?: boolean;
}

// Made with Bob
