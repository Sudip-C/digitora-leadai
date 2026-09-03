import { NavLink } from "react-router";

import { navigationItems } from "../../config/navigation.js";

function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-slate-800 bg-slate-950 text-slate-300 lg:flex">
      <div className="flex h-20 items-center gap-3 border-b border-slate-800 px-6">
        <div className="grid size-10 place-items-center rounded-xl bg-brand-600 font-bold text-white shadow-lg shadow-brand-950/30">
          D
        </div>

        <div>
          <p className="font-semibold tracking-tight text-white">Digitora LeadAI</p>
          <p className="text-xs text-slate-500">Digitora Solutions</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6" aria-label="Primary navigation">
        {navigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                [
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                  isActive
                    ? "bg-brand-600 text-white shadow-lg shadow-brand-950/25"
                    : "text-slate-400 hover:bg-slate-900 hover:text-white",
                ].join(" ")
              }
            >
              <Icon className="size-5 shrink-0" aria-hidden="true" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-slate-800 p-4">
        <div className="rounded-xl bg-slate-900 px-4 py-3">
          <p className="text-xs font-medium text-slate-300">Frontend foundation</p>
          <p className="mt-1 text-xs text-slate-500">Part 2 in progress</p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
