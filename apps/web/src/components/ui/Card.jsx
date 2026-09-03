import { cn } from "../../utils/cn.js";

export default function Card({ children, className, ...props }) {
  return (
    <section
      className={cn("rounded-panel border border-line bg-surface shadow-panel", className)}
      {...props}
    >
      {children}
    </section>
  );
}
