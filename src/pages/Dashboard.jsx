import { useEffect, useState } from "react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

/* =====================================================
   REUSABLE PIE CHART CARD
===================================================== */

function ChartCard({
  title,
  description,
  data,
}) {
  const total = data.reduce(
    (sum, item) =>
      sum + Number(item.value || 0),
    0
  );

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
      <div>
        <h2 className="text-lg font-bold text-slate-800">
          {title}
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          {description}
        </p>
      </div>

      <div className="h-[300px] mt-4">
        {total > 0 ? (
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={100}
                paddingAngle={3}
              >
                {data.map((item, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={item.color}
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={(value) => [
                  value,
                  "Count",
                ]}
              />

              <Legend
                verticalAlign="bottom"
                height={36}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-3">
                📊
              </div>

              <p className="text-slate-500">
                No data available
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="text-center border-t border-slate-100 pt-4">
        <span className="text-sm text-slate-500">
          Total
        </span>

        <p className="text-2xl font-bold text-slate-800">
          {total}
        </p>
      </div>
    </div>
  );
}

/* =====================================================
   DASHBOARD
===================================================== */

function Dashboard() {
  const [refresh, setRefresh] = useState(0);

  /* =====================================================
     REFRESH DATA
  ===================================================== */

  useEffect(() => {
    const refreshDashboard = () => {
      setRefresh((current) => current + 1);
    };

    window.addEventListener(
      "storage",
      refreshDashboard
    );

    window.addEventListener(
      "focus",
      refreshDashboard
    );

    const interval = setInterval(
      refreshDashboard,
      1000
    );

    return () => {
      window.removeEventListener(
        "storage",
        refreshDashboard
      );

      window.removeEventListener(
        "focus",
        refreshDashboard
      );

      clearInterval(interval);
    };
  }, []);

  /* =====================================================
     LOAD LOCAL STORAGE DATA
  ===================================================== */

  const getStorageData = (key) => {
    try {
      const savedData = localStorage.getItem(key);

      if (!savedData) {
        return [];
      }

      const parsedData = JSON.parse(savedData);

      return Array.isArray(parsedData)
        ? parsedData
        : [];
    } catch (error) {
      console.error(
        `Error loading ${key}:`,
        error
      );

      return [];
    }
  };

  const projects = getStorageData(
    "constructionProjects"
  );

  const tasks = getStorageData(
    "constructionTasks"
  );

  const materials = getStorageData(
    "constructionMaterials"
  );

  const expenses = getStorageData(
    "constructionExpenses"
  );

  const workers = getStorageData(
    "constructionWorkers"
  );

  /* =====================================================
     PROJECT STATUS HELPERS
  ===================================================== */

  const getProjectStatus = (project) => {
    return String(
      project.status || ""
    )
      .trim()
      .toLowerCase();
  };

  /* =====================================================
     PROJECT STATISTICS
  ===================================================== */

  const totalProjects = projects.length;

  const activeProjects = projects.filter(
    (project) => {
      const status =
        getProjectStatus(project);

      return status === "active";
    }
  ).length;

  const completedProjects =
    projects.filter((project) => {
      const status =
        getProjectStatus(project);

      return status === "completed";
    }).length;

  const inProgressProjects =
    projects.filter((project) => {
      const status =
        getProjectStatus(project);

      return (
        status === "in progress" ||
        status === "in-progress" ||
        status === "inprogress" ||
        status === "on process" ||
        status === "on-process" ||
        status === "onprocess" ||
        status === "processing"
      );
    }).length;

  const pendingProjects =
    projects.filter((project) => {
      const status =
        getProjectStatus(project);

      return (
        status === "pending" ||
        status === "on hold" ||
        status === "on-hold" ||
        status === "onhold"
      );
    }).length;

  const totalBudget =
    projects.reduce(
      (total, project) =>
        total +
        Number(
          project.budget ||
            project.estimatedBudget ||
            0
        ),
      0
    );

  /* =====================================================
     TASK STATISTICS
  ===================================================== */

  const totalTasks = tasks.length;

  const completedTasks =
    tasks.filter(
      (task) =>
        String(
          task.status || ""
        ).toLowerCase() ===
        "completed"
    ).length;

  const inProgressTasks =
    tasks.filter((task) => {
      const status = String(
        task.status || ""
      )
        .trim()
        .toLowerCase();

      return (
        status === "in progress" ||
        status === "in-progress" ||
        status === "on process" ||
        status === "on-process" ||
        status === "processing"
      );
    }).length;

  const pendingTasks =
    tasks.filter((task) => {
      const status = String(
        task.status || ""
      )
        .trim()
        .toLowerCase();

      return (
        status === "pending" ||
        status === "on hold" ||
        status === "on-hold"
      );
    }).length;

  const taskCompletion =
    totalTasks > 0
      ? Math.round(
          (completedTasks /
            totalTasks) *
            100
        )
      : 0;

  /* =====================================================
     EXPENSE STATISTICS
  ===================================================== */

  const totalExpenses =
    expenses.reduce(
      (total, expense) =>
        total +
        Number(
          expense.amount || 0
        ),
      0
    );

  const remainingBudget =
    totalBudget - totalExpenses;

  const budgetUsed =
    totalBudget > 0
      ? Math.round(
          (totalExpenses /
            totalBudget) *
            100
        )
      : 0;

  /* =====================================================
     MATERIAL STATISTICS
  ===================================================== */

  const totalMaterials =
    materials.length;

  const lowStockMaterials =
    materials.filter((material) => {
      const status = String(
        material.status || ""
      )
        .trim()
        .toLowerCase();

      return (
        status === "low stock" ||
        Number(
          material.quantity || 0
        ) <=
          Number(
            material.minimumStock || 0
          )
      );
    }).length;

  /* =====================================================
     WORKER STATISTICS
  ===================================================== */

  const totalWorkers =
    workers.length;

  const activeWorkers =
    workers.filter(
      (worker) =>
        String(
          worker.status || ""
        ).toLowerCase() ===
        "active"
    ).length;

  /* =====================================================
     TASK CHART
  ===================================================== */

  const taskChartData = [
    {
      label: "Completed",
      value: completedTasks,
      color: "#22c55e",
    },
    {
      label: "In Progress",
      value: inProgressTasks,
      color: "#3b82f6",
    },
    {
      label: "Pending",
      value: pendingTasks,
      color: "#94a3b8",
    },
  ];

  /* =====================================================
     PROJECT STATUS CHART
     
     ACTIVE
     COMPLETED
     IN PROGRESS
     PENDING
  ===================================================== */

  const projectChartData = [
    {
      label: "Active",
      value: activeProjects,
      color: "#f97316",
    },
    {
      label: "Completed",
      value: completedProjects,
      color: "#22c55e",
    },
    {
      label: "In Progress",
      value: inProgressProjects,
      color: "#3b82f6",
    },
    {
      label: "Pending",
      value: pendingProjects,
      color: "#94a3b8",
    },
  ];

  /* =====================================================
     EXPENSE CATEGORY CHART
  ===================================================== */

  const expenseCategories = {};

  expenses.forEach((expense) => {
    const category =
      expense.category ||
      expense.type ||
      "Other";

    if (
      !expenseCategories[category]
    ) {
      expenseCategories[category] = 0;
    }

    expenseCategories[category] +=
      Number(expense.amount || 0);
  });

  const expenseColors = [
    "#ef4444",
    "#f97316",
    "#3b82f6",
    "#22c55e",
    "#a855f7",
    "#eab308",
  ];

  const expenseChartData =
    Object.entries(
      expenseCategories
    ).map(
      ([category, amount], index) => ({
        label: category,
        value: amount,
        color:
          expenseColors[
            index %
              expenseColors.length
          ],
      })
    );

  /* =====================================================
     SMART INSIGHTS
  ===================================================== */

  const smartInsights = [];

  if (
    budgetUsed >= 80 &&
    budgetUsed < 100
  ) {
    smartInsights.push({
      type: "warning",
      title: "Budget Warning",
      message: `Your projects have used approximately ${budgetUsed}% of the available budget. Review current expenses before adding new costs.`,
    });
  }

  if (budgetUsed >= 100) {
    smartInsights.push({
      type: "danger",
      title: "Budget Exceeded",
      message:
        "Current recorded expenses have reached or exceeded the available project budget. Immediate budget review is recommended.",
    });
  }

  if (lowStockMaterials > 0) {
    smartInsights.push({
      type: "warning",
      title: "Material Stock Alert",
      message: `${lowStockMaterials} material item${
        lowStockMaterials > 1
          ? "s"
          : ""
      } may require restocking.`,
    });
  }

  if (
    totalTasks > 0 &&
    taskCompletion < 50
  ) {
    smartInsights.push({
      type: "info",
      title: "Project Progress",
      message: `Only ${taskCompletion}% of recorded tasks are completed. Consider reviewing pending tasks and deadlines.`,
    });
  }

  if (
    activeProjects > 0 &&
    activeWorkers === 0
  ) {
    smartInsights.push({
      type: "warning",
      title: "Workforce Alert",
      message:
        "There are active projects but no active workers assigned in the system.",
    });
  }

  if (
    inProgressProjects > 0
  ) {
    smartInsights.push({
      type: "info",
      title: "Projects In Progress",
      message: `${inProgressProjects} project${
        inProgressProjects > 1
          ? "s are"
          : " is"
      } currently in progress. Continue monitoring progress and upcoming deadlines.`,
    });
  }

  if (pendingProjects > 0) {
    smartInsights.push({
      type: "warning",
      title: "Pending Projects",
      message: `${pendingProjects} project${
        pendingProjects > 1
          ? "s are"
          : " is"
      } currently pending or on hold. Review these projects and update their status when work resumes.`,
    });
  }

  if (
    smartInsights.length === 0
  ) {
    smartInsights.push({
      type: "success",
      title: "Everything Looks Good",
      message:
        "No major issues were detected from the current project data.",
    });
  }

  /* =====================================================
     RECENT PROJECTS
  ===================================================== */

  const recentProjects = [
    ...projects,
  ]
    .sort(
      (a, b) =>
        Number(b.id || 0) -
        Number(a.id || 0)
    )
    .slice(0, 5);

  /* =====================================================
     RECENT EXPENSES
  ===================================================== */

  const recentExpenses = [
    ...expenses,
  ]
    .sort(
      (a, b) =>
        new Date(
          b.date ||
            b.createdAt ||
            0
        ) -
        new Date(
          a.date ||
            a.createdAt ||
            0
        )
    )
    .slice(0, 5);

  return (
    <div className="space-y-6">

      {/* =================================================
          HEADER
      ================================================= */}

      <div>
        <p className="text-sm text-orange-500 font-semibold uppercase tracking-wide">
          Construction Management
        </p>

        <h1 className="text-3xl font-bold text-slate-800 mt-1">
          Dashboard
        </h1>

        <p className="text-slate-500 mt-1">
          Monitor your construction
          projects, finances,
          workforce and materials.
        </p>
      </div>

      {/* =================================================
          MAIN STATISTICS
      ================================================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

        {/* PROJECTS */}

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Total Projects
              </p>

              <p className="text-3xl font-bold text-slate-800 mt-2">
                {totalProjects}
              </p>
            </div>

            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-2xl">
              🏗️
            </div>

          </div>

          <p className="text-sm text-slate-500 mt-4">
            {activeProjects} active
            projects
          </p>
        </div>

        {/* TASKS */}

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Task Progress
              </p>

              <p className="text-3xl font-bold text-blue-600 mt-2">
                {taskCompletion}%
              </p>
            </div>

            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-2xl">
              📋
            </div>

          </div>

          <p className="text-sm text-slate-500 mt-4">
            {completedTasks} of{" "}
            {totalTasks} tasks
            completed
          </p>
        </div>

        {/* EXPENSES */}

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Total Expenses
              </p>

              <p className="text-2xl font-bold text-red-500 mt-2">
                Rs.{" "}
                {Number(
                  totalExpenses
                ).toLocaleString()}
              </p>
            </div>

            <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center text-2xl">
              💰
            </div>

          </div>

          <p className="text-sm text-slate-500 mt-4">
            {budgetUsed}% of budget
            used
          </p>
        </div>

        {/* WORKERS */}

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-500">
                Active Workers
              </p>

              <p className="text-3xl font-bold text-green-600 mt-2">
                {activeWorkers}
              </p>
            </div>

            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-2xl">
              👷
            </div>

          </div>

          <p className="text-sm text-slate-500 mt-4">
            {totalWorkers} total
            workers
          </p>
        </div>

      </div>

      {/* =================================================
          PIE CHARTS
      ================================================= */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <ChartCard
          title="Task Status"
          description="Current distribution of construction tasks."
          data={taskChartData}
        />

        <ChartCard
          title="Project Status"
          description="Current distribution of construction projects."
          data={projectChartData}
        />

      </div>

      {/* =================================================
          EXPENSE + BUDGET
      ================================================= */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <ChartCard
          title="Expense Distribution"
          description="Expenses grouped by category."
          data={expenseChartData}
        />

        {/* BUDGET */}

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">

          <div className="flex items-center justify-between mb-5">

            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Budget Overview
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Overall project budget
                versus expenses.
              </p>
            </div>

            <span className="text-sm font-semibold text-slate-600">
              {budgetUsed}% Used
            </span>

          </div>

          <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">

            <div
              className={`h-full rounded-full transition-all ${
                budgetUsed >= 100
                  ? "bg-red-500"
                  : budgetUsed >= 80
                  ? "bg-orange-500"
                  : "bg-green-500"
              }`}
              style={{
                width: `${Math.min(
                  Math.max(
                    budgetUsed,
                    0
                  ),
                  100
                )}%`,
              }}
            />

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">

            <div>
              <p className="text-sm text-slate-500">
                Total Budget
              </p>

              <p className="text-lg font-bold text-slate-800 mt-1">
                Rs.{" "}
                {Number(
                  totalBudget
                ).toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Spent
              </p>

              <p className="text-lg font-bold text-red-500 mt-1">
                Rs.{" "}
                {Number(
                  totalExpenses
                ).toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Remaining
              </p>

              <p
                className={`text-lg font-bold mt-1 ${
                  remainingBudget < 0
                    ? "text-red-500"
                    : "text-green-600"
                }`}
              >
                Rs.{" "}
                {Number(
                  remainingBudget
                ).toLocaleString()}
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* =================================================
          MATERIAL OVERVIEW
      ================================================= */}

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">

        <h2 className="text-lg font-bold text-slate-800">
          Material Overview
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Current inventory status.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">

          <div className="bg-slate-50 rounded-xl p-5">
            <p className="text-sm text-slate-500">
              Total Materials
            </p>

            <p className="text-3xl font-bold text-slate-800 mt-2">
              {totalMaterials}
            </p>
          </div>

          <div className="bg-orange-50 rounded-xl p-5">
            <p className="text-sm text-orange-600">
              Low Stock
            </p>

            <p className="text-3xl font-bold text-orange-600 mt-2">
              {lowStockMaterials}
            </p>
          </div>

        </div>

        <div className="mt-5">

          {lowStockMaterials > 0 ? (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">

              <p className="font-semibold text-orange-700">
                ⚠️ Stock Attention
              </p>

              <p className="text-sm text-orange-600 mt-1">
                Some materials may
                need to be restocked.
              </p>

            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">

              <p className="font-semibold text-green-700">
                ✓ Stock Looks Good
              </p>

              <p className="text-sm text-green-600 mt-1">
                No low-stock
                materials detected.
              </p>

            </div>
          )}

        </div>

      </div>

      {/* =================================================
          SMART INSIGHTS
      ================================================= */}

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">

        <div className="flex items-center gap-3 mb-5">

          <div className="w-11 h-11 rounded-xl bg-purple-100 flex items-center justify-center text-xl">
            🤖
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Smart Construction
              Insights
            </h2>

            <p className="text-sm text-slate-500">
              Automated recommendations
              based on your current
              project data.
            </p>
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {smartInsights.map(
            (insight, index) => {

              const styles = {
                warning:
                  "bg-orange-50 border-orange-200 text-orange-700",

                danger:
                  "bg-red-50 border-red-200 text-red-700",

                info:
                  "bg-blue-50 border-blue-200 text-blue-700",

                success:
                  "bg-green-50 border-green-200 text-green-700",
              };

              return (
                <div
                  key={index}
                  className={`border rounded-xl p-5 ${
                    styles[
                      insight.type
                    ]
                  }`}
                >
                  <h3 className="font-bold">
                    {insight.title}
                  </h3>

                  <p className="text-sm mt-2 leading-6">
                    {insight.message}
                  </p>
                </div>
              );
            }
          )}

        </div>

      </div>

      {/* =================================================
          RECENT PROJECTS + EXPENSES
      ================================================= */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* RECENT PROJECTS */}

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">

          <div className="p-6 border-b border-slate-200">

            <h2 className="text-lg font-bold text-slate-800">
              Recent Projects
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Latest projects added
              to the system.
            </p>

          </div>

          {recentProjects.length > 0 ? (
            <div className="divide-y divide-slate-100">

              {recentProjects.map(
                (project) => (
                  <div
                    key={project.id}
                    className="p-5 flex items-center justify-between gap-4"
                  >

                    <div>
                      <p className="font-semibold text-slate-800">
                        {project.name ||
                          "Unnamed Project"}
                      </p>

                      <p className="text-sm text-slate-500 mt-1">
                        {project.location ||
                          "Location not specified"}
                      </p>
                    </div>

                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                      {project.status ||
                        "Active"}
                    </span>

                  </div>
                )
              )}

            </div>
          ) : (
            <div className="p-10 text-center text-slate-500">
              No projects
              available.
            </div>
          )}

        </div>

        {/* RECENT EXPENSES */}

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">

          <div className="p-6 border-b border-slate-200">

            <h2 className="text-lg font-bold text-slate-800">
              Recent Expenses
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Latest recorded
              project expenses.
            </p>

          </div>

          {recentExpenses.length > 0 ? (
            <div className="divide-y divide-slate-100">

              {recentExpenses.map(
                (expense) => (
                  <div
                    key={expense.id}
                    className="p-5 flex items-center justify-between gap-4"
                  >

                    <div>

                      <p className="font-semibold text-slate-800">
                        {expense.description ||
                          "Expense"}
                      </p>

                      <p className="text-sm text-slate-500 mt-1">
                        {expense.project ||
                          expense.category ||
                          "General"}
                      </p>

                    </div>

                    <p className="font-bold text-red-500 whitespace-nowrap">
                      Rs.{" "}
                      {Number(
                        expense.amount ||
                          0
                      ).toLocaleString()}
                    </p>

                  </div>
                )
              )}

            </div>
          ) : (
            <div className="p-10 text-center text-slate-500">
              No expenses
              available.
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default Dashboard;