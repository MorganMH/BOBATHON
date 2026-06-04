import { Grid, Column, Tile, StructuredListWrapper, StructuredListHead, StructuredListRow, StructuredListCell, StructuredListBody, Tag } from '@carbon/react';
import { useAppContext } from '../../context/AppContext';
import { formatDate } from '../../utils/dateHelpers';
import meetingsData from '../../data/meetings.json';
import type { Meeting } from '../../types/meeting.types';
import type { Action, Reminder } from '../../types';
import './CalendarTab.scss';

export default function CalendarTab() {
  const { state } = useAppContext();
  const meetings = meetingsData as Meeting[];
  
  // Get today's date
  const today = new Date().toISOString().split('T')[0];
  
  // Filter today's actions
  const todayActions = state.actions.filter((action: Action) => 
    action.dueDate === today && action.status !== 'completed'
  );
  
  // Get pending reminders
  const activeReminders = state.reminders.filter((reminder: Reminder) =>
    reminder.status === 'pending'
  );

  return (
    <div className="calendar-tab">
      <h2 className="tab-title">This Week's Schedule</h2>
      
      <Grid>
        <Column lg={10} md={5} sm={4}>
          <Tile className="calendar-section">
            <h3>Upcoming Meetings</h3>
            <StructuredListWrapper>
              <StructuredListHead>
                <StructuredListRow head>
                  <StructuredListCell head>Meeting</StructuredListCell>
                  <StructuredListCell head>Date & Time</StructuredListCell>
                  <StructuredListCell head>Type</StructuredListCell>
                </StructuredListRow>
              </StructuredListHead>
              <StructuredListBody>
                {meetings.map((meeting) => (
                  <StructuredListRow key={meeting.id}>
                    <StructuredListCell>
                      <strong>{meeting.title}</strong>
                      <br />
                      <small>{meeting.location}</small>
                    </StructuredListCell>
                    <StructuredListCell>
                      {formatDate(meeting.date)}
                      <br />
                      {meeting.startTime} - {meeting.endTime}
                    </StructuredListCell>
                    <StructuredListCell>
                      <Tag size="sm">{meeting.type}</Tag>
                    </StructuredListCell>
                  </StructuredListRow>
                ))}
              </StructuredListBody>
            </StructuredListWrapper>
          </Tile>
        </Column>

        <Column lg={6} md={3} sm={4}>
          <Tile className="calendar-section">
            <h3>Today's Actions</h3>
            {todayActions.length > 0 ? (
              <ul className="action-list">
                {todayActions.slice(0, 5).map((action: Action) => (
                  <li key={action.id}>
                    <Tag type={action.priority === 'high' ? 'red' : 'blue'} size="sm">
                      {action.priority}
                    </Tag>
                    <span>{action.title}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No actions due today</p>
            )}
          </Tile>

          <Tile className="calendar-section" style={{ marginTop: '1rem' }}>
            <h3>Active Reminders</h3>
            {activeReminders.length > 0 ? (
              <ul className="reminder-list">
                {activeReminders.slice(0, 5).map((reminder: Reminder) => (
                  <li key={reminder.id}>
                    <strong>{reminder.title}</strong>
                    <br />
                    <small>{reminder.description}</small>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No active reminders</p>
            )}
          </Tile>
        </Column>
      </Grid>
    </div>
  );
}

// Made with Bob