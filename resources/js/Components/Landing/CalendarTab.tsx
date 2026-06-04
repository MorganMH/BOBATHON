import { Grid, Column, Tile, StructuredListWrapper, StructuredListHead, StructuredListRow, StructuredListCell, StructuredListBody, Tag } from '@carbon/react';
import { PriorityTag } from '@/Components/ui';
import type { Meeting, Commitment, Reminder } from '@/types';

interface CalendarTabProps {
    meetings: Meeting[];
    actions: Commitment[];
    reminders: Reminder[];
}

export default function CalendarTab({ meetings, actions, reminders }: CalendarTabProps) {
    // Get today's date
    const today = new Date().toISOString().split('T')[0];
    
    // Filter today's actions
    const todayActions = actions.filter((action) =>
        action.due_date === today && action.status !== 'done'
    ).slice(0, 5);
    
    // Get active reminders (suggested or snoozed)
    const activeReminders = reminders.filter((reminder) =>
        reminder.status === 'suggested' || reminder.status === 'snoozed'
    ).slice(0, 5);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    return (
        <div className="calendar-tab">
            <h2 className="tab-title">This Week's Schedule</h2>
            
            <Grid>
                <Column lg={10} md={5} sm={4}>
                    <Tile className="calendar-section">
                        <h3 className="calendar-section-title">Upcoming Meetings</h3>
                        <StructuredListWrapper>
                            <StructuredListHead>
                                <StructuredListRow head>
                                    <StructuredListCell head>Meeting</StructuredListCell>
                                    <StructuredListCell head>Date & Time</StructuredListCell>
                                    <StructuredListCell head>Location</StructuredListCell>
                                </StructuredListRow>
                            </StructuredListHead>
                            <StructuredListBody>
                                {meetings.slice(0, 5).map((meeting) => (
                                    <StructuredListRow key={meeting.id}>
                                        <StructuredListCell>
                                            <strong>{meeting.title}</strong>
                                        </StructuredListCell>
                                        <StructuredListCell>
                                            {formatDate(meeting.date)}
                                            <br />
                                            {meeting.start_time} - {meeting.end_time}
                                        </StructuredListCell>
                                        <StructuredListCell>
                                            {meeting.location || 'TBD'}
                                        </StructuredListCell>
                                    </StructuredListRow>
                                ))}
                            </StructuredListBody>
                        </StructuredListWrapper>
                    </Tile>
                </Column>

                <Column lg={6} md={3} sm={4}>
                    <Tile className="calendar-section">
                        <h3 className="calendar-section-title">Today's Actions</h3>
                        {todayActions.length > 0 ? (
                            <div className="cc-stack">
                                {todayActions.map((action) => (
                                    <div key={action.id} className="cc-row">
                                        <PriorityTag priority={action.priority || 'medium'} />
                                        <span>{action.title}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="cc-muted">No actions due today</p>
                        )}
                    </Tile>

                    <Tile className="calendar-section" style={{ marginTop: '1rem' }}>
                        <h3 className="calendar-section-title">Active Reminders</h3>
                        {activeReminders.length > 0 ? (
                            <div className="cc-stack">
                                {activeReminders.map((reminder) => (
                                    <div key={reminder.id}>
                                        <strong>{reminder.reason}</strong>
                                        <br />
                                        <small className="cc-muted">
                                            {reminder.stakeholder?.name} · {reminder.channel}
                                        </small>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="cc-muted">No active reminders</p>
                        )}
                    </Tile>
                </Column>
            </Grid>
        </div>
    );
}

// Made with Bob
