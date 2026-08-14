import { useEffect, useState } from "react";

function Materials() {
  const [materials, setMaterials] = useState(() => {
    const savedMaterials = localStorage.getItem(
      "constructionMaterials"
    );

    return savedMaterials
      ? JSON.parse(savedMaterials)
      : [
          {
            id: 1,
            projectId: 1,
            name: "Cement",
            category: "Building Materials",
            quantity: 120,
            minimumStock: 50,
            unit: "Bags",
            unitCost: 1850,
          },
          {
            id: 2,
            projectId: 1,
            name: "Steel Rods",
            category: "Structural Materials",
            quantity: 85,
            minimumStock: 40,
            unit: "Pieces",
            unitCost: 4200,
          },
          {
            id: 3,
            projectId: 2,
            name: "Bricks",
            category: "Building Materials",
            quantity: 2500,
            minimumStock: 1000,
            unit: "Pieces",
            unitCost: 45,
          },
          {
            id: 4,
            projectId: 3,
            name: "Floor Tiles",
            category: "Finishing Materials",
            quantity: 320,
            minimumStock: 400,
            unit: "Boxes",
            unitCost: 2850,
          },
        ];
  });

  const [projects, setProjects] = useState([]);

  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [editingMaterialId, setEditingMaterialId] = useState(null);
  const [errors, setErrors] = useState({});

  const emptyForm = {
    projectId: "",
    name: "",
    category: "Building Materials",
    quantity: "",
    minimumStock: "",
    unit: "Bags",
    unitCost: "",
  };

  const [formData, setFormData] = useState(emptyForm);

  // Load projects
  useEffect(() => {
    const savedProjects = localStorage.getItem(
      "constructionProjects"
    );

    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
  }, []);

  // Save materials
  useEffect(() => {
    localStorage.setItem(
      "constructionMaterials",
      JSON.stringify(materials)
    );
  }, [materials]);

  // Get project name
  const getProjectName = (projectId) => {
    const project = projects.find(
      (item) =>
        String(item.id) === String(projectId)
    );

    return project
      ? project.name
      : "Unknown Project";
  };

  // Stock status
  const getStockStatus = (material) => {
    const quantity = Number(material.quantity);
    const minimumStock = Number(material.minimumStock);

    if (quantity <= 0) {
      return "Out of Stock";
    }

    if (quantity <= minimumStock) {
      return "Low Stock";
    }

    return "In Stock";
  };

  // Stock style
  const getStockStyle = (status) => {
    if (status === "Out of Stock") {
      return "bg-red-100 text-red-700";
    }

    if (status === "Low Stock") {
      return "bg-yellow-100 text-yellow-700";
    }

    return "bg-green-100 text-green-700";
  };

  // Currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      maximumFractionDigits: 0,
    }).format(Number(amount) || 0);
  };

  // Material value
  const calculateMaterialValue = (material) => {
    return (
      Number(material.quantity) *
      Number(material.unitCost)
    );
  };

  // Input change
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

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.projectId) {
      newErrors.projectId =
        "Please select a project.";
    }

    if (!formData.name.trim()) {
      newErrors.name =
        "Material name is required.";
    } else if (formData.name.trim().length < 2) {
      newErrors.name =
        "Material name must be at least 2 characters.";
    }

    if (
      formData.quantity === "" ||
      Number(formData.quantity) < 0
    ) {
      newErrors.quantity =
        "Quantity cannot be negative.";
    }

    if (
      formData.minimumStock === "" ||
      Number(formData.minimumStock) < 0
    ) {
      newErrors.minimumStock =
        "Minimum stock cannot be negative.";
    }

    if (
      formData.unitCost === "" ||
      Number(formData.unitCost) <= 0
    ) {
      newErrors.unitCost =
        "Unit cost must be greater than 0.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Open Add Modal
  const openAddModal = () => {
    setEditingMaterialId(null);

    setFormData({
      ...emptyForm,
      projectId:
        projects.length > 0
          ? String(projects[0].id)
          : "",
    });

    setErrors({});
    setShowModal(true);
  };

  // Open Edit Modal
  const openEditModal = (material) => {
    setEditingMaterialId(material.id);

    setFormData({
      projectId: String(material.projectId ?? ""),
      name: material.name ?? "",
      category:
        material.category ?? "Building Materials",
      quantity: String(material.quantity ?? ""),
      minimumStock: String(
        material.minimumStock ?? ""
      ),
      unit: material.unit ?? "Bags",
      unitCost: String(material.unitCost ?? ""),
    });

    setErrors({});
    setShowModal(true);
  };

  // Close Modal
  const closeModal = () => {
    setShowModal(false);
    setEditingMaterialId(null);
    setFormData({ ...emptyForm });
    setErrors({});
  };

  // Submit Add/Edit
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const updatedMaterial = {
      projectId: Number(formData.projectId),
      name: formData.name.trim(),
      category: formData.category,
      quantity: Number(formData.quantity),
      minimumStock: Number(formData.minimumStock),
      unit: formData.unit,
      unitCost: Number(formData.unitCost),
    };

    // EDIT
    if (editingMaterialId !== null) {
      setMaterials((currentMaterials) =>
        currentMaterials.map((material) =>
          material.id === editingMaterialId
            ? {
                ...material,
                ...updatedMaterial,
              }
            : material
        )
      );
    }

    // ADD
    else {
      const newMaterial = {
        id: Date.now(),
        ...updatedMaterial,
      };

      setMaterials((currentMaterials) => [
        ...currentMaterials,
        newMaterial,
      ]);
    }

    closeModal();
  };

  // Delete
  const deleteMaterial = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this material?"
    );

    if (!confirmed) {
      return;
    }

    setMaterials((currentMaterials) =>
      currentMaterials.filter(
        (material) => material.id !== id
      )
    );
  };

  // Filter
  const filteredMaterials = materials.filter(
    (material) => {
      const searchText = search.toLowerCase();

      const materialName = String(
        material.name || ""
      ).toLowerCase();

      const category = String(
        material.category || ""
      ).toLowerCase();

      const projectName = String(
        getProjectName(material.projectId) || ""
      ).toLowerCase();

      const matchesSearch =
        materialName.includes(searchText) ||
        category.includes(searchText) ||
        projectName.includes(searchText);

      const stockStatus =
        getStockStatus(material);

      const matchesStock =
        stockFilter === "All" ||
        stockStatus === stockFilter;

      return (
        matchesSearch &&
        matchesStock
      );
    }
  );

  // Low stock materials
  const lowStockMaterials = materials.filter(
    (material) => {
      const status = getStockStatus(material);

      return (
        status === "Low Stock" ||
        status === "Out of Stock"
      );
    }
  );

  // Total inventory value
  const totalInventoryValue =
    materials.reduce(
      (total, material) =>
        total +
        calculateMaterialValue(material),
      0
    );

  // Material insight
  const getMaterialInsight = (material) => {
    const quantity = Number(material.quantity);

    const minimumStock = Number(
      material.minimumStock
    );

    if (quantity <= 0) {
      return {
        type: "danger",
        title: "Immediate Restock Required",
        message: `${material.name} is currently out of stock. Consider purchasing additional stock before construction work is affected.`,
      };
    }

    if (quantity <= minimumStock) {
      return {
        type: "warning",
        title: "Low Stock Warning",
        message: `${material.name} has reached its minimum stock level. Consider restocking before the next construction phase.`,
      };
    }

    return {
      type: "success",
      title: "Stock Level Healthy",
      message: `${material.name} currently has sufficient stock based on the configured minimum level.`,
    };
  };

  // Insight style
  const getInsightStyle = (type) => {
    if (type === "danger") {
      return {
        container:
          "bg-red-50 border-red-200",
        icon: "!",
        iconStyle:
          "bg-red-100 text-red-700",
        title: "text-red-800",
        text: "text-red-700",
      };
    }

    if (type === "warning") {
      return {
        container:
          "bg-yellow-50 border-yellow-200",
        icon: "!",
        iconStyle:
          "bg-yellow-100 text-yellow-700",
        title: "text-yellow-800",
        text: "text-yellow-700",
      };
    }

    return {
      container:
        "bg-green-50 border-green-200",
      icon: "✓",
      iconStyle:
        "bg-green-100 text-green-700",
      title: "text-green-800",
      text: "text-green-700",
    };
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
            Materials & Inventory
          </h1>

          <p className="text-slate-500 mt-1">
            Manage construction materials,
            stock levels, and inventory value.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-lg font-semibold transition"
        >
          + Add Material
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Materials
          </p>

          <h2 className="text-3xl font-bold text-slate-800 mt-2">
            {materials.length}
          </h2>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            In Stock
          </p>

          <h2 className="text-3xl font-bold text-green-600 mt-2">
            {
              materials.filter(
                (material) =>
                  getStockStatus(material) ===
                  "In Stock"
              ).length
            }
          </h2>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Low / Out of Stock
          </p>

          <h2 className="text-3xl font-bold text-yellow-600 mt-2">
            {lowStockMaterials.length}
          </h2>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Inventory Value
          </p>

          <h2 className="text-2xl font-bold text-blue-600 mt-2">
            {formatCurrency(
              totalInventoryValue
            )}
          </h2>
        </div>

      </div>

      {/* Smart Inventory Alert */}
      {lowStockMaterials.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">
          <div className="flex gap-4">

            <div className="w-11 h-11 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-lg">
              🤖
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-orange-600">
                Smart Inventory Insight
              </p>

              <h2 className="text-lg font-bold text-orange-800 mt-1">
                {lowStockMaterials.length} material
                {lowStockMaterials.length !== 1
                  ? "s"
                  : ""}{" "}
                require attention
              </h2>

              <p className="text-sm text-orange-700 mt-1">
                The system detected materials
                that have reached or fallen below
                their minimum stock levels.
                Consider restocking them before
                construction activities are
                affected.
              </p>
            </div>

          </div>
        </div>
      )}

      {/* Search & Filter */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Search Materials
            </label>

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search material, category, or project..."
              className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Stock Status
            </label>

            <select
              value={stockFilter}
              onChange={(event) =>
                setStockFilter(event.target.value)
              }
              className="w-full border border-slate-300 rounded-lg px-4 py-3"
            >
              <option value="All">
                All Stock
              </option>

              <option value="In Stock">
                In Stock
              </option>

              <option value="Low Stock">
                Low Stock
              </option>

              <option value="Out of Stock">
                Out of Stock
              </option>
            </select>
          </div>

        </div>

      </div>

      {/* Materials Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1000px]">

            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>

                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Material
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Project
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Quantity
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Unit Cost
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Total Value
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Stock
                </th>

                <th className="text-right px-6 py-4 text-sm font-semibold text-slate-600">
                  Actions
                </th>

              </tr>
            </thead>

            <tbody>

              {filteredMaterials.map((material) => {

                const stockStatus =
                  getStockStatus(material);

                return (
                  <tr
                    key={material.id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >

                    <td className="px-6 py-5">
                      <p className="font-semibold text-slate-800">
                        {material.name}
                      </p>

                      <p className="text-xs text-slate-500 mt-1">
                        {material.category}
                      </p>
                    </td>

                    <td className="px-6 py-5">
                      <p className="text-sm text-slate-600">
                        {getProjectName(
                          material.projectId
                        )}
                      </p>
                    </td>

                    <td className="px-6 py-5">
                      <p className="text-sm font-semibold text-slate-800">
                        {Number(
                          material.quantity
                        ).toLocaleString()}{" "}
                        {material.unit}
                      </p>

                      <p className="text-xs text-slate-500 mt-1">
                        Minimum:{" "}
                        {material.minimumStock}
                      </p>
                    </td>

                    <td className="px-6 py-5">
                      <p className="text-sm text-slate-600">
                        {formatCurrency(
                          material.unitCost
                        )}
                      </p>
                    </td>

                    <td className="px-6 py-5">
                      <p className="text-sm font-semibold text-slate-800">
                        {formatCurrency(
                          calculateMaterialValue(
                            material
                          )
                        )}
                      </p>
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStockStyle(
                          stockStatus
                        )}`}
                      >
                        {stockStatus}
                      </span>
                    </td>

                    <td className="px-6 py-5">

                      <div className="flex justify-end gap-2">

                        <button
                          type="button"
                          onClick={() =>
                            openEditModal(material)
                          }
                          className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-sm font-medium"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            deleteMaterial(
                              material.id
                            )
                          }
                          className="px-3 py-2 border border-red-200 hover:bg-red-50 text-red-600 rounded-lg text-sm font-medium"
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>
                );
              })}

            </tbody>

          </table>

        </div>

        {filteredMaterials.length === 0 && (
          <div className="p-12 text-center">

            <div className="text-5xl mb-4">
              🧱
            </div>

            <h2 className="text-xl font-semibold text-slate-700">
              No materials found
            </h2>

            <p className="text-slate-500 mt-2">
              Try changing your search or
              stock filter.
            </p>

          </div>
        )}

      </div>

      {/* Smart Material Insights */}
      {materials.length > 0 && (
        <div>

          <div className="mb-4">

            <p className="text-sm text-orange-500 font-semibold uppercase tracking-wide">
              Smart Recommendations
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mt-1">
              Material Stock Analysis
            </h2>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            {materials
              .filter(
                (material) =>
                  getStockStatus(material) !==
                  "In Stock"
              )
              .map((material) => {

                const insight =
                  getMaterialInsight(material);

                const styles =
                  getInsightStyle(
                    insight.type
                  );

                return (
                  <div
                    key={material.id}
                    className={`border rounded-xl p-5 ${styles.container}`}
                  >

                    <div className="flex gap-4">

                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${styles.iconStyle}`}
                      >
                        {styles.icon}
                      </div>

                      <div>

                        <p className="text-xs font-bold uppercase tracking-wide">
                          Smart Recommendation
                        </p>

                        <h3
                          className={`text-lg font-bold mt-1 ${styles.title}`}
                        >
                          {insight.title}
                        </h3>

                        <p
                          className={`text-sm mt-1 leading-6 ${styles.text}`}
                        >
                          {insight.message}
                        </p>

                        <p className="text-xs mt-3 font-medium opacity-80">
                          Project:{" "}
                          {getProjectName(
                            material.projectId
                          )}
                        </p>

                      </div>

                    </div>

                  </div>
                );
              })}

          </div>

        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">

              <div>

                <h2 className="text-2xl font-bold text-slate-800">
                  {editingMaterialId !== null
                    ? "Edit Material"
                    : "Add New Material"}
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Manage construction material
                  inventory.
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

                {/* Material Name */}
                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Material Name *
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Cement"
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

                {/* Category */}
                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Category
                  </label>

                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-lg px-4 py-3"
                  >

                    <option value="Building Materials">
                      Building Materials
                    </option>

                    <option value="Structural Materials">
                      Structural Materials
                    </option>

                    <option value="Finishing Materials">
                      Finishing Materials
                    </option>

                    <option value="Electrical Materials">
                      Electrical Materials
                    </option>

                    <option value="Plumbing Materials">
                      Plumbing Materials
                    </option>

                  </select>

                </div>

                {/* Quantity */}
                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Current Quantity *
                  </label>

                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    min="0"
                    placeholder="e.g. 100"
                    className={`w-full border rounded-lg px-4 py-3 ${
                      errors.quantity
                        ? "border-red-500"
                        : "border-slate-300"
                    }`}
                  />

                  {errors.quantity && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.quantity}
                    </p>
                  )}

                </div>

                {/* Minimum Stock */}
                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Minimum Stock *
                  </label>

                  <input
                    type="number"
                    name="minimumStock"
                    value={formData.minimumStock}
                    onChange={handleInputChange}
                    min="0"
                    placeholder="e.g. 50"
                    className={`w-full border rounded-lg px-4 py-3 ${
                      errors.minimumStock
                        ? "border-red-500"
                        : "border-slate-300"
                    }`}
                  />

                  {errors.minimumStock && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.minimumStock}
                    </p>
                  )}

                </div>

                {/* Unit */}
                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Unit
                  </label>

                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    className="w-full border border-slate-300 rounded-lg px-4 py-3"
                  >

                    <option value="Bags">
                      Bags
                    </option>

                    <option value="Pieces">
                      Pieces
                    </option>

                    <option value="Boxes">
                      Boxes
                    </option>

                    <option value="Kg">
                      Kg
                    </option>

                    <option value="Tonnes">
                      Tonnes
                    </option>

                    <option value="Litres">
                      Litres
                    </option>

                    <option value="Meters">
                      Meters
                    </option>

                  </select>

                </div>

                {/* Unit Cost */}
                <div>

                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Unit Cost (LKR) *
                  </label>

                  <input
                    type="number"
                    name="unitCost"
                    value={formData.unitCost}
                    onChange={handleInputChange}
                    min="1"
                    placeholder="e.g. 1850"
                    className={`w-full border rounded-lg px-4 py-3 ${
                      errors.unitCost
                        ? "border-red-500"
                        : "border-slate-300"
                    }`}
                  />

                  {errors.unitCost && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.unitCost}
                    </p>
                  )}

                </div>

              </div>

              {/* Preview */}
              {formData.quantity !== "" &&
                formData.unitCost !== "" && (
                  <div className="mt-6 bg-slate-50 rounded-xl p-5">

                    <p className="text-sm text-slate-500">
                      Estimated Inventory Value
                    </p>

                    <p className="text-2xl font-bold text-blue-600 mt-1">
                      {formatCurrency(
                        Number(formData.quantity) *
                          Number(formData.unitCost)
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
                  {editingMaterialId !== null
                    ? "Save Changes"
                    : "Add Material"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default Materials;