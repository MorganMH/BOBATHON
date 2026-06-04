export type CommunicationType = 'email' | 'chat' | 'meeting';

export interface Communication {
  id: string;
  type: CommunicationType;
  projectId: string;
  subject: string;
  from: string;
  to: string[];
  date: string;
  content: string;
  extractedActions: string[]; // Action IDs
  aiSummary?: string;
  hasBlockers: boolean;
}

// Made with Bob
