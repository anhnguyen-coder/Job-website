// src/components/base/BaseButton.tsx
import { type ButtonHTMLAttributes, type ReactNode } from "react";
import clsx from "clsx";

export interface BaseButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "success" | "warning" | "danger" | "info";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
}

/**
 * BaseButton - reusable button with variant and size
 */
export function BaseButton({
  variant = "default",
  size = "md",
  children,
  className,
  ...props
}: BaseButtonProps) {
  const variantClasses: Record<
    NonNullable<BaseButtonProps["variant"]>,
    string
  > = {
    default:
      "bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200",
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    success: "bg-green-600 text-white hover:bg-green-700",
    warning: "bg-yellow-500 text-white hover:bg-yellow-600",
    danger: "bg-red-600 text-white hover:bg-red-700",
    info: "bg-indigo-600 text-white hover:bg-indigo-700",
  };

  const sizeClasses: Record<NonNullable<BaseButtonProps["size"]>, string> = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-3 text-lg",
  };

  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center font-medium rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2",
        variantClasses[variant || "default"],
        sizeClasses[size || "md"],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
