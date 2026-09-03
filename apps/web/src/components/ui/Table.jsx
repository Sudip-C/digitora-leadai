import { cn } from "../../utils/cn.js";

export default function Table({ children, className, containerClassName, ...props }) {
  return (
    <div
      className={cn(
        "overflow-x-auto rounded-panel border border-line bg-surface shadow-panel",
        containerClassName,
      )}
    >
      <table
        className={cn(
          "w-full border-collapse text-left text-sm",
          "[&_thead]:bg-slate-50",
          "[&_th]:whitespace-nowrap [&_th]:px-4 [&_th]:py-3",
          "[&_th]:text-xs [&_th]:font-semibold [&_th]:uppercase",
          "[&_th]:tracking-wide [&_th]:text-muted",
          "[&_tbody_tr]:border-t [&_tbody_tr]:border-line",
          "[&_tbody_tr]:transition [&_tbody_tr]:hover:bg-slate-50/70",
          "[&_td]:whitespace-nowrap [&_td]:px-4 [&_td]:py-4",
          "[&_td]:text-ink",
          className,
        )}
        {...props}
      >
        {children}
      </table>
    </div>
  );
}
