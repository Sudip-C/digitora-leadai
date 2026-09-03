import { forwardRef, useId } from "react";

import { cn } from "../../utils/cn.js";

const Input = forwardRef(function Input(
  { id, label, hint, error, className, containerClassName, required = false, ...props },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const messageId = `${inputId}-message`;

  return (
    <div className={cn("space-y-2", containerClassName)}>
      {label ? (
        <label htmlFor={inputId} className="block text-sm font-medium text-ink">
          {label}

          {required ? (
            <span className="ml-1 text-danger" aria-hidden="true">
              *
            </span>
          ) : null}
        </label>
      ) : null}

      <input
        ref={ref}
        id={inputId}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={hint || error ? messageId : undefined}
        className={cn(
          "h-11 w-full rounded-xl border bg-surface px-3.5 text-sm text-ink outline-none transition placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-muted",
          error
            ? "border-danger focus:border-danger focus:ring-4 focus:ring-danger/10"
            : "border-line focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10",
          className,
        )}
        {...props}
      />

      {error ? (
        <p id={messageId} role="alert" className="text-sm text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={messageId} className="text-sm text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
});

export default Input;
