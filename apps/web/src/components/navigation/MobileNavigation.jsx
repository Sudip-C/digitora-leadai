import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { NavLink } from "react-router";

import { navigationItems } from "../../config/navigation.js";

export function MobileNavigation({ open, onClose }) {
  const panelRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const previouslyFocusedElement = document.activeElement;
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusableElements = Array.from(
        panelRef.current?.querySelectorAll(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );

      const firstElement = focusableElements[0];
      const lastElement = focusableElements.at(-1);

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;

      if (previouslyFocusedElement instanceof HTMLElement) {
        previouslyFocusedElement.focus();
      }
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        aria-label="Close navigation"
        tabIndex={-1}
        className="absolute inset-0 bg-slate-950/60"
        onClick={onClose}
      />

      <aside
        id="mobile-navigation"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-navigation-title"
        className="relative flex h-full w-[min(20rem,85vw)] flex-col bg-slate-950 px-5 py-6 text-white shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-brand-500 font-bold">
              D
            </div>

            <div>
              <p id="mobile-navigation-title" className="font-semibold text-white">
                Digitora LeadAI
              </p>
              <p className="text-xs text-slate-400">Find. Qualify. Connect.</p>
            </div>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            aria-label="Close navigation"
            className="grid size-10 place-items-center rounded-xl text-slate-300 transition hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-400"
            onClick={onClose}
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>

        <nav aria-label="Mobile navigation" className="mt-8 flex-1 space-y-1">
          {navigationItems.map(({ icon: Icon, label, path }) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/"}
              onClick={onClose}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-slate-300 hover:bg-white/5 hover:text-white",
                ].join(" ")
              }
            >
              <Icon aria-hidden="true" className="size-5 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/10 pt-4 text-xs text-slate-400">
          Part 02 · Frontend foundation
        </div>
      </aside>
    </div>
  );
}
