import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { PRIORITIES, STATUSES } from "../data";
import { updateTask } from "../task.service";
import type { ApiTask, UpdateTaskPayload } from "../task.service";
import { getSubordonnees } from "../../auth.modul/auth.service";
import type { SubordonneeUser } from "../../auth.modul/auth.service";

type TaskEditModalProps = {
  task: ApiTask;
  onClose: () => void;
  onTaskUpdated: (task: ApiTask) => void;
};

const TaskEditModal = ({ task, onClose, onTaskUpdated }: TaskEditModalProps) => {
  const [loading, setLoading] = useState(false);
  const [subordinates, setSubordinates] = useState<SubordonneeUser[]>([]);
  const [loadingSubordinates, setLoadingSubordinates] = useState(true);
  const [form, setForm] = useState({
    titre: task.titre,
    description: task.description ?? '',
    dateDebut: task.dateDebut,
    dateLimite: task.dateLimite,
    poids: task.poids,
    priorite: task.priorite as 'BASSE' | 'NORMALE' | 'HAUTE',
    commentaire: task.commentaire ?? '',
    idUserAssigne: String(task.idUserAssigne),
  });

  useEffect(() => {
    const run = async () => {
      setLoadingSubordinates(true);
      try {
        const list = await getSubordonnees();
        setSubordinates(list);
        // If the currently assigned user isn't in the list, keep the existing id
        // (they may have left the team but the task still carries their id)
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : 'Impossible de charger les employés'
        );
      } finally {
        setLoadingSubordinates(false);
      }
    };
    void run();
  }, []);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm(f => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload: UpdateTaskPayload = {
        idUserAssigne: Number(form.idUserAssigne),
        titre: form.titre,
        description: form.description || null,
        dateDebut: form.dateDebut,
        dateLimite: form.dateLimite,
        poids: form.poids,
        priorite: form.priorite,
        commentaire: form.commentaire || null,
      };
      const { data: updated, message } = await updateTask(task.id, payload);
      toast.success(message);
      onTaskUpdated(updated);
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Impossible de modifier la tâche');
    } finally {
      setLoading(false);
    }
  };

  // Build the option list — always include the current assignee even if they're
  // no longer in the subordinates list, so the select never shows a blank value.
  const assigneeOptions = (() => {
    const inList = subordinates.some(u => u.id === task.idUserAssigne);
    const extra =
      !inList && task.assigne
        ? [
            {
              id: task.assigne.id,
              nom: task.assigne.nom,
              prenom: task.assigne.prenom,
              email: task.assigne.email,
              rang: null,
              poste: null,
            } satisfies SubordonneeUser,
          ]
        : [];
    return [...extra, ...subordinates];
  })();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Modifier la tâche</h2>
            <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">
              #{task.id} · {STATUSES[task.statut]?.name ?? task.statut}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-400"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Titre */}
          <div>
            <label className="block text-sm text-left font-medium text-slate-700 dark:text-gray-300 mb-1">
              Titre <span className="text-red-500">*</span>
            </label>
            <input
              required
              value={form.titre}
              onChange={e => set('titre', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-left font-medium text-slate-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={form.description}
              onChange={e => set('description', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-900 dark:text-white rounded-lg outline-none focus:border-blue-500 resize-none"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-left font-medium text-slate-700 dark:text-gray-300 mb-1">
                Date début <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={form.dateDebut}
                onChange={e => set('dateDebut', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-900 dark:text-white rounded-lg outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm text-left font-medium text-slate-700 dark:text-gray-300 mb-1">
                Date limite <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={form.dateLimite}
                onChange={e => set('dateLimite', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-900 dark:text-white rounded-lg outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Priorité + Poids */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-left font-medium text-slate-700 dark:text-gray-300 mb-1">
                Priorité
              </label>
              <select
                value={form.priorite}
                onChange={e => set('priorite', e.target.value as 'BASSE' | 'NORMALE' | 'HAUTE')}
                className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-900 dark:text-white rounded-lg outline-none focus:border-blue-500"
              >
                {Object.entries(PRIORITIES).map(([key, cfg]) => (
                  <option key={key} value={key}>{cfg.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-left font-medium text-slate-700 dark:text-gray-300 mb-1">
                Poids (1–5)
              </label>
              <input
                type="number"
                min={1}
                max={5}
                value={form.poids}
                onChange={e => set('poids', Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-900 dark:text-white rounded-lg outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Assigné à */}
          <div>
            <label className="block text-sm text-left font-medium text-slate-700 dark:text-gray-300 mb-1">
              Assigné à <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={form.idUserAssigne}
              onChange={e => set('idUserAssigne', e.target.value)}
              disabled={loadingSubordinates}
              className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-900 dark:text-white rounded-lg outline-none focus:border-blue-500 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loadingSubordinates ? (
                <option value={form.idUserAssigne}>Chargement des employés...</option>
              ) : assigneeOptions.length === 0 ? (
                <option value="">Aucun employé disponible</option>
              ) : (
                assigneeOptions.map(u => (
                  <option key={u.id} value={String(u.id)}>
                    {u.prenom} {u.nom}{u.rang ? ` — ${u.rang.libelle}` : ''}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Commentaire */}
          <div>
            <label className="block text-sm text-left font-medium text-slate-700 dark:text-gray-300 mb-1">
              Commentaire
            </label>
            <textarea
              rows={2}
              value={form.commentaire}
              onChange={e => set('commentaire', e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-900 dark:text-white rounded-lg outline-none focus:border-blue-500 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading || loadingSubordinates || assigneeOptions.length === 0}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
            >
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskEditModal;
