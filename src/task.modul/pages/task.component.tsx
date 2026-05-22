import React, { useEffect, useState, useMemo } from "react";
import { Search, Plus, Layout, List } from "lucide-react";
import type { Task, User } from "../data";
import { PRIORITIES, TYPES, STATUSES, INITIAL_TASKS, USERS } from "../data";
import TaskDetailModal from "../components/task.detail.modal.component";
import TaskCreateModal from "../components/task.create.modal.component";
import TaskViewCard from "../components/Task.view.card.component";
import TaskFiltersModal from "../components/task.filters.modal.component";
import InsideSidebar from "../../templates.component/InsideSidebar.component";
import { IoIosAdd } from "react-icons/io";

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
const TaskPageContent = () => {
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
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-slate-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-245 w-full text-sm">
          <thead className="bg-slate-50 dark:bg-gray-900 border-b border-slate-200 dark:border-gray-700">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-slate-600 dark:text-gray-400">
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
                  className="border-b border-slate-100 dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => setSelectedTask(task)}
                >
                  <td className="px-4 py-3">
                    <TypeIcon type={task.type} />
                  </td>
                  <td className="px-4 py-3 text-left font-mono text-slate-500 dark:text-gray-400">
                    {task.id}
                  </td>
                  <td className="px-4 py-3 text-left font-medium text-slate-800 dark:text-white">
                    {task.title}
                  </td>
                  <td className="px-4 py-3">
                    {assignee ? (
                      <div className="flex items-center gap-2">
                        <Avatar
                          initials={assignee.initials}
                          color={assignee.color}
                        />
                        <span className="text-slate-600 dark:text-gray-300">
                          {assignee.name}
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-400 dark:text-gray-500">
                        Non assigné
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <PriorityBadge priority={task.priority} />
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded text-xs font-medium bg-slate-100 dark:bg-gray-700 text-slate-700 dark:text-gray-300">
                      {statusConfig.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-gray-400">
                    {task.storyPoints}
                  </td>
                  <td className="px-4 py-3 text-slate-500 dark:text-gray-400">
                    {task.dueDate}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-gray-950">
      {/* Header */}
      <div className=" border-b border-slate-200 dark:border-gray-800 px-2 py-4 sm:px-2">
        <div className="flex flex-col gap-4 mb-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <Layout
              className="text-blue-600 dark:text-blue-500 shrink-0"
              size={28}
            />
            <p className="text-3xl font-bold text-slate-900 dark:text-white truncate sm:text-lg">
              Gestion des tâches
            </p>
            <span className="shrink-0 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-[10px] sm:text-xs font-bold rounded uppercase tracking-wider">
              Kanban
            </span>
            {/* <button className="cursor-pointer shrink-0 px-2 py-2 bg-blue-100 text-blue-700 text-[10px] sm:text-xs font-bold rounded uppercase tracking-wider">
              + Créer
            </button> */}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex w-full bg-slate-100 dark:bg-gray-800 rounded-lg p-1 sm:w-auto">
              <button
                onClick={() => setViewMode("board")}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === "board" ? "bg-white dark:bg-gray-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-300"}`}
              >
                <Layout size={16} /> Board
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === "list" ? "bg-white dark:bg-gray-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 dark:text-gray-400 hover:text-slate-700 dark:hover:text-gray-300"}`}
              >
                <List size={16} /> Liste
              </button>
            </div>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="hidden items-center justify-center gap-2 border border-blue-600 dark:border-blue-500 hover:border-blue-700 dark:hover:border-blue-400 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 px-4 py-2 rounded-lg font-medium transition-colors shadow-sm sm:flex"
            >
              <Plus size={18} /> Créer
            </button>
          </div>
        </div>

        {/* Filtres */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:flex-wrap">
          <div className="relative w-full lg:flex-1 lg:max-w-md">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-gray-500"
              size={18}
            />
            <input
              type="text"
              placeholder="Rechercher des tâches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-gray-800 border-transparent dark:border-gray-700 focus:bg-white dark:focus:bg-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 text-sm transition-all outline-none"
            />
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => setIsFiltersModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium bg-slate-100 dark:bg-gray-800 text-slate-500 dark:text-gray-400 hover:bg-slate-200 dark:hover:bg-gray-700 hover:text-slate-700 dark:hover:text-gray-300 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
                />
              </svg>{" "}
              Filters
            </button>
          </div>

          <div className="text-sm text-slate-500 dark:text-gray-400 lg:ml-auto">
            {filteredTasks.length} tâches
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="p-2 mt-2">
        {viewMode === "board" ? (
          <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 min-h-[calc(100vh-200px)]">
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
                    className={`bg-slate-100 dark:bg-gray-800 rounded-t-lg px-3 py-3 flex items-center justify-between border-b-2 transition-all ${dragOverStatusId === status.id ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md" : isWipExceeded ? "border-red-500 bg-red-50 dark:bg-red-900/20" : "border-transparent"}`}
                  >
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-700 dark:text-gray-300 text-sm uppercase tracking-wide">
                        {status.name}
                      </h3>
                      <span className="px-2 py-0.5 bg-slate-200 dark:bg-gray-700 text-slate-600 dark:text-gray-400 text-xs rounded-full font-medium">
                        {columnTasks.length}
                      </span>
                    </div>
                    {status.name === "Backlog" && (
                      <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="p-2 border border-blue-300 dark:border-blue-600 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer transition-all"
                      >
                        <IoIosAdd size={18} />
                      </button>
                    )}
                    {status.limit && (
                      <span
                        className={`text-xs font-medium ${isWipExceeded ? "text-red-600 dark:text-red-400" : "text-slate-500 dark:text-gray-400"}`}
                      >
                        WIP: {status.limit}
                      </span>
                    )}
                  </div>

                  <div
                    className={`bg-slate-100 dark:bg-gray-800 rounded-b-lg p-3 shrink-0 min-h-50 transition-all ${dragOverStatusId === status.id ? "ring-2 ring-blue-400 dark:ring-blue-500 ring-inset" : ""}`}
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
                        className="w-full py-2 border-2 border-dashed border-slate-300 dark:border-gray-600 rounded-lg text-slate-500 dark:text-gray-400 text-sm hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center justify-center gap-2"
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

const TaskPage = () => {
  return (
    <InsideSidebar>
      <TaskPageContent />
    </InsideSidebar>
  );
};

export default TaskPage;
