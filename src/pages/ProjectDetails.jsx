import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function ProjectDetails() {
  const { id } = useParams();

  const [project, setProject] = useState(null);

  useEffect(() => {
    const savedProjects =
      localStorage.getItem("constructionProjects");

    if (!savedProjects) {
      return;
    }

    const projects = JSON.parse(savedProjects);

    const selectedProject = projects.find(
      (item) => String(item.id) === String(id)
    );

    setProject(selectedProject || null);
  }, [id]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      maximumFractionDigits: 0,
    }).format(Number(amount) || 0);
  };

  const getStatusStyle = (status) => {
    if (status === "Completed") {
      return "bg-green-100 text-green-700";
    }

    if (status === "Finishing") {
      return "bg-blue-100 text-blue-700";
    }

    if (status === "On Hold") {
      return "bg-yellow-100 text-yellow-700";
    }

    return "bg-orange-100 text-orange-700";
  };

  const getProjectInsight = () => {
    if (!project) {
      return null;
    }

    const progress = Number(project.progress);
    const budget = Number(project.budget);

    if (project.status === "Completed") {
      return {
        type: "success",
        title: "Project Completed",
        message:
          "This project has reached completion. Review final expenses and project performance for future planning.",
      };
    }

    if (project.status === "On Hold") {
      return {
        type: "warning",
        title: "Project On Hold",
        message:
          "This project is currently on hold. Review pending tasks, resources, and possible project constraints.",
      };
    }

    if (progress >= 80) {
      return {
        type: "success",
        title: "Project Near Completion",
        message:
          "The project is progressing well. Focus on finishing activities, quality checks, and final inspections.",
      };
    }

    if (progress >= 50 && budget > 8000000) {
      return {
        type: "warning",
        title: "Monitor Project Spending",
        message:
          "The project has passed 50% completion with a relatively high budget. Monitor material and labour expenses carefully.",
      };
    }

    if (progress < 30) {
      return {
        type: "danger",
        title: "Low Project Progress",
        message:
          "Project progress is currently low. Review pending tasks, workforce availability, and possible delays.",
      };
    }

    return {
      type: "info",
      title: "Project Progress Looks Stable",
      message:
        "The project is currently progressing at a reasonable level. Continue monitoring tasks, costs, and deadlines.",
    };
  };

  const getInsightStyle = (type) => {
    if (type === "success") {
      return {
        container: "bg-green-50 border-green-200",
        icon: "✓",
        iconStyle: "bg-green-100 text-green-700",
        title: "text-green-800",
        text: "text-green-700",
      };
    }

    if (type === "warning") {
      return {
        container: "bg-yellow-50 border-yellow-200",
        icon: "!",
        iconStyle: "bg-yellow-100 text-yellow-700",
        title: "text-yellow-800",
        text: "text-yellow-700",
      };
    }

    if (type === "danger") {
      return {
        container: "bg-red-50 border-red-200",
        icon: "!",
        iconStyle: "bg-red-100 text-red-700",
        title: "text-red-800",
        text: "text-red-700",
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

  const calculateDuration = (
    startDate,
    endDate
  ) => {
    if (!startDate || !endDate) {
      return "Not available";
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    const difference = end - start;

    const days = Math.ceil(
      difference /
        (1000 * 60 * 60 * 24)
    );

    return days > 0
      ? `${days} days`
      : "Same day";
  };

  if (!project) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-10 text-center max-w-md">
          <div className="text-5xl mb-4">
            🏗️
          </div>

          <h1 className="text-2xl font-bold text-slate-800">
            Project Not Found
          </h1>

          <p className="text-slate-500 mt-2">
            The project you are looking for
            does not exist or may have been
            removed.
          </p>

          <Link
            to="/projects"
            className="inline-block mt-6 bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-lg font-semibold transition"
          >
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const insight = getProjectInsight();
  const insightStyle =
    getInsightStyle(insight.type);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <Link
            to="/projects"
            className="text-sm text-orange-500 hover:text-orange-600 font-semibold"
          >
            ← Back to Projects
          </Link>

          <p className="text-sm text-orange-500 font-semibold uppercase tracking-wide mt-4">
            Construction Project
          </p>

          <h1 className="text-3xl font-bold text-slate-800 mt-1">
            {project.name}
          </h1>

          <p className="text-slate-500 mt-2">
            📍 {project.location}
          </p>
        </div>

        <span
          className={`self-start md:self-center px-4 py-2 rounded-full text-sm font-semibold ${getStatusStyle(
            project.status
          )}`}
        >
          {project.status}
        </span>
      </div>

      {/* Progress Overview */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <p className="text-sm text-slate-500">
              Overall Project Progress
            </p>

            <h2 className="text-4xl font-bold text-slate-800 mt-2">
              {project.progress}%
            </h2>
          </div>

          <div className="w-full md:w-2/3">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-500">
                Progress
              </span>

              <span className="font-semibold text-slate-700">
                {project.progress}%
              </span>
            </div>

            <div className="w-full bg-slate-200 rounded-full h-4">
              <div
                className="bg-orange-500 h-4 rounded-full transition-all"
                style={{
                  width: `${Math.min(
                    Number(project.progress) ||
                      0,
                    100
                  )}%`,
                }}
              ></div>
            </div>

            <div className="flex justify-between mt-2 text-xs text-slate-400">
              <span>Started</span>
              <span>Completion</span>
            </div>
          </div>
        </div>
      </div>

      {/* Project Information */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Project Budget
          </p>

          <h2 className="text-xl font-bold text-blue-600 mt-2">
            {formatCurrency(
              project.budget
            )}
          </h2>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Project Duration
          </p>

          <h2 className="text-xl font-bold text-slate-800 mt-2">
            {calculateDuration(
              project.startDate,
              project.endDate
            )}
          </h2>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Start Date
          </p>

          <h2 className="text-lg font-bold text-slate-800 mt-2">
            {project.startDate}
          </h2>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Expected Completion
          </p>

          <h2 className="text-lg font-bold text-slate-800 mt-2">
            {project.endDate}
          </h2>
        </div>
      </div>

      {/* Smart Insight */}
      <div
        className={`border rounded-2xl p-6 ${insightStyle.container}`}
      >
        <div className="flex gap-4">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${insightStyle.iconStyle}`}
          >
            {insightStyle.icon}
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wide">
              Smart Project Insight
            </p>

            <h2
              className={`text-xl font-bold mt-1 ${insightStyle.title}`}
            >
              {insight.title}
            </h2>

            <p
              className={`text-sm mt-2 leading-6 ${insightStyle.text}`}
            >
              {insight.message}
            </p>
          </div>
        </div>
      </div>

      {/* Project Management Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <Link
          to="/tasks"
          className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md hover:border-orange-300 transition"
        >
          <div className="text-3xl mb-4">
            📋
          </div>

          <h3 className="text-lg font-bold text-slate-800">
            Tasks
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            Manage construction tasks
            and progress.
          </p>
        </Link>

        <Link
          to="/materials"
          className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md hover:border-orange-300 transition"
        >
          <div className="text-3xl mb-4">
            🧱
          </div>

          <h3 className="text-lg font-bold text-slate-800">
            Materials
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            Track construction
            materials and inventory.
          </p>
        </Link>

        <Link
          to="/expenses"
          className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md hover:border-orange-300 transition"
        >
          <div className="text-3xl mb-4">
            💰
          </div>

          <h3 className="text-lg font-bold text-slate-800">
            Expenses
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            Monitor project expenses
            and budget.
          </p>
        </Link>

        <Link
          to="/workers"
          className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md hover:border-orange-300 transition"
        >
          <div className="text-3xl mb-4">
            👷
          </div>

          <h3 className="text-lg font-bold text-slate-800">
            Workers
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            Manage workers and
            assignments.
          </p>
        </Link>
      </div>

      {/* Project Summary */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-xl font-bold text-slate-800">
          Project Summary
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
          <div>
            <p className="text-sm text-slate-500">
              Project Name
            </p>

            <p className="font-semibold text-slate-800 mt-1">
              {project.name}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Location
            </p>

            <p className="font-semibold text-slate-800 mt-1">
              {project.location}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Current Status
            </p>

            <p className="font-semibold text-slate-800 mt-1">
              {project.status}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Remaining Progress
            </p>

            <p className="font-semibold text-slate-800 mt-1">
              {Math.max(
                0,
                100 -
                  Number(
                    project.progress
                  )
              )}
              %
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetails;