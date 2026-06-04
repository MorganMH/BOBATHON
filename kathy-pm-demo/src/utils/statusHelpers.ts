import type { ProjectHealth, ProjectStatus, ActionStatus, ActionPriority, BlockerSeverity } from '../types';

export function getHealthColor(health: ProjectHealth): 'green' | 'warm-gray' | 'red' {
  const colorMap: Record<ProjectHealth, 'green' | 'warm-gray' | 'red'> = {
    green: 'green',
    yellow: 'warm-gray',
    red: 'red',
  };
  return colorMap[health];
}

export function getHealthLabel(health: ProjectHealth): string {
  const labels: Record<ProjectHealth, string> = {
    green: 'On Track',
    yellow: 'At Risk',
    red: 'Delayed',
  };
  return labels[health];
}

export function getStatusLabel(status: ProjectStatus): string {
  const labels: Record<ProjectStatus, string> = {
    'on-track': 'On Track',
    'at-risk': 'At Risk',
    'delayed': 'Delayed',
  };
  return labels[status];
}

export function getActionStatusLabel(status: ActionStatus): string {
  const labels: Record<ActionStatus, string> = {
    pending: 'Pending',
    'in-progress': 'In Progress',
    completed: 'Completed',
    overdue: 'Overdue',
  };
  return labels[status];
}

export function getActionStatusColor(status: ActionStatus): 'blue' | 'cyan' | 'green' | 'red' {
  const colors: Record<ActionStatus, 'blue' | 'cyan' | 'green' | 'red'> = {
    pending: 'blue',
    'in-progress': 'cyan',
    completed: 'green',
    overdue: 'red',
  };
  return colors[status];
}

export function getPriorityLabel(priority: ActionPriority): string {
  const labels: Record<ActionPriority, string> = {
    high: 'High',
    medium: 'Medium',
    low: 'Low',
  };
  return labels[priority];
}

export function getPriorityColor(priority: ActionPriority): 'red' | 'warm-gray' | 'blue' {
  const colors: Record<ActionPriority, 'red' | 'warm-gray' | 'blue'> = {
    high: 'red',
    medium: 'warm-gray',
    low: 'blue',
  };
  return colors[priority];
}

export function getSeverityLabel(severity: BlockerSeverity): string {
  const labels: Record<BlockerSeverity, string> = {
    critical: 'Critical',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
  };
  return labels[severity];
}

export function getSeverityColor(severity: BlockerSeverity): 'red' | 'magenta' | 'warm-gray' | 'blue' {
  const colors: Record<BlockerSeverity, 'red' | 'magenta' | 'warm-gray' | 'blue'> = {
    critical: 'red',
    high: 'magenta',
    medium: 'warm-gray',
    low: 'blue',
  };
  return colors[severity];
}

export function calculateProjectProgress(totalTasks: number, completedTasks: number): number {
  if (totalTasks === 0) return 0;
  return Math.round((completedTasks / totalTasks) * 100);
}

// Made with Bob
