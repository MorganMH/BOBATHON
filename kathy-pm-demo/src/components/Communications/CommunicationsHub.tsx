import { Tabs, TabList, Tab, TabPanels, TabPanel, Tile, Tag } from '@carbon/react';
import { Email, Chat, Events } from '@carbon/icons-react';
import { useProjectCommunications } from '../../context/AppContext';
import { formatDateTime } from '../../utils/dateHelpers';
import type { Communication } from '../../types';
import './CommunicationsHub.scss';

export default function CommunicationsHub() {
  const communications = useProjectCommunications();
  
  const emails = communications.filter(c => c.type === 'email');
  const chats = communications.filter(c => c.type === 'chat');
  const meetings = communications.filter(c => c.type === 'meeting');

  return (
    <div className="communications-hub">
      <Tabs>
        <TabList aria-label="Communication types">
          <Tab renderIcon={Email}>Emails ({emails.length})</Tab>
          <Tab renderIcon={Chat}>Chats ({chats.length})</Tab>
          <Tab renderIcon={Events}>Meetings ({meetings.length})</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <CommunicationList communications={emails} />
          </TabPanel>
          <TabPanel>
            <CommunicationList communications={chats} />
          </TabPanel>
          <TabPanel>
            <CommunicationList communications={meetings} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}

function CommunicationList({ communications }: { communications: Communication[] }) {
  if (communications.length === 0) {
    return (
      <div className="empty-state">
        <p>No communications of this type.</p>
      </div>
    );
  }

  return (
    <div className="communication-list">
      {communications.map((comm: Communication) => (
        <Tile key={comm.id} className="communication-item">
          <div className="comm-header">
            <div>
              <h4>{comm.subject}</h4>
              <p className="comm-meta">
                From: {comm.from} • {formatDateTime(comm.date)}
              </p>
            </div>
            <div className="comm-tags">
              {comm.extractedActions.length > 0 && (
                <Tag type="blue" size="sm">
                  {comm.extractedActions.length} Actions
                </Tag>
              )}
              {comm.hasBlockers && (
                <Tag type="red" size="sm">
                  Blockers
                </Tag>
              )}
            </div>
          </div>

          {comm.aiSummary && (
            <div className="ai-summary">
              <strong>AI Summary:</strong> {comm.aiSummary}
            </div>
          )}

          <div className="comm-content">
            {comm.content.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </Tile>
      ))}
    </div>
  );
}

// Made with Bob
