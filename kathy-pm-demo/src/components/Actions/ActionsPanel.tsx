import { DataTable, Table, TableHead, TableRow, TableHeader, TableBody, TableCell, Tag, Button, TableToolbar, TableToolbarContent, TableToolbarSearch } from '@carbon/react';
import { Email, Chat, Events, Document } from '@carbon/icons-react';
import { useProjectActions } from '../../context/AppContext';
import { getActionStatusColor, getActionStatusLabel, getPriorityColor, getPriorityLabel } from '../../utils/statusHelpers';
import { formatDueDate } from '../../utils/dateHelpers';
import type { Action, SourceType } from '../../types';
import './ActionsPanel.scss';

const getSourceIcon = (type: SourceType) => {
  const icons = {
    email: Email,
    chat: Chat,
    meeting: Events,
    ado: Document,
  };
  const Icon = icons[type];
  return <Icon size={16} />;
};

export default function ActionsPanel() {
  const actions = useProjectActions();

  const headers = [
    { key: 'title', header: 'Action Item' },
    { key: 'owner', header: 'Owner' },
    { key: 'dueDate', header: 'Due Date' },
    { key: 'priority', header: 'Priority' },
    { key: 'status', header: 'Status' },
    { key: 'source', header: 'Source' },
  ];

  const rows = actions.map((action: Action) => ({
    id: action.id,
    title: action.title,
    owner: action.owner,
    dueDate: formatDueDate(action.dueDate),
    priority: action.priority,
    status: action.status,
    source: action.source.type,
    extractedBy: action.source.extractedBy,
    isNew: action.isNew,
  }));

  return (
    <div className="actions-panel">
      <DataTable rows={rows} headers={headers}>
        {({ rows, headers, getTableProps, getHeaderProps, getRowProps, getTableContainerProps }) => (
          <div {...getTableContainerProps()}>
            <TableToolbar>
              <TableToolbarContent>
                <TableToolbarSearch placeholder="Search actions..." />
              </TableToolbarContent>
            </TableToolbar>
            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
                  {headers.map((header) => (
                    <TableHeader {...getHeaderProps({ header })} key={header.key}>
                      {header.header}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => {
                  const action = actions.find(a => a.id === row.id);
                  return (
                    <TableRow
                      {...getRowProps({ row })}
                      key={row.id}
                      className={action?.isNew ? 'new-item-highlight' : ''}
                      data-action-id={row.id}
                    >
                      <TableCell>
                        <div className="action-title">
                          {row.cells.find(c => c.info.header === 'title')?.value}
                          {action?.isNew && <span className="new-badge">NEW</span>}
                          {action?.source.extractedBy === 'ai' && (
                            <span className="ai-badge">AI</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{row.cells.find(c => c.info.header === 'owner')?.value}</TableCell>
                      <TableCell>{row.cells.find(c => c.info.header === 'dueDate')?.value}</TableCell>
                      <TableCell>
                        <Tag type={getPriorityColor(action?.priority || 'medium')} size="sm">
                          {getPriorityLabel(action?.priority || 'medium')}
                        </Tag>
                      </TableCell>
                      <TableCell>
                        <Tag type={getActionStatusColor(action?.status || 'pending')} size="sm">
                          {getActionStatusLabel(action?.status || 'pending')}
                        </Tag>
                      </TableCell>
                      <TableCell>
                        <div className="source-cell">
                          {getSourceIcon(action?.source.type || 'email')}
                          <span>{action?.source.reference}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </DataTable>

      {actions.length === 0 && (
        <div className="empty-state">
          <p>No actions found for this project.</p>
        </div>
      )}
    </div>
  );
}

// Made with Bob
