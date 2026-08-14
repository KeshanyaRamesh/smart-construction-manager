function generateConstructionInsight({
  projects = [],
  tasks = [],
  workers = [],
  expenses = [],
  materials = [],
  question = "",
}) {
  const normalizedQuestion = question.toLowerCase();

  // -----------------------------
  // Basic calculations
  // -----------------------------

  const totalProjects = projects.length;
  const totalTasks = tasks.length;
  const totalWorkers = workers.length;
  const totalExpenses = expenses.length;
  const totalMaterials = materials.length;

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const pendingTasks = tasks.filter(
    (task) => task.status === "Pending"
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "In Progress"
  ).length;

  const highPriorityTasks = tasks.filter(
    (task) => task.priority === "High"
  );

  const onHoldProjects = projects.filter(
    (project) => project.status === "On Hold"
  );

  const completedProjects = projects.filter(
    (project) => project.status === "Completed"
  );

  const activeProjects = projects.filter(
    (project) => project.status !== "Completed"
  );

  // -----------------------------
  // Find project needing attention
  // -----------------------------

  let attentionProject = null;

  if (activeProjects.length > 0) {
    attentionProject = activeProjects.reduce(
      (lowest, current) => {
        const currentProgress =
          Number(current.progress) || 0;

        const lowestProgress =
          Number(lowest.progress) || 0;

        return currentProgress < lowestProgress
          ? current
          : lowest;
      }
    );
  }

  // -----------------------------
  // Find highest budget project
  // -----------------------------

  let highestBudgetProject = null;

  if (projects.length > 0) {
    highestBudgetProject = projects.reduce(
      (highest, current) => {
        const currentBudget =
          Number(current.budget) || 0;

        const highestBudget =
          Number(highest.budget) || 0;

        return currentBudget > highestBudget
          ? current
          : highest;
      }
    );
  }

  // -----------------------------
  // Find high priority tasks
  // -----------------------------

  const urgentTasks = highPriorityTasks.filter(
    (task) => task.status !== "Completed"
  );

  // -----------------------------
  // Overall progress
  // -----------------------------

  let averageProgress = 0;

  if (projects.length > 0) {
    const totalProgress = projects.reduce(
      (total, project) =>
        total + (Number(project.progress) || 0),
      0
    );

    averageProgress = Math.round(
      totalProgress / projects.length
    );
  }

  // -----------------------------
  // Question-based responses
  // -----------------------------

  if (
    normalizedQuestion.includes("attention") ||
    normalizedQuestion.includes("project need") ||
    normalizedQuestion.includes("which project")
  ) {
    if (!attentionProject) {
      return {
        title: "Projects Needing Attention",
        summary:
          "There are currently no active projects requiring immediate attention.",
        recommendations: [
          "Continue monitoring active projects.",
          "Review project progress regularly.",
          "Keep project schedules and budgets updated.",
        ],
      };
    }

    return {
      title: "Project Needing Most Attention",
      summary: `${attentionProject.name} currently requires the most attention because its progress is at ${
        attentionProject.progress || 0
      }%.`,
      recommendations: [
        "Review pending tasks for this project.",
        "Check workforce availability.",
        "Review possible construction delays.",
        "Monitor project expenses and materials.",
      ],
    };
  }

  if (
    normalizedQuestion.includes("budget") ||
    normalizedQuestion.includes("spending") ||
    normalizedQuestion.includes("cost")
  ) {
    if (!highestBudgetProject) {
      return {
        title: "Budget Analysis",
        summary:
          "There is not enough project data to perform a budget analysis.",
        recommendations: [
          "Add project budget information.",
          "Record project expenses regularly.",
        ],
      };
    }

    return {
      title: "Budget Risk Analysis",
      summary: `${highestBudgetProject.name} has the highest project budget at LKR ${Number(
        highestBudgetProject.budget || 0
      ).toLocaleString()}.`,
      recommendations: [
        "Monitor material expenses carefully.",
        "Review labour costs regularly.",
        "Compare actual expenses against the project budget.",
        "Investigate unexpected cost increases early.",
      ],
    };
  }

  if (
    normalizedQuestion.includes("task") ||
    normalizedQuestion.includes("tasks")
  ) {
    return {
      title: "Task Analysis",
      summary: `There are ${totalTasks} tasks in the system. ${completedTasks} are completed, ${inProgressTasks} are in progress, and ${pendingTasks} are pending.`,
      recommendations: [
        urgentTasks.length > 0
          ? `${urgentTasks.length} high-priority task(s) still need attention.`
          : "There are no unfinished high-priority tasks.",
        "Review overdue and upcoming tasks.",
        "Update task statuses regularly.",
        "Prioritize tasks that may affect project completion.",
      ],
    };
  }

  if (
    normalizedQuestion.includes("delay") ||
    normalizedQuestion.includes("risk")
  ) {
    const lowProgressProjects = projects.filter(
      (project) =>
        project.status !== "Completed" &&
        Number(project.progress) < 30
    );

    return {
      title: "Project Delay Risk",
      summary:
        lowProgressProjects.length > 0
          ? `${lowProgressProjects.length} project(s) currently have progress below 30% and may require additional attention.`
          : "No major project delay risk was identified from the current progress data.",
      recommendations: [
        "Review low-progress projects.",
        "Check pending construction tasks.",
        "Confirm worker availability.",
        "Monitor project deadlines.",
      ],
    };
  }

  if (
    normalizedQuestion.includes("worker") ||
    normalizedQuestion.includes("workforce")
  ) {
    return {
      title: "Workforce Analysis",
      summary: `The system currently contains ${totalWorkers} worker record(s).`,
      recommendations: [
        "Review worker assignments regularly.",
        "Avoid assigning too many critical tasks to the same worker.",
        "Check workforce availability before starting new tasks.",
        "Review unfinished tasks assigned to workers.",
      ],
    };
  }

  if (
    normalizedQuestion.includes("material") ||
    normalizedQuestion.includes("inventory")
  ) {
    return {
      title: "Material Analysis",
      summary: `The system currently contains ${totalMaterials} material record(s).`,
      recommendations: [
        "Monitor important construction materials.",
        "Check stock levels regularly.",
        "Identify materials that may require reordering.",
        "Avoid material shortages that could delay construction.",
      ],
    };
  }

  // -----------------------------
  // Default overall analysis
  // -----------------------------

  return {
    title: "Overall Construction Analysis",

    summary: `BuildTrack currently manages ${totalProjects} project(s), ${totalTasks} task(s), ${totalWorkers} worker(s), ${totalExpenses} expense record(s), and ${totalMaterials} material record(s). Average project progress is ${averageProgress}%.`,

    recommendations: [
      attentionProject
        ? `${attentionProject.name} has the lowest active project progress and should be monitored closely.`
        : "Continue monitoring project progress.",

      urgentTasks.length > 0
        ? `${urgentTasks.length} high-priority task(s) require attention.`
        : "No unfinished high-priority tasks require immediate attention.",

      onHoldProjects.length > 0
        ? `${onHoldProjects.length} project(s) are currently on hold.`
        : "No projects are currently on hold.",

      completedProjects.length > 0
        ? `${completedProjects.length} project(s) have been completed.`
        : "Continue tracking project completion.",

      "Review expenses and material usage regularly.",
    ],
  };
}

module.exports = {
  generateConstructionInsight,
};