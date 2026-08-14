import { useEffect, useMemo, useState } from "react";

function Workers() {
  const emptyForm = {
    name: "",
    role: "Site Worker",
    phone: "",
    email: "",
    project: "",
    availability: "Available",
    experience: "",
    salary: "",
  };

  const [workers, setWorkers] = useState(() => {
    const savedWorkers = localStorage.getItem(
      "constructionWorkers"
    );

    return savedWorkers
      ? JSON.parse(savedWorkers)
      : [];
  });

  const [projects, setProjects] = useState([]);

  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const [showModal, setShowModal] = useState(false);
  const [editingWorkerId, setEditingWorkerId] =
    useState(null);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] =
    useState("All");
  const [availabilityFilter, setAvailabilityFilter] =
    useState("All");

  useEffect(() => {
    localStorage.setItem(
      "constructionWorkers",
      JSON.stringify(workers)
    );
  }, [workers]);

  useEffect(() => {
    const savedProjects = localStorage.getItem(
      "constructionProjects"
    );

    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
  }, []);

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
      newErrors.name = "Worker name is required.";
    } else if (formData.name.trim().length < 3) {
      newErrors.name =
        "Worker name must be at least 3 characters.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone =
        "Phone number is required.";
    } else if (
      !/^[0-9+\-\s]{7,15}$/.test(
        formData.phone.trim()
      )
    ) {
      newErrors.phone =
        "Please enter a valid phone number.";
    }

    if (
      formData.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email.trim()
      )
    ) {
      newErrors.email =
        "Please enter a valid email address.";
    }

    if (!formData.experience) {
      newErrors.experience =
        "Experience is required.";
    } else if (Number(formData.experience) < 0) {
      newErrors.experience =
        "Experience cannot be negative.";
    }

    if (!formData.salary) {
      newErrors.salary =
        "Monthly salary is required.";
    } else if (Number(formData.salary) <= 0) {
      newErrors.salary =
        "Salary must be greater than zero.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const openAddModal = () => {
    setEditingWorkerId(null);
    setFormData(emptyForm);
    setErrors({});
    setShowModal(true);
  };

  const openEditModal = (worker) => {
    setEditingWorkerId(worker.id);

    setFormData({
      name: worker.name || "",
      role: worker.role || "Site Worker",
      phone: worker.phone || "",
      email: worker.email || "",
      project: worker.project || "",
      availability:
        worker.availability || "Available",
      experience: worker.experience || "",
      salary: worker.salary || "",
    });

    setErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingWorkerId(null);
    setFormData(emptyForm);
    setErrors({});
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const workerData = {
      name: formData.name.trim(),
      role: formData.role,
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      project: formData.project,
      availability: formData.availability,
      experience: Number(formData.experience),
      salary: Number(formData.salary),
    };

    if (editingWorkerId) {
      setWorkers((currentWorkers) =>
        currentWorkers.map((worker) =>
          worker.id === editingWorkerId
            ? {
                ...worker,
                ...workerData,
              }
            : worker
        )
      );
    } else {
      const newWorker = {
        id: Date.now(),
        ...workerData,
        createdAt: new Date().toISOString(),
      };

      setWorkers((currentWorkers) => [
        ...currentWorkers,
        newWorker,
      ]);
    }

    closeModal();
  };

  const deleteWorker = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this worker?"
    );

    if (!confirmed) {
      return;
    }

    setWorkers((currentWorkers) =>
      currentWorkers.filter(
        (worker) => worker.id !== id
      )
    );
  };

  const filteredWorkers = useMemo(() => {
    return workers.filter((worker) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        worker.name
          .toLowerCase()
          .includes(searchText) ||
        worker.role
          .toLowerCase()
          .includes(searchText) ||
        worker.project
          .toLowerCase()
          .includes(searchText);

      const matchesRole =
        roleFilter === "All" ||
        worker.role === roleFilter;

      const matchesAvailability =
        availabilityFilter === "All" ||
        worker.availability ===
          availabilityFilter;

      return (
        matchesSearch &&
        matchesRole &&
        matchesAvailability
      );
    });
  }, [
    workers,
    search,
    roleFilter,
    availabilityFilter,
  ]);

  const totalWorkers = workers.length;

  const availableWorkers = workers.filter(
    (worker) =>
      worker.availability === "Available"
  ).length;

  const assignedWorkers = workers.filter(
    (worker) =>
      worker.availability === "Assigned"
  ).length;

  const unavailableWorkers = workers.filter(
    (worker) =>
      worker.availability === "Unavailable"
  ).length;

  const totalMonthlySalary = workers.reduce(
    (total, worker) =>
      total + Number(worker.salary),
    0
  );

  const roleOptions = [
    "Site Manager",
    "Site Engineer",
    "Supervisor",
    "Mason",
    "Electrician",
    "Plumber",
    "Carpenter",
    "Site Worker",
  ];

  const getAvailabilityStyle = (
    availability
  ) => {
    if (availability === "Available") {
      return "bg-green-100 text-green-700";
    }

    if (availability === "Assigned") {
      return "bg-blue-100 text-blue-700";
    }

    return "bg-red-100 text-red-700";
  };

  const getRoleStyle = (role) => {
    if (
      role === "Site Manager" ||
      role === "Site Engineer"
    ) {
      return "bg-purple-100 text-purple-700";
    }

    if (role === "Supervisor") {
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
            Workers Management
          </h1>

          <p className="text-slate-500 mt-1">
            Manage construction workers, roles,
            assignments and availability.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-lg font-semibold transition"
        >
          + Add Worker
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <p className="text-sm text-slate-500">
            Total Workers
          </p>

          <h2 className="text-3xl font-bold text-slate-800 mt-2">
            {totalWorkers}
          </h2>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <p className="text-sm text-slate-500">
            Available
          </p>

          <h2 className="text-3xl font-bold text-green-600 mt-2">
            {availableWorkers}
          </h2>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <p className="text-sm text-slate-500">
            Assigned
          </p>

          <h2 className="text-3xl font-bold text-blue-600 mt-2">
            {assignedWorkers}
          </h2>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <p className="text-sm text-slate-500">
            Unavailable
          </p>

          <h2 className="text-3xl font-bold text-red-500 mt-2">
            {unavailableWorkers}
          </h2>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <p className="text-sm text-slate-500">
            Monthly Payroll
          </p>

          <h2 className="text-xl font-bold text-purple-600 mt-2">
            Rs.{" "}
            {totalMonthlySalary.toLocaleString()}
          </h2>
        </div>
      </div>

      {/* Smart Worker Insight */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
        <div className="flex gap-3">
          <div className="text-2xl">
            🤖
          </div>

          <div>
            <h3 className="font-bold text-blue-800">
              Smart Workforce Insight
            </h3>

            {totalWorkers === 0 ? (
              <p className="text-sm text-blue-700 mt-1">
                Add workers to start monitoring workforce
                availability and assignments.
              </p>
            ) : availableWorkers > 0 ? (
              <p className="text-sm text-blue-700 mt-1">
                <strong>
                  {availableWorkers}
                </strong>{" "}
                worker
                {availableWorkers > 1
                  ? "s are"
                  : " is"}{" "}
                currently available for new construction
                tasks.
              </p>
            ) : (
              <p className="text-sm text-blue-700 mt-1">
                All workers are currently assigned or
                unavailable. Consider reviewing workforce
                allocation before assigning new tasks.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-2">
              Search
            </label>

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search worker, role or project..."
              className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-2">
              Role
            </label>

            <select
              value={roleFilter}
              onChange={(event) =>
                setRoleFilter(event.target.value)
              }
              className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="All">
                All Roles
              </option>

              {roleOptions.map((role) => (
                <option
                  key={role}
                  value={role}
                >
                  {role}
                </option>
              ))}
            </select>
          </div>

          {/* Availability */}
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-2">
              Availability
            </label>

            <select
              value={availabilityFilter}
              onChange={(event) =>
                setAvailabilityFilter(
                  event.target.value
                )
              }
              className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="All">
                All Availability
              </option>

              <option value="Available">
                Available
              </option>

              <option value="Assigned">
                Assigned
              </option>

              <option value="Unavailable">
                Unavailable
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Workers Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px]">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Worker
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Role
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Contact
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Project
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Experience
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Availability
                </th>

                <th className="text-right px-6 py-4 text-sm font-semibold text-slate-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredWorkers.map((worker) => (
                <tr
                  key={worker.id}
                  className="border-b border-slate-100 hover:bg-slate-50 transition"
                >
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-800">
                      {worker.name}
                    </p>

                    <p className="text-xs text-slate-400 mt-1">
                      Monthly: Rs.{" "}
                      {Number(
                        worker.salary
                      ).toLocaleString()}
                    </p>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleStyle(
                        worker.role
                      )}`}
                    >
                      {worker.role}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-700">
                      {worker.phone}
                    </p>

                    <p className="text-xs text-slate-400 mt-1">
                      {worker.email ||
                        "No email"}
                    </p>
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {worker.project ||
                      "Unassigned"}
                  </td>

                  <td className="px-6 py-4">
                    <span className="font-semibold text-slate-700">
                      {worker.experience}{" "}
                      {Number(worker.experience) ===
                      1
                        ? "year"
                        : "years"}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getAvailabilityStyle(
                        worker.availability
                      )}`}
                    >
                      {worker.availability}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() =>
                          openEditModal(worker)
                        }
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-sm font-medium transition"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          deleteWorker(worker.id)
                        }
                        className="px-3 py-2 border border-red-200 hover:bg-red-50 text-red-600 rounded-lg text-sm font-medium transition"
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

        {filteredWorkers.length === 0 && (
          <div className="p-12 text-center">
            <div className="text-4xl mb-3">
              👷
            </div>

            <h2 className="text-xl font-semibold text-slate-700">
              No workers found
            </h2>

            <p className="text-slate-500 mt-2">
              Try changing your filters or add a new
              worker.
            </p>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  {editingWorkerId
                    ? "Edit Worker"
                    : "Add New Worker"}
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  {editingWorkerId
                    ? "Update worker information."
                    : "Add a worker to the construction workforce."}
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
                {/* Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Worker Name *
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Kamal Perera"
                    className={`w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400 ${
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

                {/* Role */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Role
                  </label>

                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400"
                  >
                    {roleOptions.map((role) => (
                      <option
                        key={role}
                        value={role}
                      >
                        {role}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Phone *
                  </label>

                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g. 0771234567"
                    className={`w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400 ${
                      errors.phone
                        ? "border-red-500"
                        : "border-slate-300"
                    }`}
                  />

                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="worker@example.com"
                    className={`w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400 ${
                      errors.email
                        ? "border-red-500"
                        : "border-slate-300"
                    }`}
                  />

                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Project */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Assigned Project
                  </label>

                  <select
                    name="project"
                    value={formData.project}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400"
                  >
                    <option value="">
                      Unassigned
                    </option>

                    {projects.map((project) => (
                      <option
                        key={project.id}
                        value={project.name}
                      >
                        {project.name}
                      </option>
                    ))}
                  </select>

                  {projects.length === 0 && (
                    <p className="text-xs text-slate-400 mt-1">
                      No projects available yet.
                    </p>
                  )}
                </div>

                {/* Availability */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Availability
                  </label>

                  <select
                    name="availability"
                    value={formData.availability}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400"
                  >
                    <option value="Available">
                      Available
                    </option>

                    <option value="Assigned">
                      Assigned
                    </option>

                    <option value="Unavailable">
                      Unavailable
                    </option>
                  </select>
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Experience (Years) *
                  </label>

                  <input
                    type="number"
                    min="0"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    placeholder="e.g. 5"
                    className={`w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400 ${
                      errors.experience
                        ? "border-red-500"
                        : "border-slate-300"
                    }`}
                  />

                  {errors.experience && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.experience}
                    </p>
                  )}
                </div>

                {/* Salary */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Monthly Salary (Rs.) *
                  </label>

                  <input
                    type="number"
                    min="0"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    placeholder="e.g. 75000"
                    className={`w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400 ${
                      errors.salary
                        ? "border-red-500"
                        : "border-slate-300"
                    }`}
                  />

                  {errors.salary && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.salary}
                    </p>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-8 pt-5 border-t border-slate-200">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-3 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold transition"
                >
                  {editingWorkerId
                    ? "Save Changes"
                    : "Add Worker"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Workers;