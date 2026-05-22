import { Calendar, AlertTriangle, X } from "lucide-react";
import type { Task } from "../data";
import { PRIORITIES, STATUSES, TYPES, USERS } from "../data";

const PriorityBadge = ({ priority }: { priority: string }) => {
  const config = PRIORITIES[priority] || PRIORITIES.medium;
  const Icon = config.icon;

  return (
    <div
      className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium text-white ${config.color}`}
    >
      <Icon size={12} />
      <span>{config.label}</span>
    </div>
  );
};

const TypeIcon = ({ type }: { type: string }) => {
  const config = TYPES[type] || TYPES.task;
  const Icon = config.icon;

  return <Icon size={16} className={config.color.replace("bg-", "text-")} />;
};

const Avatar = ({ initials, color }: { initials: string; color: string }) => (
  <div
    className={`w-7 h-7 rounded-full ${color} flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow-sm`}
  >
    {initials}
  </div>
);

type TaskDetailModalProps = {
  task: Task | null;
  onClose: () => void;
};

const TaskDetailModal = ({ task, onClose }: TaskDetailModalProps) => {
  if (!task) return null;

  const assignee = USERS.find((user) => user.initials === task.assignee);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TypeIcon type={task.type} />
            <span className="text-slate-500 font-mono">{task.id}</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">{task.title}</h2>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase">
                Statut
              </label>
              <div className="mt-1 flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${task.status === "done" ? "bg-green-500" : task.status === "inprogress" ? "bg-blue-500" : "bg-slate-400"}`}
                />
                <span className="font-medium">{STATUSES[task.status].name}</span>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase">
                Priorité
              </label>
              <div className="mt-1">
                <PriorityBadge priority={task.priority} />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase">
                Assigné
              </label>
              <div className="mt-1 flex items-center gap-2">
                {assignee ? (
                  <>
                    <Avatar initials={assignee.initials} color={assignee.color} />
                    <span>{assignee.name}</span>
                  </>
                ) : (
                  "Non assigné"
                )}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase">
                Story Points
              </label>
              <div className="mt-1 font-medium">{task.storyPoints} points</div>
            </div>
          </div>

          <div className="mb-6">
            <label className="text-xs font-semibold text-slate-500 uppercase">
              Tags
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {task.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm border border-blue-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="text-xs font-semibold text-slate-500 uppercase">
              Description
            </label>
            <div className="mt-2 p-4 bg-slate-50 rounded-lg text-slate-700 text-sm leading-relaxed">
              Description de la tâche à compléter...
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <Calendar size={14} />
              <span>{task.dueDate || "Aucune échéance"}</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle size={14} />
              <span>{task.status}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;