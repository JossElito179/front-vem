import { CheckCircle2, Clock, AlertTriangle, type LucideIcon } from 'lucide-react';

const STATUS_ICONS: Record<string, { icon: LucideIcon; className: string }> = {
  EN_COURS:  { icon: Clock,         className: 'text-blue-500 dark:text-blue-400'   },
  EN_RETARD: { icon: AlertTriangle, className: 'text-red-500 dark:text-red-400'     },
  TERMINE:   { icon: CheckCircle2,  className: 'text-green-500 dark:text-green-400' },
};

type TypeIconProps = {
  statut: string;
};

const TypeIcon = ({ statut }: TypeIconProps) => {
  const config = STATUS_ICONS[statut] ?? STATUS_ICONS.EN_COURS;
  const Icon = config.icon;
  return <Icon size={16} className={config.className} />;
};

export default TypeIcon;
