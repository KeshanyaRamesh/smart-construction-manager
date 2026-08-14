function Navbar() {
  return (
    <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">
          Smart Construction Manager
        </h2>
        <p className="text-sm text-slate-500">
          Manage projects efficiently
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <h3 className="font-semibold">Project Manager</h3>
          <p className="text-sm text-slate-500">
            Site Administration
          </p>
        </div>

        <div className="w-11 h-11 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">
          PM
        </div>
      </div>
    </header>
  );
}

export default Navbar;