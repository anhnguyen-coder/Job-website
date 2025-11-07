import type { FilterOption } from "@/pkg/interfaces/filterField";

type SelectFieldProps<T> = {
  label: string;
  value: T;
  options?: FilterOption[];
  onChange: (value: string) => void;
};

export function SelectField<T>({
  value,
  options,
  onChange,
}: SelectFieldProps<T>) {
  return (
    <select
      value={(value as unknown as string) || ""}
      onChange={(e) => onChange(e.target.value)}
      className="border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-lg px-3 py-2 text-sm outline-none transition-all duration-200 bg-white shadow-sm"
    >
      <option value="">-- Select --</option>

      {options &&
        options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
    </select>
  );
}
