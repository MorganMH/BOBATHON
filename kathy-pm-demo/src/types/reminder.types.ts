export type ReminderPriority = 'urgent' | 'high' | 'medium' | 'low';
export type ReminderStatus = 'pending' | 'sent' | 'responded' | 'dismissed';

export interface Reminder {
  id: string;
  projectId: string;
  title: string;
  description: string;
  targetPerson: string;
  targetEmail: string;
  dueDate: string;
  priority: ReminderPriority;
  status: ReminderStatus;
  suggestedMessage?: string;
  relatedActionId?: string;
  relatedBlockerId?: string;
  createdDate: string;
  lastSentDate?: string;
}

// Made with Bob
