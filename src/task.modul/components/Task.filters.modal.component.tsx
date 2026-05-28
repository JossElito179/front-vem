import { X } from "lucide-react";
import { PRIORITIES, STATUSES } from "../data";

type TaskFiltersModalProps = {
  isOpen: boolean;
  onClose: () => void;
  filterPriority: string;
  setFilterPriority: (value: string) => void;
  filterStatus: string;
  setFilterStatus: (value: string) => void;
};

const TaskFiltersModal = ({
  isOpen,
  onClose,
  filterPriority,
  setFilterPriority,
  filterStatus,
  setFilterStatus,
}: TaskFiltersModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white dark:bg-gray-800 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-gray-700 px-6 py-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Filtres</h2>
          <button type="button" onClick={onClose} className="text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-400">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6 px-6 py-5">
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-gray-400">
              Priorité
            </h3>
            <div className="grid gap-2 sm:grid-cols-2">
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 dark:border-gray-700 px-3 py-2 hover:bg-slate-50 dark:hover:bg-gray-700">
                <input
                  type="radio"
                  name="priority"
                  checked={filterPriority === 'all'}
                  onChange={() => setFilterPriority('all')}
                  className="h-4 w-4 accent-blue-600"
                />
                <span className="text-sm text-slate-700 dark:text-gray-300">Toutes</span>
              </label>
              {Object.entries(PRIORITIES).map(([key, cfg]) => (
                <label
                  key={key}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 dark:border-gray-700 px-3 py-2 hover:bg-slate-50 dark:hover:bg-gray-700"
                >
                  <input
                    type="radio"
                    name="priority"
                    checked={filterPriority === key}
                    onChange={() => setFilterPriority(key)}
                    className="h-4 w-4 accent-blue-600"
                  />
                  <span className="text-sm text-slate-700 dark:text-gray-300">{cfg.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-gray-400">
              Statut
            </h3>
            <div className="grid gap-2 sm:grid-cols-2">
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 dark:border-gray-700 px-3 py-2 hover:bg-slate-50 dark:hover:bg-gray-700">
                <input
                  type="radio"
                  name="statut"
                  checked={filterStatus === 'all'}
                  onChange={() => setFilterStatus('all')}
                  className="h-4 w-4 accent-blue-600"
                />
                <span className="text-sm text-slate-700 dark:text-gray-300">Tous</span>
              </label>
              {Object.entries(STATUSES).map(([key, cfg]) => (
                <label
                  key={key}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 dark:border-gray-700 px-3 py-2 hover:bg-slate-50 dark:hover:bg-gray-700"
                >
                  <input
                    type="radio"
                    name="statut"
                    checked={filterStatus === key}
                    onChange={() => setFilterStatus(key)}
                    className="h-4 w-4 accent-blue-600"
                  />
                  <span className="text-sm text-slate-700 dark:text-gray-300">{cfg.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 dark:border-gray-700 px-6 py-4">
          <button
            type="button"
            onClick={() => { setFilterPriority('all'); setFilterStatus('all'); }}
            className="text-sm font-medium text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-300"
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
