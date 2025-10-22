interface statItem {
  label: string;
  value: string;
  icon: string;
  color: string;
}

export function StatItem({ label, value, icon, color }: statItem) {

  const bgOpacity = `${color}/30`
  return (
    <div className={`flex items-center justify-between px-4 py-2 rounded-lg ${color} bg-opacity-30`}>
      {/* label & value */}
      <div>
        <p className="text-xl font-semibold text-white mb-4">{label}</p>
        <p className="text-2xl font-600 text-white">{value}</p>
      </div>

      {/* icon */}
      <div
        className={`w-12 h-12 flex items-center justify-center rounded-lg ${color}`}
      >
        <i className={`mdi ${icon} text-2xl text-white`}></i>
      </div>
    </div>
  );
}
