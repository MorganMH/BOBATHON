export type Health = 'green' | 'yellow' | 'red';
export type ProjectStatus = 'on-track' | 'at-risk' | 'delayed';
export type CommitmentStatus = 'pending' | 'in_progress' | 'blocked' | 'done' | 'overdue';
export type Priority = 'high' | 'medium' | 'low';
export type Level = 'low' | 'medium' | 'high';
export type Availability = 'available' | 'busy' | 'on-leave';
export type CommType = 'email' | 'chat' | 'meeting';
export type Sentiment = 'positive' | 'neutral' | 'negative';

export interface PersonBrief {
    id: number;
    name: string;
    initials: string;
    role: string;
    team: string | null;
    avatar_color: string;
    reliability: number;
    availability: Availability;
}

export interface Person extends PersonBrief {
    email: string | null;
    phone: string | null;
    location: string | null;
    timezone: string | null;
    skills: string[];
    expertise: string | null;
    personal_notes: string | null;
    comms_preference: string | null;
    influence: Level;
    interest: Level;
    workload: number;
    last_contacted: string | null;
    open_commitments: number | null;
}

export interface ProjectBrief {
    id: number;
    name: string;
    code: string | null;
    health: Health;
}

export interface Project extends ProjectBrief {
    description: string | null;
    status: ProjectStatus;
    progress: number;
    start_date: string | null;
    end_date: string | null;
    end_label: string | null;
    stakeholders_count?: number;
    open_commitments_count?: number;
    team?: PersonBrief[];
}

export interface Commitment {
    id: number;
    title: string;
    description: string | null;
    due_date: string | null;
    due_label: string | null;
    status: CommitmentStatus;
    priority: Priority;
    direction: 'theirs' | 'mine';
    source_type: 'email' | 'chat' | 'meeting' | 'ado' | 'manual';
    source_ref: string | null;
    captured_by_ai: boolean;
    is_overdue: boolean;
    last_nudged: string | null;
    stakeholder: PersonBrief | null;
    project: ProjectBrief | null;
}

export interface Communication {
    id: number;
    type: CommType;
    subject: string;
    body: string;
    participants: string[];
    occurred_at: string | null;
    occurred_label: string | null;
    ai_summary: string | null;
    sentiment: Sentiment | null;
    has_action: boolean;
    has_blocker: boolean;
    is_unread: boolean;
    stakeholder: PersonBrief | null;
    project: ProjectBrief | null;
}

export interface Topic {
    id: number;
    title: string;
    summary: string;
    importance: Priority;
    source_type: 'email' | 'chat' | 'meeting' | 'mixed';
    mentions: number;
    participants: string[];
    last_mentioned: string | null;
    stakeholder: PersonBrief | null;
    project: ProjectBrief | null;
}

export interface Reminder {
    id: number;
    reason: string;
    draft_message: string | null;
    channel: 'email' | 'teams' | 'slack' | 'call';
    priority: Priority;
    status: 'suggested' | 'snoozed' | 'sent' | 'done';
    suggested_for: string | null;
    stakeholder: PersonBrief | null;
    project: ProjectBrief | null;
    commitment: { id: number; title: string } | null;
}

export interface Meeting {
    id: number;
    title: string;
    date: string;
    start_time: string;
    end_time: string;
    location: string | null;
    project_id: number | null;
    project?: ProjectBrief;
}

export interface SharedProps {
    currentUser: { name: string; role: string; initials: string };
    appName: string;
    voiceConfigured: boolean;
    flash: string | null;
    [key: string]: unknown;
}
