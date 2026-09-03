import { cn } from "../../utils/cn.js";

const variants = {
  neutral: "bg-slate-100 text-slate-700 ring-slate-200",
  brand: "bg-brand-50 text-brand-700 ring-brand-200",
  success: "bg-success/10 text-success ring-success/20",
  warning: "bg-warning/10 text-warning ring-warning/20",
  danger: "bg-danger/10 text-danger ring-danger/20",
  info: "bg-info/10 text-info ring-info/20",
};

export default function Badge({ children, variant = "neutral", dot = false, className, ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        variants[variant] ?? variants.neutral,
        className,
      )}
      {...props}
    >
      {dot ? <span aria-hidden="true" className="size-1.5 rounded-full bg-current" /> : null}

      {children}
    </span>
  );
}
