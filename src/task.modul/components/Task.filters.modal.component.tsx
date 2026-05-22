import { X } from "lucide-react";
import type { User } from "../data";
import { PRIORITIES, USERS } from "../data";

type TaskFiltersModalProps = {
  isOpen: boolean;
  onClose: () => void;
  filterPriority: string;
  setFilterPriority: (value: string) => void;
  filterAssignee: string;
  setFilterAssignee: (value: string) => void;
};

const TaskFiltersModal = ({
  isOpen,
  onClose,
  filterPriority,
  setFilterPriority,
  filterAssignee,
  setFilterAssignee,
}: TaskFiltersModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-bold text-slate-900">Filters</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6 px-6 py-5">
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
              Priorité
            </h3>
            <div className="grid gap-2 sm:grid-cols-2">
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 px-3 py-2 hover:bg-slate-50">
                <input
                  type="radio"
                  name="priority"
                  checked={filterPriority === "all"}
                  onChange={() => setFilterPriority("all")}
                  className="h-4 w-4 accent-blue-600"
                />
                <span className="text-sm text-slate-700">Toutes priorités</span>
              </label>
              {Object.entries(PRIORITIES).map(([key, config]) => (
                <label
                  key={key}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 px-3 py-2 hover:bg-slate-50"
                >
                  <input
                    type="radio"
                    name="priority"
                    checked={filterPriority === key}
                    onChange={() => setFilterPriority(key)}
                    className="h-4 w-4 accent-blue-600"
                  />
                  <span className="text-sm text-slate-700">{config.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
              Assigné
            </h3>
            <div className="grid gap-2 sm:grid-cols-2">
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 px-3 py-2 hover:bg-slate-50">
                <input
                  type="radio"
                  name="assignee"
                  checked={filterAssignee === "all"}
                  onChange={() => setFilterAssignee("all")}
                  className="h-4 w-4 accent-blue-600"
                />
                <span className="text-sm text-slate-700">Tous assignés</span>
              </label>
              {USERS.map((user: User) => (
                <label
                  key={user.initials}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 px-3 py-2 hover:bg-slate-50"
                >
                  <input
                    type="radio"
                    name="assignee"
                    checked={filterAssignee === user.initials}
                    onChange={() => setFilterAssignee(user.initials)}
                    className="h-4 w-4 accent-blue-600"
                  />
                  <span className="text-sm text-slate-700">{user.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
          <button
            type="button"
            onClick={() => {
              setFilterPriority("all");
              setFilterAssignee("all");
            }}
            className="text-sm font-medium text-slate-500 hover:text-slate-700"
          >
            Réinitialiser
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskFiltersModal;