import { Calendar, MoreHorizontal } from "lucide-react";
import type { DragEvent, MouseEvent as ReactMouseEvent } from "react";
import type { ApiTask } from "../task.service";
import { getAvatarColor, getInitials } from "../data";
import Avatar from "./task.avatar.component";
import PriorityBadge from "./task.priority-badge.component";
import TypeIcon from "./task.type-icon.component";

type TaskViewCardProps = {
  task: ApiTask;
  isDragging: boolean;
  onDragStart: (event: DragEvent<HTMLDivElement>, task: ApiTask) => void;
  onOpenDetails: (task: ApiTask) => void;
  isContextMenuOpen: boolean;
  contextMenuPosition: { x: number; y: number } | null;
  onOpenContextMenu: (taskId: number, x: number, y: number) => void;
  onCloseContextMenu: () => void;
  onCompleteTask: (taskId: number) => void;
};

const TaskViewCard = ({
  task,
  isDragging,
  onDragStart,
  onOpenDetails,
  isContextMenuOpen,
  contextMenuPosition,
  onOpenContextMenu,
  onCloseContextMenu,
  onCompleteTask,
}: TaskViewCardProps) => {
  const isOverdue = task.statut === 'EN_RETARD';
  const isCompleted = task.statut === 'TERMINE';

  const initials = task.assigne
    ? getInitials(task.assigne.nom, task.assigne.prenom)
    : '?';
  const avatarColor = task.assigne ? getAvatarColor(task.assigne.id) : 'bg-slate-400';

  const handleContextMenu = (event: ReactMouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!isCompleted) onOpenContextMenu(task.id, event.clientX, event.clientY);
  };

  return (
    <div className="relative mb-3">
      <div
        draggable={!isCompleted}
        onDragStart={(event) => onDragStart(event, task)}
        onContextMenu={handleContextMenu}
        className={`bg-white dark:bg-gray-700 rounded-lg p-3 shadow-sm border border-slate-200 dark:border-gray-500 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500 transition-all cursor-grab active:cursor-grabbing group ${isDragging ? "opacity-50" : ""}`}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <TypeIcon statut={task.statut} />
            <span className="text-xs text-slate-500 dark:text-gray-400 font-mono">#{task.id}</span>
          </div>
          <button
            onClick={() => onOpenDetails(task)}
            className="opacity-0 group-hover:opacity-100 text-slate-400 dark:text-gray-600 hover:text-slate-600 dark:hover:text-gray-400"
          >
            <MoreHorizontal size={16} />
          </button>
        </div>

        <h4 className="text-sm font-semibold text-slate-800 dark:text-white mb-3 leading-snug">
          {task.titre}
        </h4>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-gray-700">
          <PriorityBadge priority={task.priorite} />
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500 dark:text-gray-400 bg-slate-100 dark:bg-gray-600 px-1.5 rounded">
              {task.poids}pt
            </span>
            <Avatar initials={initials} color={avatarColor} />
          </div>
        </div>

        {task.dateLimite && (
          <div
            className={`flex items-center gap-1 mt-2 text-xs ${isOverdue ? "text-red-500" : "text-slate-500 dark:text-gray-400"}`}
          >
            <Calendar size={12} />
            <span>{task.dateLimite}</span>
          </div>
        )}
      </div>

      {isContextMenuOpen && contextMenuPosition && (
        <div
          className="fixed z-50 min-w-44 rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-1 shadow-xl"
          style={{ left: contextMenuPosition.x, top: contextMenuPosition.y }}
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => { onCompleteTask(task.id); onCloseContextMenu(); }}
            className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-green-700 dark:text-green-400 hover:bg-slate-100 dark:hover:bg-gray-700"
          >
            ✓ Marquer comme terminé
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskViewCard;
