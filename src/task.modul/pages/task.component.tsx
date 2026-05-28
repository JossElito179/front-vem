import React, { useEffect, useState, useMemo } from "react";
import { Search, Plus, Layout, List } from "lucide-react";
import { toast } from "react-toastify";
import { IoIosAdd } from "react-icons/io";
import type { ApiTask } from "../task.service";
import { getMyTasks, getTeamTasks, completeTask } from "../task.service";
import { STATUSES, getAvatarColor, getInitials } from "../data";
import TaskDetailModal from "../components/Task.detail.modal.component";
import TaskCreateModal from "../components/Task.create.modal.component";
import TaskViewCard from "../components/Task.view.card.component";
import TaskFiltersModal from "../components/Task.filters.modal.component";
import Avatar from "../components/Task.avatar.component";
import PriorityBadge from "../components/Task.priority-badge.component";
import TypeIcon from "../components/Task.type-icon.component";
import InsideSidebar from "../../templates.component/InsideSidebar.component";
import { useAuth } from "../../auth.modul/AuthProvider";

type ListViewProps = {
  tasks: ApiTask[];
  onSelect: (task: ApiTask) => void;
};

const ListView = ({ tasks, onSelect }: ListViewProps) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg border border-slate-200 dark:border-gray-700 overflow-hidden">
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 dark:bg-gray-900 border-b border-slate-200 dark:border-gray-700">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-gray-400">Statut</th>
            <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-gray-400">#</th>
            <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-gray-400">Titre</th>
            <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-gray-400">Assigné</th>
            <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-gray-400">Priorité</th>
            <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-gray-400">Poids</th>
            <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-gray-400">Date limite</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => {
            const initials = task.assigne ? getInitials(task.assigne.nom, task.assigne.prenom) : '?';
            const avatarColor = task.assigne ? getAvatarColor(task.assigne.id) : 'bg-slate-400';
            const assigneeName = task.assigne
              ? `${task.assigne.prenom} ${task.assigne.nom}`
              : 'Non assigné';
            return (
              <tr
                key={task.id}
                className="border-b border-slate-100 dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => onSelect(task)}
              >
                <td className="px-4 py-3"><TypeIcon statut={task.statut} /></td>
                <td className="px-4 py-3 font-mono text-slate-500 dark:text-gray-400">#{task.id}</td>
                <td className="px-4 py-3 font-medium text-slate-800 dark:text-white">{task.titre}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Avatar initials={initials} color={avatarColor} />
                    <span className="text-slate-600 dark:text-gray-300">{assigneeName}</span>
                  </div>
                </td>
                <td className="px-4 py-3"><PriorityBadge priority={task.priorite} /></td>
                <td className="px-4 py-3 text-slate-600 dark:text-gray-400">{task.poids}</td>
                <td className="px-4 py-3 text-slate-500 dark:text-gray-400">{task.dateLimite}</td>
              </tr>
            );
          })}
          {tasks.length === 0 && (
            <tr>
              <td colSpan={7} className="px-4 py-8 text-center text-slate-400 dark:text-gray-500">
                Aucune tâche trouvée
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

const TaskPageContent = () => {
  const { user } = useAuth();
  const hasCreatePerm = user?.permissions.includes('CREER_TACHE') ?? false;
  const hasTeamPerm = user?.permissions.includes('VOIR_EQUIPE_PROPRE') ?? false;

  const [tasks, setTasks] = useState<ApiTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [taskView, setTaskView] = useState<'mine' | 'team'>('mine');
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);
  const [draggedTask, setDraggedTask] = useState<ApiTask | null>(null);
  const [dragOverStatusId, setDragOverStatusId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<ApiTask | null>(null);
  const [contextMenuState, setContextMenuState] = useState<{
    taskId: number;
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const data = taskView === 'team' ? await getTeamTasks() : await getMyTasks();
        setTasks(data);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Impossible de charger les tâches');
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, [taskView]);

  useEffect(() => {
    const close = () => setContextMenuState(null);
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setContextMenuState(null); };
    document.addEventListener('click', close);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', close);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const filteredTasks = useMemo(() =>
    tasks.filter(task => {
      const matchesSearch = task.titre.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPriority = filterPriority === 'all' || task.priorite === filterPriority;
      const matchesStatus = filterStatus === 'all' || task.statut === filterStatus;
      return matchesSearch && matchesPriority && matchesStatus;
    }),
    [tasks, searchQuery, filterPriority, filterStatus]
  );

  const tasksByStatus = useMemo(() => {
    const grouped: Record<string, ApiTask[]> = {};
    Object.keys(STATUSES).forEach(s => {
      grouped[s] = filteredTasks.filter(t => t.statut === s);
    });
    return grouped;
  }, [filteredTasks]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, task: ApiTask) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, statusId?: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (statusId) setDragOverStatusId(statusId);
  };

  const handleDragLeave = () => setDragOverStatusId(null);

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, statusId: string) => {
    e.preventDefault();
    setDragOverStatusId(null);
    if (!draggedTask || draggedTask.statut === 'TERMINE' || statusId !== 'TERMINE') {
      setDraggedTask(null);
      return;
    }
    await doCompleteTask(draggedTask.id);
    setDraggedTask(null);
  };

  const doCompleteTask = async (taskId: number) => {
    try {
      const { data: updated, message } = await completeTask(taskId);
      setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
      toast.success(message);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Impossible de compléter la tâche');
    }
  };

  const handleTaskCreated = (task: ApiTask) => {
    setTasks(prev => [task, ...prev]);
    setIsCreateModalOpen(false);
  };

  const handleTaskUpdated = (task: ApiTask) => {
    setTasks(prev => prev.map(t => t.id === task.id ? task : t));
    setSelectedTask(task);
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-gray-950">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-gray-800 px-2 py-4 sm:px-2">
        <div className="flex flex-col gap-4 mb-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <Layout className="text-blue-600 dark:text-blue-500 shrink-0" size={28} />
            <p className="text-3xl font-bold text-slate-900 dark:text-white truncate sm:text-lg">
              Gestion des tâches
            </p>
            <span className="shrink-0 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-[10px] sm:text-xs font-bold rounded uppercase tracking-wider">
              Kanban
            </span>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {hasTeamPerm && (
              <div className="flex bg-slate-100 dark:bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setTaskView('mine')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${taskView === 'mine' ? 'bg-white dark:bg-gray-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-300'}`}
                >
                  Mes tâches
                </button>
                <button
                  onClick={() => setTaskView('team')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${taskView === 'team' ? 'bg-white dark:bg-gray-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-300'}`}
                >
                  Équipe
                </button>
              </div>
            )}

            <div className="flex bg-slate-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('board')}
                className={`flex items-center justify-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'board' ? 'bg-white dark:bg-gray-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-300'}`}
              >
                <Layout size={16} /> Board
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center justify-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-300'}`}
              >
                <List size={16} /> Liste
              </button>
            </div>

            {hasCreatePerm && (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="hidden items-center justify-center gap-2 border border-blue-600 dark:border-blue-500 hover:border-blue-700 dark:hover:border-blue-400 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 px-4 py-2 rounded-lg font-medium transition-colors shadow-sm sm:flex"
              >
                <Plus size={18} /> Créer
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:flex-wrap">
          <div className="relative w-full lg:flex-1 lg:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Rechercher des tâches..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-gray-800 border-transparent focus:bg-white dark:focus:bg-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 text-sm transition-all outline-none"
            />
          </div>

          <button
            type="button"
            onClick={() => setIsFiltersModalOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium bg-slate-100 dark:bg-gray-800 text-slate-500 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-gray-700 hover:text-slate-700 dark:hover:text-gray-300 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
            </svg>
            Filtres
          </button>

          <div className="text-sm text-slate-500 dark:text-gray-400 lg:ml-auto">
            {filteredTasks.length} tâche{filteredTasks.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-2 mt-2">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600 dark:border-gray-700 dark:border-t-blue-400" />
          </div>
        ) : viewMode === 'board' ? (
          <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 min-h-[calc(100vh-200px)]">
            {Object.values(STATUSES).map(status => {
              const columnTasks = tasksByStatus[status.id] ?? [];

              return (
                <div
                  key={status.id}
                  className="shrink-0 w-80"
                  onDragOver={e => handleDragOver(e, status.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={e => handleDrop(e, status.id)}
                >
                  <div
                    className={`bg-slate-100 dark:bg-gray-800 rounded-t-lg px-3 py-3 flex items-center justify-between border-b-2 transition-all ${
                      dragOverStatusId === status.id && status.id === 'TERMINE'
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20 shadow-md'
                        : dragOverStatusId === status.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
                        : 'border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-700 dark:text-gray-300 text-sm uppercase tracking-wide">
                        {status.name}
                      </h3>
                      <span className="px-2 py-0.5 bg-slate-200 dark:bg-gray-700 text-slate-600 dark:text-gray-400 text-xs rounded-full font-medium">
                        {columnTasks.length}
                      </span>
                    </div>
                    {hasCreatePerm && status.id === 'EN_COURS' && (
                      <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="p-2 border border-blue-300 dark:border-blue-600 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 cursor-pointer transition-all"
                      >
                        <IoIosAdd size={18} />
                      </button>
                    )}
                  </div>

                  <div
                    className={`bg-slate-100 dark:bg-gray-800 rounded-b-lg p-3 min-h-50 transition-all ${
                      dragOverStatusId === status.id && status.id === 'TERMINE'
                        ? 'ring-2 ring-green-400 dark:ring-green-500 ring-inset'
                        : dragOverStatusId === status.id
                        ? 'ring-2 ring-blue-400 dark:ring-blue-500 ring-inset'
                        : ''
                    }`}
                  >
                    {columnTasks.map(task => (
                      <TaskViewCard
                        key={task.id}
                        task={task}
                        isDragging={draggedTask?.id === task.id}
                        onDragStart={handleDragStart}
                        onOpenDetails={setSelectedTask}
                        isContextMenuOpen={contextMenuState?.taskId === task.id}
                        contextMenuPosition={
                          contextMenuState?.taskId === task.id
                            ? { x: contextMenuState.x, y: contextMenuState.y }
                            : null
                        }
                        onOpenContextMenu={(taskId, x, y) => setContextMenuState({ taskId, x, y })}
                        onCloseContextMenu={() => setContextMenuState(null)}
                        onCompleteTask={doCompleteTask}
                      />
                    ))}

                    {hasCreatePerm && status.id === 'EN_COURS' && (
                      <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="w-full py-2 border-2 border-dashed border-slate-300 dark:border-gray-600 rounded-lg text-slate-500 dark:text-gray-400 text-sm hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center justify-center gap-2"
                      >
                        <Plus size={16} /> Ajouter une tâche
                      </button>
                    )}

                    {status.id === 'TERMINE' && columnTasks.length === 0 && (
                      <div className="flex items-center justify-center h-20 text-slate-400 dark:text-gray-500 text-sm border-2 border-dashed border-slate-200 dark:border-gray-600 rounded-lg">
                        Glisser ici pour terminer
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <ListView tasks={filteredTasks} onSelect={setSelectedTask} />
        )}
      </div>

      {hasCreatePerm && (
        <TaskCreateModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onTaskCreated={handleTaskCreated}
        />
      )}

      <TaskFiltersModal
        isOpen={isFiltersModalOpen}
        onClose={() => setIsFiltersModalOpen(false)}
        filterPriority={filterPriority}
        setFilterPriority={setFilterPriority}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />

      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onTaskUpdated={handleTaskUpdated}
        />
      )}
    </div>
  );
};

const TaskPage = () => (
  <InsideSidebar>
    <TaskPageContent />
  </InsideSidebar>
);

export default TaskPage;
