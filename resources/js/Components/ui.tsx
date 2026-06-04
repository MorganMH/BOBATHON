import type { ComponentType, ReactNode } from 'react';
import { Tag, Tile } from '@carbon/react';
import { Email, Chat, Events } from '@carbon/icons-react';
import type {
    Availability,
    CommitmentStatus,
    CommType,
    Health,
    Level,
    PersonBrief,
    Priority,
    Sentiment,
} from '@/types';

export function Avatar({ person, size }: { person: Pick<PersonBrief, 'initials' | 'avatar_color' | 'name'>; size?: 'lg' }) {
    return (
        <span
            className={`cc-avatar${size === 'lg' ? ' cc-avatar--lg' : ''}`}
            style={{ background: person.avatar_color }}
            title={person.name}
            aria-hidden="true"
        >
            {person.initials}
        </span>
    );
}

const HEALTH_LABEL: Record<Health, string> = { green: 'On track', yellow: 'At risk', red: 'Delayed' };

export function HealthTag({ health, label }: { health: Health; label?: string }) {
    return (
        <span className="cc-row" style={{ gap: '0.4rem' }}>
            <span className={`cc-dot cc-dot--${health}`} />
            <span>{label ?? HEALTH_LABEL[health]}</span>
        </span>
    );
}

const STATUS: Record<CommitmentStatus, { type: string; label: string }> = {
    pending: { type: 'gray', label: 'Pending' },
    in_progress: { type: 'blue', label: 'In progress' },
    blocked: { type: 'red', label: 'Blocked' },
    overdue: { type: 'red', label: 'Overdue' },
    done: { type: 'green', label: 'Done' },
};

export function StatusTag({ status }: { status: CommitmentStatus }) {
    const s = STATUS[status];
    return <Tag type={s.type as never} size="sm">{s.label}</Tag>;
}

const PRIORITY: Record<Priority, string> = { high: 'red', medium: 'teal', low: 'gray' };

export function PriorityTag({ priority }: { priority: Priority }) {
    return <Tag type={PRIORITY[priority] as never} size="sm">{priority[0].toUpperCase() + priority.slice(1)}</Tag>;
}

const LEVEL: Record<Level, string> = { high: 'purple', medium: 'blue', low: 'cool-gray' };

export function LevelTag({ level, suffix }: { level: Level; suffix: string }) {
    return <Tag type={LEVEL[level] as never} size="sm">{`${level[0].toUpperCase()}${level.slice(1)} ${suffix}`}</Tag>;
}

const AVAIL: Record<Availability, { type: string; label: string }> = {
    available: { type: 'green', label: 'Available' },
    busy: { type: 'warm-gray', label: 'Busy' },
    'on-leave': { type: 'red', label: 'On leave' },
};

export function AvailabilityTag({ availability }: { availability: Availability }) {
    const a = AVAIL[availability];
    return <Tag type={a.type as never} size="sm">{a.label}</Tag>;
}

const SENTIMENT: Record<Sentiment, string> = { positive: 'green', neutral: 'gray', negative: 'red' };

export function SentimentTag({ sentiment }: { sentiment: Sentiment }) {
    return <Tag type={SENTIMENT[sentiment] as never} size="sm">{sentiment}</Tag>;
}

const COMM_ICON: Record<CommType, ComponentType<{ size?: number }>> = {
    email: Email,
    chat: Chat,
    meeting: Events,
};

export function SourceIcon({ type, size = 16 }: { type: CommType; size?: number }) {
    const Icon = COMM_ICON[type];
    return <Icon size={size} />;
}

export function Meter({ value, color }: { value: number; color?: string }) {
    return (
        <div className="cc-meter" title={`${value}%`}>
            <span style={{ width: `${Math.max(0, Math.min(100, value))}%`, background: color }} />
        </div>
    );
}

export function StatTile({
    label,
    value,
    sub,
    accent,
}: {
    label: string;
    value: ReactNode;
    sub?: ReactNode;
    accent?: string;
}) {
    return (
        <Tile className="cc-stat">
            <div className="cc-stat__value" style={accent ? { color: accent } : undefined}>
                {value}
            </div>
            <div className="cc-stat__label">{label}</div>
            {sub ? <div className="cc-stat__sub cc-muted">{sub}</div> : null}
        </Tile>
    );
}

export function SectionTitle({ title, action }: { title: string; action?: ReactNode }) {
    return (
        <div className="cc-section__title">
            <h2>{title}</h2>
            {action}
        </div>
    );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
    return (
        <div className="cc-page-header cc-spread">
            <div>
                <h1>{title}</h1>
                {subtitle ? <p>{subtitle}</p> : null}
            </div>
            {action}
        </div>
    );
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
    return (
        <Tile>
            <h4 style={{ fontWeight: 400, marginBottom: '0.25rem' }}>{title}</h4>
            {children ? <p className="cc-muted">{children}</p> : null}
        </Tile>
    );
}
