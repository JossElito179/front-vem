import { X } from "lucide-react";
import type { User } from "../data";
import { PRIORITIES, TYPES, USERS } from "../data";

type TaskCreateModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const TaskCreateModal = ({ isOpen, onClose }: TaskCreateModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Créer une tâche</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={24} />
          </button>
        </div>

        <form className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Titre
            </label>
            <input
              name="title"
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Type
              </label>
              <select
                name="type"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
              >
                {Object.keys(TYPES).map((type) => (
                  <option key={type} value={type}>
                    {TYPES[type].label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Priorité
              </label>
              <select
                name="priority"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
              >
                {Object.keys(PRIORITIES).map((priority) => (
                  <option key={priority} value={priority}>
                    {PRIORITIES[priority].label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Assigné
              </label>
              <select
                name="assignee"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
              >
                <option value="">Non assigné</option>
                {USERS.map((user: User) => (
                  <option key={user.initials} value={user.initials}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Story Points
              </label>
              <input
                name="storyPoints"
                type="number"
                min="0"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Date d'échéance
            </label>
            <input
              name="dueDate"
              type="date"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Tags (séparés par des virgules)
            </label>
            <input
              name="tags"
              placeholder="frontend, urgent, bugfix"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Créer la tâche
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskCreateModal;