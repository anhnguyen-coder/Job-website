export const InfoItem = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
    <p className="text-gray-500 text-sm">{label}</p>
    <p className="text-gray-900 font-medium mt-1">{value}</p>
  </div>
);
