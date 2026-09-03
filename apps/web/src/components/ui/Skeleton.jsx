import { cn } from "../../utils/cn.js";

export default function Skeleton({ className, ...props }) {
  return (
    <div
      {...props}
      aria-hidden="true"
      className={cn("animate-pulse rounded-lg bg-slate-200 motion-reduce:animate-none", className)}
    />
  );
}
