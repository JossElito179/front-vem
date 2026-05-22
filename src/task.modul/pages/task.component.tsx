import React, { useEffect, useState, useMemo } from "react";
import { Search, Filter, Plus, Layout, List } from "lucide-react";
import type { Task, User } from "../data";
import { PRIORITIES, TYPES, STATUSES, INITIAL_TASKS, USERS } from "../data";
import TaskDetailModal from "../components/task.detail.modal.component";
import TaskCreateModal from "../components/task.create.modal.component";
import TaskViewCard from "../components/Task.view.card.component";
import TaskFiltersModal from "../components/task.filters.modal.component";

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
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [contextMenuState, setContextMenuState] = useState<{
    taskId: string;
    x: number;
    y: number;
  } | null>(null);

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
    statusId?: string,
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

  const openTaskContextMenu = (taskId: string, x: number, y: number) => {
    setContextMenuState({ taskId, x, y });
  };

  const closeTaskContextMenu = () => {
    setContextMenuState(null);
  };

  useEffect(() => {
    const handleDocumentClick = () => {
      closeTaskContextMenu();
    };

    const handleDocumentScroll = () => {
      closeTaskContextMenu();
    };

    const handleDocumentWheel = () => {
      closeTaskContextMenu();
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeTaskContextMenu();
      }
    };

    document.addEventListener("click", handleDocumentClick);
    document.addEventListener("scroll", handleDocumentScroll, true);
    document.addEventListener("wheel", handleDocumentWheel, { passive: true });
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
      document.removeEventListener("scroll", handleDocumentScroll, true);
      document.removeEventListener("wheel", handleDocumentWheel);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

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

  // Vue Liste
  const ListView = (): React.ReactNode => (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-245 w-full text-sm">
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
                  <td className="px-4 py-3 text-left font-mono text-slate-500">
                    {task.id}
                  </td>
                  <td className="px-4 py-3 text-left font-medium text-slate-800">
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
                  <td className="px-4 py-3 text-slate-600">
                    {task.storyPoints}
                  </td>
                  <td className="px-4 py-3 text-slate-500">{task.dueDate}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-4 mb-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <Layout className="text-blue-600 shrink-0" size={28} />
            <p className="text-2xl font-bold text-slate-900 truncate sm:text-lg">
              Gestion des tâches
            </p>
            <span className="shrink-0 px-2 py-1 bg-blue-100 text-blue-700 text-[10px] sm:text-xs font-bold rounded uppercase tracking-wider">
              Kanban
            </span>
            {/* <button className="cursor-pointer shrink-0 px-2 py-2 bg-blue-100 text-blue-700 text-[10px] sm:text-xs font-bold rounded uppercase tracking-wider">
              + Créer
            </button> */}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex w-full bg-slate-100 rounded-lg p-1 sm:w-auto">
              <button
                onClick={() => setViewMode("board")}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === "board" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              >
                <Layout size={16} /> Board
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === "list" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              >
                <List size={16} /> Liste
              </button>
            </div>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="hidden items-center justify-center gap-2 border border-blue-600 hover:border-blue-700 text-blue-600 hover:text-blue-700 px-4 py-2 rounded-lg font-medium transition-colors shadow-sm sm:flex"
            >
              <Plus size={18} /> Créer
            </button>
          </div>
        </div>

        {/* Filtres */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:flex-wrap">
          <div className="relative w-full lg:flex-1 lg:max-w-md">
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

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => setIsFiltersModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors"
            >
              <Filter size={16} className="text-slate-400" /> Filters
            </button>
          </div>

          <div className="text-sm text-slate-500 lg:ml-auto">
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
                    {status.name === "Backlog" && (
                      <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="px-2 border border-blue-200 rounded-lg text-gray-400 cursor-pointer"
                      >
                        +
                      </button>
                    )}
                    {status.limit && (
                      <span
                        className={`text-xs font-medium ${isWipExceeded ? "text-red-600" : "text-slate-500"}`}
                      >
                        WIP: {status.limit}
                      </span>
                    )}
                  </div>

                  <div
                    className={`bg-slate-100 rounded-b-lg p-3 shrink-0 min-h-50 transition-all ${dragOverStatusId === status.id ? "ring-2 ring-blue-400 ring-inset" : ""}`}
                  >
                    {columnTasks.map((task: Task) => (
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
                        onOpenContextMenu={openTaskContextMenu}
                        onCloseContextMenu={closeTaskContextMenu}
                        onMoveTask={(taskId, statusId) => {
                          setTasks((currentTasks) =>
                            currentTasks.map((currentTask) =>
                              currentTask.id === taskId
                                ? { ...currentTask, status: statusId }
                                : currentTask,
                            ),
                          );
                        }}
                      />
                    ))}

                    {status.id === "backlog" && (
                      <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 text-sm hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
                      >
                        <Plus size={16} /> Ajouter une tâche
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <ListView />
        )}
      </div>

      <TaskCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <TaskFiltersModal
        isOpen={isFiltersModalOpen}
        onClose={() => setIsFiltersModalOpen(false)}
        filterPriority={filterPriority}
        setFilterPriority={setFilterPriority}
        filterAssignee={filterAssignee}
        setFilterAssignee={setFilterAssignee}
      />

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
