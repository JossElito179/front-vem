import { useState } from "react";
import { Calendar, Pencil, X } from "lucide-react";
import { toast } from "react-toastify";
import type { ApiTask } from "../task.service";
import { completeTask } from "../task.service";
import { STATUSES, getAvatarColor, getInitials } from "../data";
import TypeIcon from "./Task.type-icon.component";
import PriorityBadge from "./Task.priority-badge.component";
import Avatar from "./Task.avatar.component";

type TaskDetailModalProps = {
  task: ApiTask | null;
  onClose: () => void;
  onTaskUpdated?: (task: ApiTask) => void;
  onEdit?: () => void;
};

const TaskDetailModal = ({ task, onClose, onTaskUpdated, onEdit }: TaskDetailModalProps) => {
  const [completing, setCompleting] = useState(false);
  const [completionComment, setCompletionComment] = useState('');

  if (!task) return null;

  const isCompleted = task.statut === 'TERMINE';
  const assigneeInitials = task.assigne
    ? getInitials(task.assigne.nom, task.assigne.prenom)
    : '?';
  const assigneeColor = task.assigne ? getAvatarColor(task.assigne.id) : 'bg-slate-400';
  const assigneeName = task.assigne
    ? `${task.assigne.prenom} ${task.assigne.nom}`
    : 'Non assigné';

  const handleComplete = async () => {
    setCompleting(true);
    try {
      const { data: updated, message } = await completeTask(task.id, completionComment || null);
      toast.success(message);
      onTaskUpdated?.(updated);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Impossible de compléter la tâche');
    } finally {
      setCompleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-slate-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TypeIcon statut={task.statut} />
            <span className="text-slate-500 dark:text-gray-400 font-mono">#{task.id}</span>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-gray-300">
              {STATUSES[task.statut]?.name ?? task.statut}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {onEdit && !isCompleted && (
              <button
                onClick={onEdit}
                title="Modifier la tâche"
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              >
                <Pencil size={15} />
                Modifier
              </button>
            )}
            <button onClick={onClose} className="text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-400">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{task.titre}</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase">Priorité</label>
              <div className="mt-1"><PriorityBadge priority={task.priorite} /></div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase">Poids</label>
              <div className="mt-1 font-medium text-slate-900 dark:text-white">{task.poids} / 5</div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase">Assigné</label>
              <div className="mt-1 flex items-center gap-2">
                <Avatar initials={assigneeInitials} color={assigneeColor} />
                <span className="text-slate-700 dark:text-gray-300">{assigneeName}</span>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase">Créateur</label>
              <div className="mt-1 text-slate-700 dark:text-gray-300">
                {task.createur ? `${task.createur.prenom} ${task.createur.nom}` : '—'}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Calendar size={14} />
              <span>Début : {task.dateDebut}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={14} />
              <span>Limite : {task.dateLimite}</span>
            </div>
            {task.dateCompletion && (
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <Calendar size={14} />
                <span>Terminé le : {task.dateCompletion}</span>
              </div>
            )}
          </div>

          {task.description && (
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase">Description</label>
              <div className="mt-2 p-4 bg-slate-50 dark:bg-gray-700 rounded-lg text-slate-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                {task.description}
              </div>
            </div>
          )}

          {task.commentaire && (
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase">Commentaire</label>
              <div className="mt-2 p-4 bg-slate-50 dark:bg-gray-700 rounded-lg text-slate-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                {task.commentaire}
              </div>
            </div>
          )}

          {!isCompleted && (
            <div className="border-t border-slate-200 dark:border-gray-700 pt-4 space-y-3">
              <label className="text-xs font-semibold text-slate-500 uppercase">Clôturer la tâche</label>
              <textarea
                rows={2}
                placeholder="Commentaire de clôture (optionnel)"
                value={completionComment}
                onChange={e => setCompletionComment(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-slate-900 dark:text-white rounded-lg outline-none focus:border-blue-500 resize-none text-sm"
              />
              <button
                onClick={handleComplete}
                disabled={completing}
                className="w-full py-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white rounded-lg font-medium transition-colors text-sm"
              >
                {completing ? 'Traitement...' : '✓ Marquer comme terminé'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
