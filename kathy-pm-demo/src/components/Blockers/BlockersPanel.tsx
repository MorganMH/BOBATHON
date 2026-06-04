import { Accordion, AccordionItem, Tag } from '@carbon/react';
import { useProjectBlockers } from '../../context/AppContext';
import { getSeverityColor, getSeverityLabel } from '../../utils/statusHelpers';
import { formatDate } from '../../utils/dateHelpers';
import type { Blocker } from '../../types';
import './BlockersPanel.scss';

export default function BlockersPanel() {
  const blockers = useProjectBlockers();
  const activeBlockers = blockers.filter(b => b.status === 'active');

  if (activeBlockers.length === 0) {
    return (
      <div className="empty-state">
        <p>No active blockers for this project. Great work!</p>
      </div>
    );
  }

  return (
    <div className="blockers-panel">
      <Accordion>
        {activeBlockers.map((blocker: Blocker) => (
          <AccordionItem
            key={blocker.id}
            title={
              <div className="blocker-title">
                <span>{blocker.title}</span>
                <Tag type={getSeverityColor(blocker.severity)} size="sm">
                  {getSeverityLabel(blocker.severity)}
                </Tag>
                {blocker.isNew && <span className="new-badge">NEW</span>}
              </div>
            }
          >
            <div className="blocker-details">
              <p><strong>Description:</strong> {blocker.description}</p>
              <p><strong>Blocked By:</strong> {blocker.blockedBy}</p>
              <p><strong>Affected Tasks:</strong> {blocker.affectedTasks.join(', ')}</p>
              <p><strong>Identified:</strong> {formatDate(blocker.identifiedDate)}</p>
              {blocker.estimatedResolutionDate && (
                <p><strong>Est. Resolution:</strong> {formatDate(blocker.estimatedResolutionDate)}</p>
              )}
            </div>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

// Made with Bob
