import { Tile, StructuredListWrapper, StructuredListHead, StructuredListRow, StructuredListCell, StructuredListBody, Tag } from '@carbon/react';
import { formatDate } from '../../utils/dateHelpers';
import meetingsData from '../../data/meetings.json';
import type { Meeting } from '../../types/meeting.types';

export default function AgendaPage() {
  const meetings = meetingsData as Meeting[];

  return (
    <div className="agenda-page">
      <h1>Agenda</h1>
      <p className="page-subtitle">Meeting agendas and schedules</p>
      
      <Tile>
        <h3 style={{ marginBottom: '1rem' }}>Upcoming Meetings</h3>
        <StructuredListWrapper>
          <StructuredListHead>
            <StructuredListRow head>
              <StructuredListCell head>Meeting</StructuredListCell>
              <StructuredListCell head>Date & Time</StructuredListCell>
              <StructuredListCell head>Location</StructuredListCell>
              <StructuredListCell head>Type</StructuredListCell>
            </StructuredListRow>
          </StructuredListHead>
          <StructuredListBody>
            {meetings.map((meeting) => (
              <StructuredListRow key={meeting.id}>
                <StructuredListCell>
                  <strong>{meeting.title}</strong>
                  <br />
                  <small style={{ color: 'var(--cds-text-secondary)' }}>
                    {meeting.attendees.join(', ')}
                  </small>
                </StructuredListCell>
                <StructuredListCell>
                  {formatDate(meeting.date)}
                  <br />
                  {meeting.startTime} - {meeting.endTime}
                </StructuredListCell>
                <StructuredListCell>{meeting.location}</StructuredListCell>
                <StructuredListCell>
                  <Tag size="sm">{meeting.type}</Tag>
                </StructuredListCell>
              </StructuredListRow>
            ))}
          </StructuredListBody>
        </StructuredListWrapper>
      </Tile>
    </div>
  );
}

// Made with Bob