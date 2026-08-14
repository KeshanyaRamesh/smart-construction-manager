import { useEffect, useState } from "react";

function Projects() {
  const [projects, setProjects] = useState(() => {
    const savedProjects = localStorage.getItem(
      "constructionProjects"
    );

    return savedProjects
      ? JSON.parse(savedProjects)
      : [
          {
            id: 1,
            name: "Green Valley Apartment",
            client: "Green Valley Holdings",
            location: "Colombo",
            manager: "Kamal Perera",
            startDate: "2026-06-01",
            endDate: "2027-02-28",
            budget: 45000000,
            status: "In Progress",
          },
          {
            id: 2,
            name: "City Shopping Complex",
            client: "City Development Group",
            location: "Kandy",
            manager: "Nimal Fernando",
            startDate: "2026-07-15",
            endDate: "2027-05-30",
            budget: 68000000,
            status: "In Progress",
          },
          {
            id: 3,
            name: "Modern Office Building",
            client: "Lanka Business Solutions",
            location: "Jaffna",
            manager: "Saman Silva",
            startDate: "2026-03-10",
            endDate: "2026-08-31",
            budget: 32000000,
            status: "Completed",
          },
        ];
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("All");

  const [showModal, setShowModal] =
    useState(false);

  const [editingProjectId, setEditingProjectId] =
    useState(null);

  const [errors, setErrors] = useState({});

  const emptyForm = {
    name: "",
    client: "",
    location: "",
    manager: "",
    startDate: "",
    endDate: "",
    budget: "",
    status: "Planning",
  };

  const [formData, setFormData] =
    useState(emptyForm);

  useEffect(() => {
    localStorage.setItem(
      "constructionProjects",
      JSON.stringify(projects)
    );
  }, [projects]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      maximumFractionDigits: 0,
    }).format(Number(amount) || 0);
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

    if (!formData.name.trim()) {
      newErrors.name =
        "Project name is required.";
    } else if (
      formData.name.trim().length < 3
    ) {
      newErrors.name =
        "Project name must be at least 3 characters.";
    }

    if (!formData.client.trim()) {
      newErrors.client =
        "Client name is required.";
    }

    if (!formData.location.trim()) {
      newErrors.location =
        "Project location is required.";
    }

    if (!formData.manager.trim()) {
      newErrors.manager =
        "Project manager is required.";
    }

    if (!formData.startDate) {
      newErrors.startDate =
        "Start date is required.";
    }

    if (!formData.endDate) {
      newErrors.endDate =
        "End date is required.";
    }

    if (
      formData.startDate &&
      formData.endDate &&
      formData.endDate < formData.startDate
    ) {
      newErrors.endDate =
        "End date cannot be before start date.";
    }

    if (
      formData.budget === "" ||
      Number(formData.budget) <= 0
    ) {
      newErrors.budget =
        "Budget must be greater than 0.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const openAddModal = () => {
    setEditingProjectId(null);
    setFormData(emptyForm);
    setErrors({});
    setShowModal(true);
  };

  const openEditModal = (project) => {
    setEditingProjectId(project.id);

    setFormData({
      name: project.name || "",
      client: project.client || "",
      location: project.location || "",
      manager: project.manager || "",
      startDate: project.startDate || "",
      endDate: project.endDate || "",
      budget: project.budget || "",
      status: project.status || "Planning",
    });

    setErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProjectId(null);
    setFormData(emptyForm);
    setErrors({});
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (editingProjectId) {
      setProjects((currentProjects) =>
        currentProjects.map((project) =>
          project.id === editingProjectId
            ? {
                ...project,
                name: formData.name.trim(),
                client: formData.client.trim(),
                location:
                  formData.location.trim(),
                manager:
                  formData.manager.trim(),
                startDate:
                  formData.startDate,
                endDate:
                  formData.endDate,
                budget:
                  Number(formData.budget),
                status:
                  formData.status,
              }
            : project
        )
      );
    } else {
      const newProject = {
        id: Date.now(),
        name: formData.name.trim(),
        client: formData.client.trim(),
        location:
          formData.location.trim(),
        manager:
          formData.manager.trim(),
        startDate:
          formData.startDate,
        endDate:
          formData.endDate,
        budget:
          Number(formData.budget),
        status:
          formData.status,
      };

      setProjects((currentProjects) => [
        ...currentProjects,
        newProject,
      ]);
    }

    closeModal();
  };

  const deleteProject = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) {
      return;
    }

    setProjects((currentProjects) =>
      currentProjects.filter(
        (project) => project.id !== id
      )
    );
  };

  const filteredProjects = projects.filter(
    (project) => {
      const searchText =
        search.toLowerCase();

      const matchesSearch =
        String(project.name || "")
          .toLowerCase()
          .includes(searchText) ||
        String(project.client || "")
          .toLowerCase()
          .includes(searchText) ||
        String(project.location || "")
          .toLowerCase()
          .includes(searchText) ||
        String(project.manager || "")
          .toLowerCase()
          .includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        project.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    }
  );

  const getStatusStyle = (status) => {
    if (status === "Completed") {
      return "bg-green-100 text-green-700";
    }

    if (status === "In Progress") {
      return "bg-blue-100 text-blue-700";
    }

    if (status === "On Hold") {
      return "bg-yellow-100 text-yellow-700";
    }

    return "bg-slate-100 text-slate-700";
  };

  const totalBudget = projects.reduce(
    (total, project) =>
      total + Number(project.budget || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-sm text-orange-500 font-semibold uppercase tracking-wide">
            Construction Management
          </p>

          <h1 className="text-3xl font-bold text-slate-800 mt-1">
            Projects
          </h1>

          <p className="text-slate-500 mt-1">
            Manage construction projects,
            budgets, schedules, and teams.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-lg font-semibold transition"
        >
          + Add Project
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Projects
          </p>

          <h2 className="text-3xl font-bold text-slate-800 mt-2">
            {projects.length}
          </h2>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            In Progress
          </p>

          <h2 className="text-3xl font-bold text-blue-600 mt-2">
            {
              projects.filter(
                (project) =>
                  project.status ===
                  "In Progress"
              ).length
            }
          </h2>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Completed
          </p>

          <h2 className="text-3xl font-bold text-green-600 mt-2">
            {
              projects.filter(
                (project) =>
                  project.status ===
                  "Completed"
              ).length
            }
          </h2>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Budget
          </p>

          <h2 className="text-2xl font-bold text-orange-600 mt-2">
            {formatCurrency(totalBudget)}
          </h2>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Search Projects
            </label>

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search project, client, location, or manager..."
              className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Project Status
            </label>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value
                )
              }
              className="w-full border border-slate-300 rounded-lg px-4 py-3"
            >
              <option value="All">
                All Statuses
              </option>

              <option value="Planning">
                Planning
              </option>

              <option value="In Progress">
                In Progress
              </option>

              <option value="Completed">
                Completed
              </option>

              <option value="On Hold">
                On Hold
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Project
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Client
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Location
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Manager
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Schedule
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Budget
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
              {filteredProjects.map((project) => (
                <tr
                  key={project.id}
                  className="border-b border-slate-100 hover:bg-slate-50"
                >
                  <td className="px-6 py-5">
                    <p className="font-semibold text-slate-800">
                      {project.name}
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      Project #{project.id}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-sm text-slate-600">
                      {project.client}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-sm text-slate-600">
                      📍 {project.location}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-sm text-slate-600">
                      👷 {project.manager}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-sm text-slate-600">
                      {project.startDate}
                    </p>

                    <p className="text-xs text-slate-400 mt-1">
                      to {project.endDate}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-sm font-semibold text-slate-800">
                      {formatCurrency(
                        project.budget
                      )}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                        project.status
                      )}`}
                    >
                      {project.status}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() =>
                          openEditModal(project)
                        }
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-sm font-medium"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          deleteProject(
                            project.id
                          )
                        }
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

        {filteredProjects.length === 0 && (
          <div className="p-12 text-center">
            <div className="text-5xl mb-4">
              🏗️
            </div>

            <h2 className="text-xl font-semibold text-slate-700">
              No projects found
            </h2>

            <p className="text-slate-500 mt-2">
              Try changing your search or
              status filter.
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  {editingProjectId
                    ? "Edit Project"
                    : "Add New Project"}
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Manage construction project
                  information.
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
            <form
              onSubmit={handleSubmit}
              className="p-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Project Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Project Name *
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Green Valley Apartment"
                    className={`w-full border rounded-lg px-4 py-3 ${
                      errors.name
                        ? "border-red-500"
                        : "border-slate-300"
                    }`}
                  />

                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Client */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Client *
                  </label>

                  <input
                    type="text"
                    name="client"
                    value={formData.client}
                    onChange={handleInputChange}
                    placeholder="e.g. Green Valley Holdings"
                    className={`w-full border rounded-lg px-4 py-3 ${
                      errors.client
                        ? "border-red-500"
                        : "border-slate-300"
                    }`}
                  />

                  {errors.client && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.client}
                    </p>
                  )}
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Location *
                  </label>

                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g. Colombo"
                    className={`w-full border rounded-lg px-4 py-3 ${
                      errors.location
                        ? "border-red-500"
                        : "border-slate-300"
                    }`}
                  />

                  {errors.location && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.location}
                    </p>
                  )}
                </div>

                {/* Manager */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Project Manager *
                  </label>

                  <input
                    type="text"
                    name="manager"
                    value={formData.manager}
                    onChange={handleInputChange}
                    placeholder="e.g. Kamal Perera"
                    className={`w-full border rounded-lg px-4 py-3 ${
                      errors.manager
                        ? "border-red-500"
                        : "border-slate-300"
                    }`}
                  />

                  {errors.manager && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.manager}
                    </p>
                  )}
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
                    <option value="Planning">
                      Planning
                    </option>

                    <option value="In Progress">
                      In Progress
                    </option>

                    <option value="Completed">
                      Completed
                    </option>

                    <option value="On Hold">
                      On Hold
                    </option>
                  </select>
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Start Date *
                  </label>

                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className={`w-full border rounded-lg px-4 py-3 ${
                      errors.startDate
                        ? "border-red-500"
                        : "border-slate-300"
                    }`}
                  />

                  {errors.startDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.startDate}
                    </p>
                  )}
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    End Date *
                  </label>

                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className={`w-full border rounded-lg px-4 py-3 ${
                      errors.endDate
                        ? "border-red-500"
                        : "border-slate-300"
                    }`}
                  />

                  {errors.endDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.endDate}
                    </p>
                  )}
                </div>

                {/* Budget */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Project Budget (LKR) *
                  </label>

                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    min="1"
                    placeholder="e.g. 45000000"
                    className={`w-full border rounded-lg px-4 py-3 ${
                      errors.budget
                        ? "border-red-500"
                        : "border-slate-300"
                    }`}
                  />

                  {errors.budget && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.budget}
                    </p>
                  )}
                </div>
              </div>

              {/* Budget Preview */}
              {formData.budget !== "" && (
                <div className="mt-6 bg-slate-50 rounded-xl p-5">
                  <p className="text-sm text-slate-500">
                    Project Budget
                  </p>

                  <p className="text-2xl font-bold text-orange-600 mt-1">
                    {formatCurrency(
                      formData.budget
                    )}
                  </p>
                </div>
              )}

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
                  {editingProjectId
                    ? "Save Changes"
                    : "Add Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Projects;