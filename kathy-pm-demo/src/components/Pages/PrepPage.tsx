import { Tile, Accordion, AccordionItem } from '@carbon/react';
import meetingsData from '../../data/meetings.json';
import type { Meeting } from '../../types/meeting.types';

export default function PrepPage() {
  const meetings = meetingsData as Meeting[];
  const upcomingMeetings = meetings.slice(0, 3); // Show next 3 meetings

  return (
    <div className="prep-page">
      <h1>Meeting Prep</h1>
      <p className="page-subtitle">Preparation materials for upcoming meetings</p>
      
      <Tile>
        <h3 style={{ marginBottom: '1rem' }}>Upcoming Meetings Preparation</h3>
        <Accordion>
          {upcomingMeetings.map((meeting) => (
            <AccordionItem key={meeting.id} title={`${meeting.title} - ${meeting.date}`}>
              <div style={{ padding: '1rem 0' }}>
                <h4 style={{ marginBottom: '0.5rem' }}>Meeting Details</h4>
                <ul style={{ marginBottom: '1rem', lineHeight: '1.8' }}>
                  <li><strong>Time:</strong> {meeting.startTime} - {meeting.endTime}</li>
                  <li><strong>Location:</strong> {meeting.location}</li>
                  <li><strong>Attendees:</strong> {meeting.attendees.join(', ')}</li>
                  <li><strong>Type:</strong> {meeting.type}</li>
                </ul>

                <h4 style={{ marginBottom: '0.5rem' }}>Preparation Checklist</h4>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <li style={{ padding: '0.5rem 0' }}>☐ Review previous meeting notes</li>
                  <li style={{ padding: '0.5rem 0' }}>☐ Prepare status update</li>
                  <li style={{ padding: '0.5rem 0' }}>☐ Gather relevant documents</li>
                  <li style={{ padding: '0.5rem 0' }}>☐ Review action items</li>
                  <li style={{ padding: '0.5rem 0' }}>☐ Prepare questions or concerns</li>
                </ul>

                <h4 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Key Topics</h4>
                <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)' }}>
                  {meeting.type === 'standup' && 'Daily progress updates, blockers, and plans for the day'}
                  {meeting.type === 'planning' && 'Sprint goals, task assignments, and timeline planning'}
                  {meeting.type === 'review' && 'Demo completed work, gather feedback, and discuss improvements'}
                  {meeting.type === 'general' && 'General project discussion and updates'}
                </p>
              </div>
            </AccordionItem>
          ))}
        </Accordion>
      </Tile>
    </div>
  );
}

// Made with Bob