import { AlertTriangle, Circle, ArrowDown, type LucideIcon } from 'lucide-react';

export const PRIORITIES: Record<string, { color: string; label: string; icon: LucideIcon }> = {
  BASSE:   { color: 'bg-green-500',  label: 'Basse',   icon: ArrowDown     },
  NORMALE: { color: 'bg-yellow-500', label: 'Normale', icon: Circle        },
  HAUTE:   { color: 'bg-red-500',    label: 'Haute',   icon: AlertTriangle },
};

export const STATUSES: Record<string, { id: string; name: string }> = {
  EN_COURS:  { id: 'EN_COURS',  name: 'En cours'  },
  EN_RETARD: { id: 'EN_RETARD', name: 'En retard' },
  TERMINE:   { id: 'TERMINE',   name: 'Terminé'   },
};

const AVATAR_COLORS = [
  'bg-blue-600',
  'bg-green-600',
  'bg-purple-600',
  'bg-red-600',
  'bg-orange-500',
  'bg-teal-600',
];

export function getAvatarColor(userId: number): string {
  return AVATAR_COLORS[userId % AVATAR_COLORS.length];
}

export function getInitials(nom: string, prenom: string): string {
  return `${nom.charAt(0)}${prenom.charAt(0)}`.toUpperCase();
}
