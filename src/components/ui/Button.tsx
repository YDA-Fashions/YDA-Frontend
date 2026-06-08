import React from "react";
import { cn } from "@/utils/cn";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center font-black uppercase tracking-widest transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
      primary: "bg-black text-white border border-black hover:bg-black/90 hover:border-accent shadow-sm",
      secondary: "bg-white text-black border border-black hover:bg-black/5",
      ghost: "bg-transparent text-black hover:bg-black/5",
    };

    const sizes = {
      sm: "text-[10px] px-4 py-2",
      md: "text-xs px-8 py-4",
      lg: "text-sm px-12 py-5",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
