import { PRIORITIES } from "../data";

type PriorityBadgeProps = {
  priority: string;
};

const PriorityBadge = ({ priority }: PriorityBadgeProps) => {
  const config = PRIORITIES[priority] ?? PRIORITIES.NORMALE;
  const Icon = config.icon;

  return (
    <div
      className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium text-white opacity-90 hover:opacity-100 transition-opacity ${config.color} dark:opacity-80`}
    >
      <Icon size={12} />
      <span>{config.label}</span>
    </div>
  );
};

export default PriorityBadge;
