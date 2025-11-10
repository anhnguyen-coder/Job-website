import React, { type ReactNode } from "react";

interface BaseStatItemProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
}

export const BaseStatItem: React.FC<BaseStatItemProps> = ({
  title,
  value,
  icon,
  variant = "default",
}) => {
  const variantColors: Record<string, string> = {
    default: "bg-gray-100 text-gray-600",
    success: "bg-green-100 text-green-600",
    warning: "bg-yellow-100 text-yellow-600",
    danger: "bg-red-100 text-red-600",
    info: "bg-blue-100 text-blue-600",
  };

  const varriantIconColors: Record<string, string> = {
    default: "bg-gray-500 text-white",
    success: "bg-green-500 text-white",
    warning: "bg-yellow-500 text-white",
    danger: "bg-red-500 text-white",
    info: "bg-blue-500 text-white",
  };

  const colorClass = variantColors[variant] || variantColors.default;
  const iconColorClass =
    varriantIconColors[variant] || varriantIconColors.default;

  return (
    <div
      className={`flex items-center gap-4 p-5 rounded-2xl shadow-md hover:shadow-lg transition-all ${colorClass}`}
    >
      {icon && (
        <div
          className={`p-4 rounded-full flex items-center justify-center text-xl ${iconColorClass}`}
        >
          {icon}
        </div>
      )}
      <div>
        <h4 className="text-sm font-medium text-gray-500">{title}</h4>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
};
