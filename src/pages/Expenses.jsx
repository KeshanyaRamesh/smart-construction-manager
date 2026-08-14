import { useEffect, useState } from "react";

function Expenses() {
  const defaultExpenses = [
    {
      id: 1,
      project: "Luxury Apartment Complex",
      category: "Materials",
      description: "Cement and concrete materials",
      amount: 450000,
      date: "2026-08-01",
    },
    {
      id: 2,
      project: "Shopping Complex",
      category: "Labour",
      description: "Construction worker payments",
      amount: 280000,
      date: "2026-08-03",
    },
    {
      id: 3,
      project: "Modern Office Building",
      category: "Equipment",
      description: "Heavy equipment rental",
      amount: 175000,
      date: "2026-08-05",
    },
  ];

  const [expenses, setExpenses] = useState(() => {
    const savedExpenses = localStorage.getItem("constructionExpenses");

    if (savedExpenses) {
      try {
        const parsedExpenses = JSON.parse(savedExpenses);

        if (Array.isArray(parsedExpenses)) {
          return parsedExpenses.map((expense) => ({
            id: expense.id || Date.now(),
            project: expense.project || "Unknown Project",
            category: expense.category || "Other",
            description: expense.description || "No description",
            amount: Number(expense.amount) || 0,
            date: expense.date || "",
          }));
        }
      } catch (error) {
        console.error("Error loading expenses:", error);
      }
    }

    return defaultExpenses;
  });

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState(null);

  const [selectedExpense, setSelectedExpense] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const [errors, setErrors] = useState({});

  const emptyForm = {
    project: "",
    category: "Materials",
    description: "",
    amount: "",
    date: "",
  };

  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    localStorage.setItem(
      "constructionExpenses",
      JSON.stringify(expenses)
    );
  }, [expenses]);

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

    if (!formData.project.trim()) {
      newErrors.project = "Project name is required.";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required.";
    }

    if (!formData.amount) {
      newErrors.amount = "Expense amount is required.";
    } else if (Number(formData.amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0.";
    }

    if (!formData.date) {
      newErrors.date = "Expense date is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const openAddModal = () => {
    setEditingExpenseId(null);
    setFormData(emptyForm);
    setErrors({});
    setShowModal(true);
  };

  const openEditModal = (expense) => {
    setEditingExpenseId(expense.id);

    setFormData({
      project: expense.project || "",
      category: expense.category || "Other",
      description: expense.description || "",
      amount: expense.amount || "",
      date: expense.date || "",
    });

    setErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingExpenseId(null);
    setFormData(emptyForm);
    setErrors({});
  };

  const openExpenseDetails = (expense) => {
    setSelectedExpense(expense);
    setShowDetails(true);
  };

  const closeExpenseDetails = () => {
    setSelectedExpense(null);
    setShowDetails(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (editingExpenseId) {
      setExpenses((currentExpenses) =>
        currentExpenses.map((expense) =>
          expense.id === editingExpenseId
            ? {
                ...expense,
                project: formData.project.trim(),
                category: formData.category,
                description: formData.description.trim(),
                amount: Number(formData.amount),
                date: formData.date,
              }
            : expense
        )
      );
    } else {
      const newExpense = {
        id: Date.now(),
        project: formData.project.trim(),
        category: formData.category,
        description: formData.description.trim(),
        amount: Number(formData.amount),
        date: formData.date,
      };

      setExpenses((currentExpenses) => [
        ...currentExpenses,
        newExpense,
      ]);
    }

    closeModal();
  };

  const deleteExpense = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this expense?"
    );

    if (!confirmed) return;

    setExpenses((currentExpenses) =>
      currentExpenses.filter((expense) => expense.id !== id)
    );

    if (selectedExpense?.id === id) {
      closeExpenseDetails();
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      maximumFractionDigits: 0,
    }).format(Number(amount) || 0);
  };

  const getCategoryStyle = (category) => {
    if (category === "Materials") {
      return "bg-orange-100 text-orange-700";
    }

    if (category === "Labour") {
      return "bg-blue-100 text-blue-700";
    }

    if (category === "Equipment") {
      return "bg-purple-100 text-purple-700";
    }

    if (category === "Transport") {
      return "bg-green-100 text-green-700";
    }

    return "bg-slate-100 text-slate-700";
  };

  const safeExpenses = expenses.map((expense) => ({
    ...expense,
    project: expense.project || "Unknown Project",
    category: expense.category || "Other",
    description: expense.description || "No description",
    amount: Number(expense.amount) || 0,
    date: expense.date || "",
  }));

  const filteredExpenses = safeExpenses.filter((expense) => {
    const searchValue = search.toLowerCase().trim();

    const projectName = String(expense.project || "").toLowerCase();
    const description = String(
      expense.description || ""
    ).toLowerCase();
    const category = String(
      expense.category || ""
    ).toLowerCase();

    const matchesSearch =
      projectName.includes(searchValue) ||
      description.includes(searchValue) ||
      category.includes(searchValue);

    const matchesCategory =
      categoryFilter === "All" ||
      expense.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const totalExpenses = safeExpenses.reduce(
    (total, expense) => total + Number(expense.amount || 0),
    0
  );

  const materialExpenses = safeExpenses
    .filter((expense) => expense.category === "Materials")
    .reduce(
      (total, expense) => total + Number(expense.amount || 0),
      0
    );

  const labourExpenses = safeExpenses
    .filter((expense) => expense.category === "Labour")
    .reduce(
      (total, expense) => total + Number(expense.amount || 0),
      0
    );

  const equipmentExpenses = safeExpenses
    .filter((expense) => expense.category === "Equipment")
    .reduce(
      (total, expense) => total + Number(expense.amount || 0),
      0
    );

  const getExpenseInsight = () => {
    if (totalExpenses === 0) {
      return {
        type: "info",
        title: "No Expense Data",
        message:
          "Add project expenses to receive smart spending insights.",
      };
    }

    const materialPercentage =
      (materialExpenses / totalExpenses) * 100;

    if (materialPercentage >= 60) {
      return {
        type: "warning",
        title: "High Material Spending",
        message:
          "Material expenses represent a large portion of total spending. Consider monitoring material prices, quantities, and wastage.",
      };
    }

    if (labourExpenses > equipmentExpenses * 2) {
      return {
        type: "info",
        title: "Labour Costs Are High",
        message:
          "Labour expenses are significantly higher than equipment expenses. Review workforce allocation and project schedules.",
      };
    }

    if (equipmentExpenses > totalExpenses * 0.4) {
      return {
        type: "warning",
        title: "High Equipment Spending",
        message:
          "Equipment expenses represent a significant part of total spending. Review rental periods and equipment usage.",
      };
    }

    return {
      type: "success",
      title: "Expense Pattern Looks Stable",
      message:
        "Current expense distribution looks relatively balanced. Continue monitoring project spending regularly.",
    };
  };

  const getInsightStyle = (type) => {
    if (type === "warning") {
      return {
        container: "bg-yellow-50 border-yellow-200",
        icon: "!",
        iconStyle: "bg-yellow-100 text-yellow-700",
        title: "text-yellow-800",
        text: "text-yellow-700",
      };
    }

    if (type === "success") {
      return {
        container: "bg-green-50 border-green-200",
        icon: "✓",
        iconStyle: "bg-green-100 text-green-700",
        title: "text-green-800",
        text: "text-green-700",
      };
    }

    return {
      container: "bg-blue-50 border-blue-200",
      icon: "i",
      iconStyle: "bg-blue-100 text-blue-700",
      title: "text-blue-800",
      text: "text-blue-700",
    };
  };

  const expenseInsight = getExpenseInsight();
  const insightStyle = getInsightStyle(expenseInsight.type);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-sm text-orange-500 font-semibold uppercase tracking-wide">
            Construction Management
          </p>

          <h1 className="text-3xl font-bold text-slate-800 mt-1">
            Expenses
          </h1>

          <p className="text-slate-500 mt-1">
            Track and monitor construction project expenses.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-lg font-semibold transition"
        >
          + Add Expense
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Total Expenses</p>

          <h2 className="text-2xl font-bold text-slate-800 mt-2">
            {formatCurrency(totalExpenses)}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Materials</p>

          <h2 className="text-2xl font-bold text-orange-500 mt-2">
            {formatCurrency(materialExpenses)}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Labour</p>

          <h2 className="text-2xl font-bold text-blue-600 mt-2">
            {formatCurrency(labourExpenses)}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <p className="text-sm text-slate-500">Equipment</p>

          <h2 className="text-2xl font-bold text-purple-600 mt-2">
            {formatCurrency(equipmentExpenses)}
          </h2>
        </div>
      </div>

      {/* Smart Expense Insight */}
      <div
        className={`border rounded-xl p-5 ${insightStyle.container}`}
      >
        <div className="flex gap-4">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${insightStyle.iconStyle}`}
          >
            {insightStyle.icon}
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wide">
              Smart Expense Insight
            </p>

            <h3
              className={`text-lg font-bold mt-1 ${insightStyle.title}`}
            >
              {expenseInsight.title}
            </h3>

            <p
              className={`text-sm mt-1 leading-6 ${insightStyle.text}`}
            >
              {expenseInsight.message}
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Search Expenses
            </label>

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search by project, category or description..."
              className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Filter by Category
            </label>

            <select
              value={categoryFilter}
              onChange={(event) =>
                setCategoryFilter(event.target.value)
              }
              className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="All">All Categories</option>
              <option value="Materials">Materials</option>
              <option value="Labour">Labour</option>
              <option value="Equipment">Equipment</option>
              <option value="Transport">Transport</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Expense Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">
            Expense Records
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            {filteredExpenses.length} expense records found.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Project
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Category
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Description
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Amount
                </th>

                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-600">
                  Date
                </th>

                <th className="text-right px-6 py-4 text-sm font-semibold text-slate-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredExpenses.map((expense) => (
                <tr
                  key={expense.id}
                  className="border-t border-slate-100 hover:bg-slate-50 transition"
                >
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-800">
                      {expense.project}
                    </p>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryStyle(
                        expense.category
                      )}`}
                    >
                      {expense.category}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {expense.description}
                  </td>

                  <td className="px-6 py-4">
                    <span className="font-semibold text-slate-800">
                      {formatCurrency(expense.amount)}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    {expense.date || "—"}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() =>
                          openExpenseDetails(expense)
                        }
                        className="px-3 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 text-sm font-medium"
                      >
                        View
                      </button>

                      <button
                        onClick={() => openEditModal(expense)}
                        className="px-3 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 text-sm font-medium"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          deleteExpense(expense.id)
                        }
                        className="px-3 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 text-sm font-medium"
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

        {filteredExpenses.length === 0 && (
          <div className="p-12 text-center">
            <h2 className="text-xl font-semibold text-slate-700">
              No expenses found
            </h2>

            <p className="text-slate-500 mt-2">
              Try changing your search or category filter.
            </p>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  {editingExpenseId
                    ? "Edit Expense"
                    : "Add New Expense"}
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Record a construction project expense.
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

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Project */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Project Name *
                  </label>

                  <input
                    type="text"
                    name="project"
                    value={formData.project}
                    onChange={handleInputChange}
                    placeholder="e.g. Luxury Apartment Complex"
                    className={`w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400 ${
                      errors.project
                        ? "border-red-500"
                        : "border-slate-300"
                    }`}
                  />

                  {errors.project && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.project}
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
                    className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400"
                  >
                    <option value="Materials">
                      Materials
                    </option>
                    <option value="Labour">Labour</option>
                    <option value="Equipment">
                      Equipment
                    </option>
                    <option value="Transport">
                      Transport
                    </option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Amount (LKR) *
                  </label>

                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="e.g. 250000"
                    min="1"
                    className={`w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400 ${
                      errors.amount
                        ? "border-red-500"
                        : "border-slate-300"
                    }`}
                  />

                  {errors.amount && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.amount}
                    </p>
                  )}
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Expense Date *
                  </label>

                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className={`w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400 ${
                      errors.date
                        ? "border-red-500"
                        : "border-slate-300"
                    }`}
                  />

                  {errors.date && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.date}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Description *
                  </label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="Describe the expense..."
                    className={`w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-orange-400 resize-none ${
                      errors.description
                        ? "border-red-500"
                        : "border-slate-300"
                    }`}
                  ></textarea>

                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.description}
                    </p>
                  )}
                </div>
              </div>

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
                  {editingExpenseId
                    ? "Save Changes"
                    : "Add Expense"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Expense Details Modal */}
      {showDetails && selectedExpense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-slate-900 text-white px-6 py-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-orange-400 text-sm font-semibold uppercase tracking-wide">
                    Expense Details
                  </p>

                  <h2 className="text-2xl font-bold mt-1">
                    {selectedExpense.project ||
                      "Unknown Project"}
                  </h2>
                </div>

                <button
                  onClick={closeExpenseDetails}
                  className="text-slate-300 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-slate-200 rounded-xl p-5">
                  <p className="text-sm text-slate-500">
                    Category
                  </p>

                  <span
                    className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${getCategoryStyle(
                      selectedExpense.category
                    )}`}
                  >
                    {selectedExpense.category || "Other"}
                  </span>
                </div>

                <div className="border border-slate-200 rounded-xl p-5">
                  <p className="text-sm text-slate-500">
                    Amount
                  </p>

                  <p className="text-xl font-bold text-slate-800 mt-2">
                    {formatCurrency(selectedExpense.amount)}
                  </p>
                </div>

                <div className="border border-slate-200 rounded-xl p-5">
                  <p className="text-sm text-slate-500">
                    Date
                  </p>

                  <p className="text-lg font-semibold text-slate-800 mt-2">
                    {selectedExpense.date || "Not specified"}
                  </p>
                </div>

                <div className="border border-slate-200 rounded-xl p-5">
                  <p className="text-sm text-slate-500">
                    Expense ID
                  </p>

                  <p className="text-lg font-semibold text-slate-800 mt-2">
                    #{selectedExpense.id}
                  </p>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl p-5">
                <p className="text-sm text-slate-500">
                  Description
                </p>

                <p className="text-slate-700 mt-2 leading-6">
                  {selectedExpense.description ||
                    "No description available."}
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={closeExpenseDetails}
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-semibold transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Expenses;