import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, CircleAlert, Info, X } from "lucide-react";

import { cn } from "../../utils/cn.js";

const ToastContext = createContext(null);

let nextToastId = 0;

const variants = {
  success: {
    icon: CheckCircle2,
    className: "border-success/20 text-success",
  },
  warning: {
    icon: AlertTriangle,
    className: "border-warning/20 text-warning",
  },
  danger: {
    icon: CircleAlert,
    className: "border-danger/20 text-danger",
  },
  info: {
    icon: Info,
    className: "border-info/20 text-info",
  },
};

function ToastItem({ toast, onDismiss }) {
  const { id, title, description, variant = "info", duration = 4000 } = toast;

  const configuration = variants[variant] ?? variants.info;
  const Icon = configuration.icon;

  useEffect(() => {
    if (!duration) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      onDismiss(id);
    }, duration);

    return () => window.clearTimeout(timer);
  }, [duration, id, onDismiss]);

  return (
    <article
      role={variant === "danger" ? "alert" : "status"}
      aria-atomic="true"
      className={cn(
        "pointer-events-auto flex items-start gap-3 rounded-panel border bg-surface p-4 shadow-2xl",
        configuration.className,
      )}
    >
      <Icon aria-hidden="true" className="mt-0.5 size-5 shrink-0" />

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-ink">{title}</p>

        {description ? <p className="mt-1 text-sm leading-5 text-muted">{description}</p> : null}
      </div>

      <button
        type="button"
        aria-label={`Dismiss ${title}`}
        className="grid size-8 shrink-0 place-items-center rounded-lg text-muted transition hover:bg-slate-100 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
        onClick={() => onDismiss(id)}
      >
        <X aria-hidden="true" className="size-4" />
      </button>
    </article>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((id) => {
    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((notification) => {
    const toast = {
      id: ++nextToastId,
      variant: "info",
      duration: 4000,
      ...notification,
    };

    setToasts((currentToasts) => [...currentToasts, toast].slice(-4));

    return toast.id;
  }, []);

  const contextValue = useMemo(
    () => ({
      showToast,
      dismissToast,
    }),
    [dismissToast, showToast],
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}

      <div className="pointer-events-none fixed right-4 top-4 z-[80] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3 sm:right-6 sm:top-6">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider.");
  }

  return context;
}
