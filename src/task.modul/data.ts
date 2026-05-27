import {
  AlertTriangle,
  ArrowUpDown,
  Circle,
  CheckCircle2,
  BookOpen,
  Layers
} from 'lucide-react';

// Types
export interface Task {
  id: string;
  title: string;
  type: string;
  priority: string;
  status: string;
  assignee: string | null;
  dueDate: string;
  tags: string[];
  storyPoints: number;
}

export interface User {
  initials: string;
  name: string;
  avatar?: string;
  color: string;
}

// Constants
export const PRIORITIES: Record<string, { color: string; label: string; icon: any }> = {
  highest: { color: 'bg-red-600', label: 'Highest', icon: AlertTriangle },
  high: { color: 'bg-red-500', label: 'High', icon: ArrowUpDown },
  medium: { color: 'bg-yellow-500', label: 'Medium', icon: Circle },
  low: { color: 'bg-green-500', label: 'Low', icon: ArrowUpDown },
  lowest: { color: 'bg-green-600', label: 'Lowest', icon: ArrowUpDown }
};

export const TYPES: Record<string, { color: string; label: string; icon: any }> = {
  bug: { color: 'bg-red-500', label: 'Bug', icon: AlertTriangle },
  task: { color: 'bg-blue-500', label: 'Task', icon: CheckCircle2 },
  story: { color: 'bg-green-500', label: 'Story', icon: BookOpen },
  epic: { color: 'bg-purple-500', label: 'Epic', icon: Layers }
};

export const STATUSES: Record<string, { id: string; name: string; limit: number | null }> = {
  backlog: { id: 'backlog', name: 'Backlog', limit: null },
  todo: { id: 'todo', name: 'À faire', limit: 10 },
  inprogress: { id: 'inprogress', name: 'En cours', limit: 5 },
  review: { id: 'review', name: 'Revue', limit: 4 },
  done: { id: 'done', name: 'Terminé', limit: null }
};

export const INITIAL_TASKS: Task[] = [
  { id: 'PROJ-101', title: 'Configurer CI/CD pipeline', type: 'task', priority: 'high', status: 'inprogress', assignee: 'JD', dueDate: '2026-05-25', tags: ['devops', 'urgent'], storyPoints: 5 },
  { id: 'PROJ-102', title: 'Bug login OAuth2', type: 'bug', priority: 'highest', status: 'todo', assignee: 'AL', dueDate: '2026-05-22', tags: ['auth', 'critical'], storyPoints: 3 },
  { id: 'PROJ-103', title: 'Refactor composant Table', type: 'task', priority: 'medium', status: 'review', assignee: 'MK', dueDate: '2026-05-28', tags: ['frontend'], storyPoints: 2 },
  { id: 'PROJ-104', title: 'API REST documentation', type: 'story', priority: 'low', status: 'backlog', assignee: null, dueDate: '2026-06-01', tags: ['docs'], storyPoints: 8 },
  { id: 'PROJ-105', title: 'Optimisation DB indexes', type: 'task', priority: 'high', status: 'inprogress', assignee: 'JD', dueDate: '2026-05-24', tags: ['backend', 'perf'], storyPoints: 5 },
  { id: 'PROJ-106', title: 'Feature dark mode', type: 'story', priority: 'medium', status: 'todo', assignee: 'AL', dueDate: '2026-05-30', tags: ['ui', 'ux'], storyPoints: 3 },
  { id: 'PROJ-107', title: 'Fix memory leak websocket', type: 'bug', priority: 'highest', status: 'inprogress', assignee: 'MK', dueDate: '2026-05-23', tags: ['backend', 'urgent'], storyPoints: 5 },
  { id: 'PROJ-108', title: 'Migration React 19', type: 'epic', priority: 'high', status: 'backlog', assignee: 'JD', dueDate: '2026-06-15', tags: ['migration'], storyPoints: 21 },
];

export const USERS: User[] = [
  { initials: 'JD', name: 'Jean Dupont', color: 'bg-blue-600', avatar: 'https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D' },
  { initials: 'AL', name: 'Alice Lefebvre', color: 'bg-green-600', avatar: 'https://www.shutterstock.com/image-photo/beauty-charisma-head-shot-portrait-600nw-2647728057.jpg' },
  { initials: 'MK', name: 'Marc Klein', color: 'bg-purple-600', avatar: 'https://www.perfocal.com/blog/content/images/size/w960/2021/01/Perfocal_17-11-2019_TYWFAQ_100_standard-3.jpg' },
];
