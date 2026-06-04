import { StructuredListWrapper, StructuredListHead, StructuredListRow, StructuredListCell, StructuredListBody, Tag, Button } from '@carbon/react';
import { Email } from '@carbon/icons-react';
import { useProjectReminders } from '../../context/AppContext';
import { formatDueDate } from '../../utils/dateHelpers';
import type { Reminder } from '../../types';
import './RemindersPanel.scss';

export default function RemindersPanel() {
  const reminders = useProjectReminders();
  const pendingReminders = reminders.filter(r => r.status === 'pending');

  if (pendingReminders.length === 0) {
    return (
      <div className="empty-state">
        <p>No pending reminders. All caught up!</p>
      </div>
    );
  }

  return (
    <div className="reminders-panel">
      <StructuredListWrapper>
        <StructuredListHead>
          <StructuredListRow head>
            <StructuredListCell head>Reminder</StructuredListCell>
            <StructuredListCell head>Person</StructuredListCell>
            <StructuredListCell head>Due</StructuredListCell>
            <StructuredListCell head>Priority</StructuredListCell>
            <StructuredListCell head>Action</StructuredListCell>
          </StructuredListRow>
        </StructuredListHead>
        <StructuredListBody>
          {pendingReminders.map((reminder: Reminder) => (
            <StructuredListRow key={reminder.id}>
              <StructuredListCell>
                <div className="reminder-title">
                  <strong>{reminder.title}</strong>
                  <p className="reminder-description">{reminder.description}</p>
                  {reminder.suggestedMessage && (
                    <p className="suggested-message">
                      <em>Suggested: "{reminder.suggestedMessage.substring(0, 100)}..."</em>
                    </p>
                  )}
                </div>
              </StructuredListCell>
              <StructuredListCell>
                <div>
                  <div>{reminder.targetPerson}</div>
                  <div className="email-address">{reminder.targetEmail}</div>
                </div>
              </StructuredListCell>
              <StructuredListCell>{formatDueDate(reminder.dueDate)}</StructuredListCell>
              <StructuredListCell>
                <Tag
                  type={reminder.priority === 'urgent' ? 'red' : reminder.priority === 'high' ? 'magenta' : 'blue'}
                  size="sm"
                >
                  {reminder.priority.toUpperCase()}
                </Tag>
              </StructuredListCell>
              <StructuredListCell>
                <Button
                  kind="primary"
                  size="sm"
                  renderIcon={Email}
                >
                  Send
                </Button>
              </StructuredListCell>
            </StructuredListRow>
          ))}
        </StructuredListBody>
      </StructuredListWrapper>
    </div>
  );
}

// Made with Bob
