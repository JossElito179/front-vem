type AvatarProps = {
  initials: string;
  color: string;
};

const Avatar = ({ initials, color }: AvatarProps) => (
  <div
    className={`w-7 h-7 rounded-full ${color} flex items-center justify-center text-white text-xs font-bold border-2 border-white dark:border-gray-700 shadow-sm`}
  >
    {initials}
  </div>
);

export default Avatar;