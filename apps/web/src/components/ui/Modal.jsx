import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

import { cn } from "../../utils/cn.js";

const sizes = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  className,
}) {
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const titleId = useId();
  const descriptionId = useId();

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
        dialogRef.current?.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
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

  return createPortal(
    <div className="fixed inset-0 z-70 grid place-items-center p-4">
      <div aria-hidden="true" className="absolute inset-0 bg-slate-950/60" onClick={onClose} />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className={cn(
          "relative flex max-h-[calc(100vh-2rem)] w-full flex-col overflow-hidden rounded-panel border border-line bg-surface shadow-2xl",
          sizes[size] ?? sizes.md,
          className,
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
          <div>
            <h2 id={titleId} className="text-lg font-semibold text-ink">
              {title}
            </h2>

            {description ? (
              <p id={descriptionId} className="mt-1 text-sm leading-6 text-muted">
                {description}
              </p>
            ) : null}
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            aria-label="Close dialog"
            className="grid size-9 shrink-0 place-items-center rounded-lg text-muted transition hover:bg-slate-100 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
            onClick={onClose}
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-5">{children}</div>

        {footer ? (
          <div className="flex justify-end gap-3 border-t border-line bg-slate-50 px-6 py-4">
            {footer}
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
