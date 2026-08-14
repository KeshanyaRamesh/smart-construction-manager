import { Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import Tasks from "./pages/Tasks";
import Materials from "./pages/Materials";
import Expenses from "./pages/Expenses";
import Workers from "./pages/Workers";
import AIInsights from "./pages/AIInsights";

function App() {
  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route
              path="/"
              element={<Dashboard />}
            />

            <Route
              path="/projects"
              element={<Projects />}
            />

            <Route
              path="/projects/:id"
              element={<ProjectDetails />}
            />

            <Route
              path="/tasks"
              element={<Tasks />}
            />

            <Route
              path="/materials"
              element={<Materials />}
            />

            <Route
              path="/expenses"
              element={<Expenses />}
            />

            <Route
              path="/workers"
              element={<Workers />}
            />

            <Route
              path="/ai-insights"
              element={<AIInsights />}
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;