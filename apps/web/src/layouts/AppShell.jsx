import { useCallback, useState } from "react";
import { Menu } from "lucide-react";
import { Outlet, useLocation } from "react-router";

import { MobileNavigation } from "../components/navigation/MobileNavigation.jsx";
import Sidebar from "../components/navigation/Sidebar.jsx";
import { navigationItems } from "../config/navigation.js";

function findCurrentPage(pathname) {
  return (
    navigationItems.find(({ path }) => {
      if (path === "/") {
        return pathname === "/";
      }

      return pathname === path || pathname.startsWith(`${path}/`);
    }) ?? navigationItems[0]
  );
}

export default function AppShell() {
  const location = useLocation();
  const currentPage = findCurrentPage(location.pathname);
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);

  const closeMobileNavigation = useCallback(() => {
    setMobileNavigationOpen(false);
  }, []);

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <a
        href="#main-content"
        className="sr-only z-60 rounded-lg bg-brand-600 px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to main content
      </a>

      <Sidebar />

      <MobileNavigation open={mobileNavigationOpen} onClose={closeMobileNavigation} />

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-line bg-surface/90 backdrop-blur">
          <div className="flex min-h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                aria-label="Open navigation"
                aria-controls="mobile-navigation"
                aria-expanded={mobileNavigationOpen}
                aria-haspopup="dialog"
                className="grid size-10 shrink-0 place-items-center rounded-xl border border-line bg-surface text-ink transition hover:bg-slate-50 lg:hidden"
                onClick={() => setMobileNavigationOpen(true)}
              >
                <Menu aria-hidden="true" className="size-5" />
              </button>

              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Digitora LeadAI
                </p>
                <h1 className="truncate text-xl font-semibold text-ink">{currentPage.label}</h1>
              </div>
            </div>

            <span className="hidden rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 sm:inline-flex">
              Part 02
            </span>
          </div>
        </header>

        <main id="main-content" className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
