import { useEffect, useState } from "react";

function Tasks() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("constructionTasks");

    return savedTasks
      ? JSON.parse(savedTasks)
      : [
          {
            id: 1,
            projectId: 1,
            title: "Foundation Work",
            assignedTo: "Kamal Perera",
            priority: "High",
            dueDate: "2026-09-15",
            status: "Completed",
          },
          {
            id: 2,
            projectId: 1,
            title: "Structural Construction",
            assignedTo: "Nimal Fernando",
            priority: "High",
            dueDate: "2026-10-20",
            status: "In Progress",
          },
          {
            id: 3,
            projectId: 2,
            title: "Site Preparation",
            assignedTo: "Saman Silva",
            priority: "Medium",
            dueDate: "2026-08-30",
            status: "In Progress",
          },
          {
            id: 4,
            projectId: 3,
            title: "Interior Finishing",
            assignedTo: "Ruwan Kumar",
            priority: "Medium",
            dueDate: "2026-09-10",
            status: "Pending",
          },
        ];
  });

  const [projects, setProjects] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [errors, setErrors] = useState({});

  const emptyForm = {
    projectId: "",
    title: "",
    assignedTo: "",
    priority: "Medium",
    dueDate: "",
    status: "Pending",
  };

  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    const savedProjects = localStorage.getItem("constructionProjects");

    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("constructionTasks", JSON.stringify(tasks));
  }, [tasks]);

  const getProjectName = (projectId) => {
    const project = projects.find(
      (item) => String(item.id) === String(projectId)
    );

    return project ? project.name : "Unknown Project";
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.projectId) {
      newErrors.projectId = "Please select a project.";
    }

    if (!formData.title.trim()) {
      newErrors.title = "Task title is required.";
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Task title must be at least 3 characters.";
    }

    if (!formData.assignedTo.trim()) {
      newErrors.assignedTo = "Assigned worker is required.";
    }

    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const openAddModal = () => {
    setEditingTaskId(null);

    setFormData({
      ...emptyForm,
      projectId:
        projects.length > 0 ? String(projects[0].id) : "",
    });

    setErrors({});
    setShowModal(true);
  };

  const openEditModal = (task) => {
    setEditingTaskId(task.id);

    setFormData({
      projectId: String(task.projectId || ""),
      title: task.title || "",
      assignedTo: task.assignedTo || "",
      priority: task.priority || "Medium",
      dueDate: task.dueDate || "",
      status: task.status || "Pending",
    });

    setErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTaskId(null);
    setFormData(emptyForm);
    setErrors({});
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (editingTaskId) {
      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === editingTaskId
            ? {
                ...task,
                projectId: Number(formData.projectId),
                title: formData.title.trim(),
                assignedTo: formData.assignedTo.trim(),
                priority: formData.priority,
                dueDate: formData.dueDate,
                status: formData.status,
              }
            : task
        )
      );
    } else {
      const newTask = {
        id: Date.now(),
        projectId: Number(formData.projectId),
        title: formData.title.trim(),
        assignedTo: formData.assignedTo.trim(),
        priority: formData.priority,
        dueDate: formData.dueDate,
        status: formData.status,
      };

      setTasks((currentTasks) => [...currentTasks, newTask]);
    }

    closeModal();
  };

  const deleteTask = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) {
      return;
    }

    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== id)
    );
  };

  // Quick status update
  const updateTaskStatus = (id, newStatus) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id
          ? {
              ...task,
              status: newStatus,
            }
          : task
      )
    );
  };

  const filteredTasks = tasks.filter((task) => {
    const searchText = search.toLowerCase();

    const taskTitle = String(task.title || "").toLowerCase();
    const assignedWorker = String(task.assignedTo || "").toLowerCase();
    const projectName = String(
      getProjectName(task.projectId) || ""
    ).toLowerCase();

    const matchesSearch =
      taskTitle.includes(searchText) ||
      assignedWorker.includes(searchText) ||
      projectName.includes(searchText);

    const matchesStatus =
      statusFilter === "All" || task.status === statusFilter;

    const matchesPriority =
      priorityFilter === "All" ||
      task.priority === priorityFilter;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority
    );
  });

  const getPriorityStyle = (priority) => {
    if (priority === "High") {
      return "bg-red-100 text-red-700";
    }

    if (priority === "Medium") {
      return "bg-yellow-100 text-yellow-700";
    }

    return "bg-green-100 text-green-700";
  };

  const getStatusStyle = (status) => {
    if (status === "Completed") {
      return "bg-green-100 text-green-700";
    }

    if (status === "In Progress") {
      return "bg-blue-100 text-blue-700";
    }

    return "bg-slate-100 text-slate-700";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-sm text-orange-500 font-semibold uppercase tracking-wide">
            Construction Management
          </p>

          <h1 className="text-3xl font-bold text-slate-800 mt-1">
            Tasks
          </h1>

          <p className="text-slate-500 mt-1">
            Manage construction tasks, deadlines, and assignments.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-lg font-semibold transition"
        >
          + Add Task
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Tasks</p>

          <h2 className="text-3xl font-bold text-slate-800 mt-2">
            {tasks.length}
          </h2>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <p className="text-sm text-slate-500">Completed</p>

          <h2 className="text-3xl font-bold text-green-600 mt-2">
            {
              tasks.filter(
                (task) => task.status === "Completed"
              ).length
            }
          </h2>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <p className="text-sm text-slate-500">In Progress</p>

          <h2 className="text-3xl font-bold text-blue-600 mt-2">
            {
              tasks.filter(
                (task) => task.status === "In Progress"
              ).length
            }
          </h2>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <p className="text-sm text-slate-500">High Priority</p>

          <h2 className="text-3xl font-bold text-red-600 mt-2">
            {
              tasks.filter(
                (task) => task.priority === "High"
              ).length
            }
          </h2>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Search
            </label>

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search task, worker, or project..."
              className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Status
            </label>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              className="w-full border border-slate-300 rounded-lg px-4 py-3"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Priority
            </label>

            <select
              value={priorityFilter}
              onChange={(event) =>
                setPriorityFilter(event.target.value)
              }
              className="w-full border border-slate-300 rounded-lg px-4 py-3"
            >
              <option value="All">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Task
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Project
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Assigned To
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Priority
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Due Date
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Status
                </th>

                <th className="text-right px-6 py-4 text-sm font-semibold text-slate-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredTasks.map((task) => (
                <tr
                  key={task.id}
                  className="border-b border-slate-100 hover:bg-slate-50"
                >
                  <td className="px-6 py-5">
                    <p className="font-semibold text-slate-800">
                      {task.title || "Untitled Task"}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-sm text-slate-600">
                      {getProjectName(task.projectId)}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-sm text-slate-600">
                      👷 {task.assignedTo || "Not Assigned"}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityStyle(
                        task.priority
                      )}`}
                    >
                      {task.priority || "Medium"}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-sm text-slate-600">
                      {task.dueDate || "No Date"}
                    </p>
                  </td>

                  {/* Quick Status Change */}
                  <td className="px-6 py-5">
                    <select
                      value={task.status || "Pending"}
                      onChange={(event) =>
                        updateTaskStatus(
                          task.id,
                          event.target.value
                        )
                      }
                      className={`border-0 rounded-full px-3 py-2 text-xs font-semibold outline-none cursor-pointer ${getStatusStyle(
                        task.status
                      )}`}
                    >
                      <option value="Pending">
                        Pending
                      </option>

                      <option value="In Progress">
                        In Progress
                      </option>

                      <option value="Completed">
                        Completed
                      </option>
                    </select>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEditModal(task)}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-sm font-medium"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteTask(task.id)}
                        className="px-3 py-2 border border-red-200 hover:bg-red-50 text-red-600 rounded-lg text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTasks.length === 0 && (
          <div className="p-12 text-center">
            <div className="text-5xl mb-4">📋</div>

            <h2 className="text-xl font-semibold text-slate-700">
              No tasks found
            </h2>

            <p className="text-slate-500 mt-2">
              Try changing your search or filters.
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  {editingTaskId
                    ? "Edit Task"
                    : "Add New Task"}
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Manage construction task information.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-700 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Project */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Construction Project *
                  </label>

                  <select
                    name="projectId"
                    value={formData.projectId}
                    onChange={handleInputChange}
                    className={`w-full border rounded-lg px-4 py-3 ${
                      errors.projectId
                        ? "border-red-500"
                        : "border-slate-300"
                    }`}
                  >
                    <option value="">
                      Select Project
                    </option>

                    {projects.map((project) => (
                      <option
                        key={project.id}
                        value={project.id}
                      >
                        {project.name}
                      </option>
                    ))}
                  </select>

                  {errors.projectId && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.projectId}
                    </p>
                  )}
                </div>

                {/* Task Title */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Task Title *
                  </label>

                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Foundation Work"
                    className={`w-full border rounded-lg px-4 py-3 ${
                      errors.title
                        ? "border-red-500"
                        : "border-slate-300"
                    }`}
                  />

                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.title}
                    </p>
                  )}
                </div>

                {/* Worker */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Assigned Worker *
                  </label>

                  <input
                    type="text"
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleInputChange}
                    placeholder="e.g. Kamal Perera"
                    className={`w-full border rounded-lg px-4 py-3 ${
                      errors.assignedTo
                        ? "border-red-500"
                        : "border-slate-300"
                    }`}
                  />

                  {errors.assignedTo && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.assignedTo}
                    </p>
                  )}
                </div>

                {/* Due Date */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Due Date *
                  </label>

                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    className={`w-full border rounded-lg px-4 py-3 ${
                      errors.dueDate
                        ? "border-red-500"
                        : "border-slate-300"
                    }`}
                  />

                  {errors.dueDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.dueDate}
                    </p>
                  )}
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Priority
                  </label>

                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-lg px-4 py-3"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Status
                  </label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-lg px-4 py-3"
                  >
                    <option value="Pending">Pending</option>

                    <option value="In Progress">
                      In Progress
                    </option>

                    <option value="Completed">
                      Completed
                    </option>
                  </select>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-8 pt-5 border-t border-slate-200">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-3 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold"
                >
                  {editingTaskId
                    ? "Save Changes"
                    : "Add Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tasks;