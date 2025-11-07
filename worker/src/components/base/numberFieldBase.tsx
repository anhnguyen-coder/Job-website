type NumberFieldProps<T> = {
  label: string;
  value: T;
  onChange: (value: number) => void;
};

export function NumberField<T>({
  label,
  value,
  onChange,
}: NumberFieldProps<T>) {
  return (
    <input
      type="number"
      value={(value as unknown as number) || ""}
      onChange={(e) => onChange(Number(e.target.value))}
      placeholder={`Enter ${label.toLowerCase()}...`}
      className="border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-lg px-3 py-2 text-sm outline-none transition-all duration-200 bg-white shadow-sm"
    />
  );
}
