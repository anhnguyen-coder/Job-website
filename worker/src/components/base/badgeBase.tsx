// src/components/base/BaseBadge.tsx
import React from "react";
import clsx from "clsx";

export interface BaseBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info";
  children: React.ReactNode;
}

/**
 * BaseBadge - a reusable badge component with color variants.
 */
export function BaseBadge({ variant = "default", children, className, ...props }: BaseBadgeProps) {
  const variantClasses: Record<string, string> = {
    default: "bg-gray-100 text-gray-800 border border-gray-300",
    success: "bg-green-100 text-green-800 border border-green-300",
    warning: "bg-yellow-100 text-yellow-800 border border-yellow-300",
    danger: "bg-red-100 text-red-800 border border-red-300",
    info: "bg-blue-100 text-blue-800 border border-blue-300",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full w-fit",
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
