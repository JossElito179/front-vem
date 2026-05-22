import { AlertTriangle, Calendar, MoreHorizontal } from "lucide-react";
import type { DragEvent, MouseEvent as ReactMouseEvent } from "react";
import type { Task } from "../data";
import { USERS } from "../data";
import Avatar from "./task.avatar.component.tsx";
import PriorityBadge from "./task.priority-badge.component.tsx";
import TypeIcon from "./task.type-icon.component.tsx";

type TaskStatusId = "backlog" | "todo" | "inprogress" | "review" | "done";

const STATUS_MENU_ITEMS: Array<{ id: TaskStatusId; label: string }> = [
  { id: "todo", label: "À faire" },
  { id: "inprogress", label: "En cours" },
  { id: "review", label: "Revue" },
  { id: "done", label: "Terminé" },
];

type TaskViewCardProps = {
  task: Task;
  isDragging: boolean;
  onDragStart: (event: DragEvent<HTMLDivElement>, task: Task) => void;
  onOpenDetails: (task: Task) => void;
  isContextMenuOpen: boolean;
  contextMenuPosition: { x: number; y: number } | null;
  onOpenContextMenu: (taskId: string, x: number, y: number) => void;
  onCloseContextMenu: () => void;
  onMoveTask: (taskId: string, statusId: TaskStatusId) => void;
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
  onMoveTask,
}: TaskViewCardProps) => {
  const assignee = USERS.find((user) => user.initials === task.assignee);
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== "done";

  const handleContextMenu = (event: ReactMouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    onOpenContextMenu(task.id, event.clientX, event.clientY);
  };

  const handleMoveTask = (statusId: TaskStatusId) => {
    onMoveTask(task.id, statusId);
    onCloseContextMenu();
  };

  return (
    <div className="relative mb-3">
      <div
        draggable
        onDragStart={(event) => onDragStart(event, task)}
        onContextMenu={handleContextMenu}
        className={`bg-white rounded-lg p-3 shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-300 transition-all cursor-grab active:cursor-grabbing group ${isDragging ? "opacity-50 bg-slate-100" : ""}`}
      >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <TypeIcon type={task.type} />
          <span className="text-xs text-slate-500 font-mono">{task.id}</span>
        </div>
        <button
          onClick={() => onOpenDetails(task)}
          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-600"
        >
          <MoreHorizontal size={16} />
        </button>
      </div>

      <h4 className="text-sm font-semibold text-slate-800 mb-2 leading-snug">
        {task.title}
      </h4>

      <div className="flex flex-wrap gap-1 mb-3">
        {task.tags.map((tag: string) => (
          <span
            key={tag}
            className="px-1.5 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <PriorityBadge priority={task.priority} />
        </div>

        <div className="flex items-center gap-2">
          {task.storyPoints > 0 && (
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-1.5 rounded">
              {task.storyPoints}pt
            </span>
          )}
          {assignee ? (
            <Avatar initials={assignee.initials} color={assignee.color} />
          ) : (
            <div className="w-7 h-7 rounded-full bg-slate-200 border-2 border-dashed border-slate-400" />
          )}
        </div>
      </div>

      {task.dueDate && (
        <div
          className={`flex items-center gap-1 mt-2 text-xs ${isOverdue ? "text-red-500" : "text-slate-500"}`}
        >
          <Calendar size={12} />
          <span>{task.dueDate}</span>
          {isOverdue && <AlertTriangle size={12} />}
        </div>
      )}
      </div>

      {isContextMenuOpen && contextMenuPosition && (
        <div
          className="fixed z-50 min-w-40 rounded-lg border border-slate-200 bg-white py-1 shadow-xl"
          style={{ left: contextMenuPosition.x, top: contextMenuPosition.y }}
          onClick={(event) => event.stopPropagation()}
        >
          {STATUS_MENU_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleMoveTask(item.id)}
              className="flex w-full items-center px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
            >
              {`--> ` + item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskViewCard;