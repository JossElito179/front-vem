import { TYPES } from "../data";

type TypeIconProps = {
  type: string;
};

const TypeIcon = ({ type }: TypeIconProps) => {
  const config = TYPES[type] || TYPES.task;
  const Icon = config.icon;

  return <Icon size={16} className={config.color.replace("bg-", "text-")} />;
};

export default TypeIcon;