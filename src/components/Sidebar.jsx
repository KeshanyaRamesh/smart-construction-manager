import { NavLink } from "react-router-dom";

function Sidebar() {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: "📊",
    },
    {
      name: "AI Insights",
      path: "/ai-insights",
      icon: "🤖",
    },
    {
      name: "Projects",
      path: "/projects",
      icon: "🏗️",
    },
    {
      name: "Tasks",
      path: "/tasks",
      icon: "📋",
    },
    {
      name: "Materials",
      path: "/materials",
      icon: "🧱",
    },
    {
      name: "Expenses",
      path: "/expenses",
      icon: "💰",
    },
    {
      name: "Workers",
      path: "/workers",
      icon: "👷",
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col min-h-screen">
      
      {/* Logo / Brand */}
      <div className="px-6 py-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          
          <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-xl">
            🏗️
          </div>

          <div>
            <h1 className="font-bold text-lg">
              BuildTrack
            </h1>

            <p className="text-xs text-slate-400">
              Construction Manager
            </p>
          </div>

        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-3">
          Main Menu
        </p>

        <div className="space-y-2">
          
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium ${
                  isActive
                    ? "bg-orange-500 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              
              <span className="text-lg">
                {item.icon}
              </span>

              <span>
                {item.name}
              </span>

            </NavLink>
          ))}

        </div>
      </nav>

      {/* Bottom Section */}
      <div className="px-4 py-5 border-t border-slate-700">
        
        <div className="bg-slate-800 rounded-lg p-4">
          
          <p className="text-sm font-semibold">
            BuildTrack
          </p>

          <p className="text-xs text-slate-400 mt-1">
            Smart Construction Management
          </p>

        </div>

      </div>

    </aside>
  );
}

export default Sidebar;