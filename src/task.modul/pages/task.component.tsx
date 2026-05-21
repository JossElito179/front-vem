import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  Calendar,
  AlertTriangle,
  Layout,
  List,
  X,
} from "lucide-react";
import type { Task, User } from "../data";
import { PRIORITIES, TYPES, STATUSES, INITIAL_TASKS, USERS } from "../data";

// Composants utilitaires
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

// Composant principal
const TaskPage = () => {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [viewMode, setViewMode] = useState<"board" | "list">("board");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterAssignee, setFilterAssignee] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Filtrage
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPriority =
        filterPriority === "all" || task.priority === filterPriority;
      const matchesAssignee =
        filterAssignee === "all" || task.assignee === filterAssignee;
      return matchesSearch && matchesPriority && matchesAssignee;
    });
  }, [tasks, searchQuery, filterPriority, filterAssignee]);

  // Grouper par statut
  const tasksByStatus = useMemo(() => {
    const grouped: Record<string, Task[]> = {};
    Object.keys(STATUSES).forEach((status) => {
      grouped[status] = filteredTasks.filter((t) => t.status === status);
    });
    return grouped;
  }, [filteredTasks]);

  // État pour le feedback visuel du drop
  const [dragOverStatusId, setDragOverStatusId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, task: Task) => {
    // console.log("Drag start:", task);
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    statusId?: string
  ) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (statusId) {
      setDragOverStatusId(statusId);
    }
  };

  const handleDragLeave = () => {
    setDragOverStatusId(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, statusId: string) => {
    e.preventDefault();
    if (draggedTask && draggedTask.status !== statusId) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === draggedTask.id ? { ...t, status: statusId } : t,
        ),
      );
    }
    setDraggedTask(null);
    setDragOverStatusId(null);
  };

  // Créer une tâche
  // const handleCreateTask = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   const formData = new FormData(e.currentTarget);
  //   const newTask: Task = {
  //     id: `PROJ-${Math.floor(Math.random() * 900 + 100)}`,
  //     title: String(formData.get("title")),
  //     type: String(formData.get("type")),
  //     priority: String(formData.get("priority")),
  //     status: "backlog",
  //     assignee: formData.get("assignee")
  //       ? String(formData.get("assignee"))
  //       : null,
  //     dueDate: String(formData.get("dueDate")),
  //     tags: String(formData.get("tags"))
  //       .split(",")
  //       .map((t: string) => t.trim())
  //       .filter(Boolean),
  //     storyPoints: parseInt(String(formData.get("storyPoints"))) || 0,
  //   };
  //   setTasks((prev) => [...prev, newTask]);
  //   setIsCreateModalOpen(false);
  // };




  // Composant carte Kanban
  const TaskCard = ({ task }: { task: Task }) => {
    const assignee = USERS.find((u) => u.initials === task.assignee);
    const isOverdue =
      new Date(task.dueDate) < new Date() && task.status !== "done";
    const isDragging = draggedTask?.id === task.id;

    return (
      <div
        draggable
        onDragStart={(e) => handleDragStart(e, task)}
        // onClick={() => setSelectedTask(task)}
        className={`bg-white rounded-lg p-3 shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-300 transition-all cursor-grab active:cursor-grabbing group mb-3 ${isDragging ? "opacity-50 bg-slate-100" : ""}`}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <TypeIcon type={task.type} />
            <span className="text-xs text-slate-500 font-mono">{task.id}</span>
          </div>
          <button onClick={() => setSelectedTask(task)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-600">
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
    );
  };

  // Vue Liste
  const ListView = (): React.ReactNode => (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-slate-600">
              Type
            </th>
            <th className="px-4 py-3 text-left font-medium text-slate-600">
              Clé
            </th>
            <th className="px-4 py-3 text-left font-medium text-slate-600">
              Résumé
            </th>
            <th className="px-4 py-3 text-left font-medium text-slate-600">
              Assigné
            </th>
            <th className="px-4 py-3 text-left font-medium text-slate-600">
              Priorité
            </th>
            <th className="px-4 py-3 text-left font-medium text-slate-600">
              Statut
            </th>
            <th className="px-4 py-3 text-left font-medium text-slate-600">
              Points
            </th>
            <th className="px-4 py-3 text-left font-medium text-slate-600">
              Échéance
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.map((task: Task) => {
            const assignee = USERS.find(
              (u: User) => u.initials === task.assignee,
            );
            const statusConfig = STATUSES[task.status];
            return (
              <tr
                key={task.id}
                className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
                onClick={() => setSelectedTask(task)}
              >
                <td className="px-4 py-3">
                  <TypeIcon type={task.type} />
                </td>
                <td className="px-4 py-3 font-mono text-slate-500">
                  {task.id}
                </td>
                <td className="px-4 py-3 font-medium text-slate-800">
                  {task.title}
                </td>
                <td className="px-4 py-3">
                  {assignee ? (
                    <div className="flex items-center gap-2">
                      <Avatar
                        initials={assignee.initials}
                        color={assignee.color}
                      />
                      <span className="text-slate-600">{assignee.name}</span>
                    </div>
                  ) : (
                    <span className="text-slate-400">Non assigné</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <PriorityBadge priority={task.priority} />
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 rounded text-xs font-medium bg-slate-100 text-slate-700">
                    {statusConfig.name}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600">{task.storyPoints}</td>
                <td className="px-4 py-3 text-slate-500">{task.dueDate}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  // Modal détail tâche
  const TaskDetailModal = ({
    task,
    onClose,
  }: {
    task: Task | null;
    onClose: () => void;
  }) => {
    if (!task) return null;
    const assignee = USERS.find((u) => u.initials === task.assignee);

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TypeIcon type={task!.type} />
              <span className="text-slate-500 font-mono">{task!.id}</span>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              {task!.title}
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase">
                  Statut
                </label>
                <div className="mt-1 flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${task!.status === "done" ? "bg-green-500" : task!.status === "inprogress" ? "bg-blue-500" : "bg-slate-400"}`}
                  />
                  <span className="font-medium">
                    {STATUSES[task!.status].name}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase">
                  Priorité
                </label>
                <div className="mt-1">
                  <PriorityBadge priority={task!.priority} />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase">
                  Assigné
                </label>
                <div className="mt-1 flex items-center gap-2">
                  {assignee ? (
                    <>
                      <Avatar
                        initials={assignee.initials}
                        color={assignee.color}
                      />
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
                <div className="mt-1 font-medium">
                  {task!.storyPoints} points
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="text-xs font-semibold text-slate-500 uppercase">
                Tags
              </label>
              <div className="mt-2 flex flex-wrap gap-2">
                {task!.tags.map((tag: string) => (
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
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Layout className="text-blue-600" size={28} />
            <h1 className="text-2xl font-bold text-slate-900">
              Gestion des tâches
            </h1>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded uppercase tracking-wider">
              Kanban
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("board")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === "board" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              >
                <Layout size={16} /> Board
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === "list" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              >
                <List size={16} /> Liste
              </button>
            </div>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
            >
              <Plus size={18} /> Créer
            </button>
          </div>
        </div>

        {/* Filtres */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Rechercher des tâches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg text-sm transition-all outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={16} className="text-slate-400" />
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 outline-none focus:border-blue-500"
            >
              <option value="all">Toutes priorités</option>
              {Object.entries(PRIORITIES).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.label}
                </option>
              ))}
            </select>

            <select
              value={filterAssignee}
              onChange={(e) => setFilterAssignee(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 outline-none focus:border-blue-500"
            >
              <option value="all">Tous assignés</option>
              {USERS.map((user) => (
                <option key={user.initials} value={user.initials}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          <div className="ml-auto text-sm text-slate-500">
            {filteredTasks.length} tâches
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="p-6">
        {viewMode === "board" ? (
          <div className="flex gap-4 overflow-x-auto pb-4 min-h-[calc(100vh-200px)]">
            {Object.values(STATUSES).map((status: any) => {
              const columnTasks = (tasksByStatus[status.id] as Task[]) || [];
              const isWipExceeded =
                status.limit && columnTasks.length > status.limit;

              return (
                <div
                  key={status.id}
                  className="shrink-0 w-80"
                  onDragOver={(e) => handleDragOver(e, status.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, status.id)}
                >
                  <div
                    className={`bg-slate-100 rounded-t-lg px-4 py-3 flex items-center justify-between border-b-2 transition-all ${dragOverStatusId === status.id ? "border-blue-500 bg-blue-50 shadow-md" : isWipExceeded ? "border-red-500 bg-red-50" : "border-transparent"}`}
                  >
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-700 text-sm uppercase tracking-wide">
                        {status.name}
                      </h3>
                      <span className="px-2 py-0.5 bg-slate-200 text-slate-600 text-xs rounded-full font-medium">
                        {columnTasks.length}
                      </span>
                    </div>
                    {status.limit && (
                      <span
                        className={`text-xs font-medium ${isWipExceeded ? "text-red-600" : "text-slate-500"}`}
                      >
                        WIP: {status.limit}
                      </span>
                    )}
                  </div>

                  <div className={`bg-slate-100 rounded-b-lg p-3 shrink-0 min-h-50 transition-all ${dragOverStatusId === status.id ? "ring-2 ring-blue-400 ring-inset" : ""}`}>
                    {columnTasks.map((task: Task) => (
                      <TaskCard key={task.id} task={task} />
                    ))}

                    <button
                      onClick={() => setIsCreateModalOpen(true)}
                      className="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 text-sm hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus size={16} /> Ajouter une tâche
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <ListView />
        )}
      </div>

      {/* Modal Création */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">
                Créer une tâche
              </h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
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
                    {Object.keys(TYPES).map((t: string) => (
                      <option key={t} value={t}>
                        {TYPES[t].label}
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
                    {Object.keys(PRIORITIES).map((p: string) => (
                      <option key={p} value={p}>
                        {PRIORITIES[p].label}
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
                    {USERS.map((u: User) => (
                      <option key={u.initials} value={u.initials}>
                        {u.name}
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
                  onClick={() => setIsCreateModalOpen(false)}
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
      )}

      {/* Modal Détail */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
};

export default TaskPage;
