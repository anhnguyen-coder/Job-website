interface statItem {
  label: string;
  value: string;
  icon: string;
  color: string;
}

export function StatItem({ label, value, icon, color }: statItem) {
  return (
    <div className="">
      {/* label & value */}
      <div>
        <p className="text-sm font-600 text-gray-500">{label}</p>
        <p className="text-2xl font-600 text-gray-900">{value}</p>
      </div>

      {/* icon */}
      <div
        className={`w-12 h-12 flex items-center justify-center rounded-full ${color}`}
      >
        <i className={`mdi ${icon} text-2xl text-white`}></i>
      </div>
    </div>
  );
}
