import { forwardRef } from "react";

import { cn } from "../../utils/cn.js";

const variants = {
  primary: "bg-brand-600 text-white hover:bg-brand-700",
  secondary: "border border-line bg-surface text-ink hover:border-brand-300 hover:bg-brand-50",
  ghost: "text-muted hover:bg-slate-100 hover:text-ink",
  danger: "bg-danger text-white hover:opacity-90",
};

const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

const Button = forwardRef(function Button(
  { className, variant = "primary", size = "md", type = "button", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant] ?? variants.primary,
        sizes[size] ?? sizes.md,
        className,
      )}
      {...props}
    />
  );
});

export default Button;
