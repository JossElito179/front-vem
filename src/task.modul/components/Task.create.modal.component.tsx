import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { PRIORITIES } from "../data";
import { createTask } from "../task.service";
import type { ApiTask, CreateTaskPayload } from "../task.service";
import { getSubordonnees } from "../../auth.modul/auth.service";
import type { SubordonneeUser } from "../../auth.modul/auth.service";

type TaskCreateModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated: (task: ApiTask) => void;
};

const today = new Date().toISOString().slice(0, 10);

const TaskCreateModal = ({ isOpen, onClose, onTaskCreated }: TaskCreateModalProps) => {
  const [loading, setLoading] = useState(false);
  const [subordinates, setSubordinates] = useState<SubordonneeUser[]>([]);
  const [loadingSubordinates, setLoadingSubordinates] = useState(false);
  const [form, setForm] = useState({
    titre: '',
    description: '',
    dateDebut: today,
    dateLimite: '',
    poids: 1,
    priorite: 'NORMALE' as 'BASSE' | 'NORMALE' | 'HAUTE',
    idUserAssigne: '',
    commentaire: '',
  });

  useEffect(() => {
    if (!isOpen) return;
    const run = async () => {
      setLoadingSubordinates(true);
      try {
        const list = await getSubordonnees();
        setSubordinates(list);
        if (list.length > 0) {
          setForm(f => ({ ...f, idUserAssigne: String(list[0].id) }));
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Impossible de charger les employés');
      } finally {
        setLoadingSubordinates(false);
      }
    };
    void run();
  }, [isOpen]);

  if (!isOpen) return null;

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm(f => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload: CreateTaskPayload = {
        titre: form.titre,
        idUserAssigne: Number(form.idUserAssigne),
        dateDebut: form.dateDebut,
        dateLimite: form.dateLimite,
        poids: form.poids,
        priorite: form.priorite,
        description: form.description || null,
        commentaire: form.commentaire || null,
      };
      const { data: task, message } = await createTask(payload);
      toast.success(message);
      onTaskCreated(task);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Impossible de créer la tâche');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Créer une tâche</h2>
          <button onClick={onClose} className="text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-400">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
                <option value="">Chargement des employés...</option>
              ) : subordinates.length === 0 ? (
                <option value="">Aucun employé disponible</option>
              ) : (
                subordinates.map(u => (
                  <option key={u.id} value={String(u.id)}>
                    {u.prenom} {u.nom}{u.rang ? ` — ${u.rang.libelle}` : ''}
                  </option>
                ))
              )}
            </select>
          </div>

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
              disabled={loading || loadingSubordinates || subordinates.length === 0}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
            >
              {loading ? 'Création...' : 'Créer la tâche'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskCreateModal;
