import { applyOpacity } from "@/pkg/helpers/style";

interface StatItemProps {
  label: string;
  value: string | number;
  icon: string;
  color: string;
}

export function StatItem({ label, value, icon, color }: StatItemProps) {
  return (
    <div
      className="flex items-center justify-between px-5 py-4 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer"
      style={{ backgroundColor: applyOpacity(color, 0.12) }}
    >
      {/* Label & Value */}
      <div>
        <p className="text-sm font-medium text-gray-500 mb-2">{label}</p>
        <p className="text-3xl font-semibold text-gray-900 leading-none">
          {value}
        </p>
      </div>

      {/* Icon */}
      <div
        className="w-14 h-14 flex items-center justify-center rounded-xl transition-transform duration-300 hover:scale-110"
        style={{ backgroundColor: color }}
      >
        <i className={`mdi ${icon} text-2xl text-white`}></i>
      </div>
    </div>
  );
}
