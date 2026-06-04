export interface Meeting {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  attendees: string[];
  projectId: string;
  location: string;
  type: 'standup' | 'planning' | 'review' | 'retrospective' | 'general';
}

export interface AgendaItem {
  id: string;
  meetingId: string;
  items: string[];
  notes?: string;
}

// Made with Bob
