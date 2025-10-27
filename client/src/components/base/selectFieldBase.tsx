import type { FilterFieldInterface } from "@/pkg/types/interfaces/filterField";

interface SelectFieldProps<T extends object> {
  field: FilterFieldInterface<T>;
  values: T;
  onChange: <K extends keyof T>(name: K, value: T[K]) => void;
}

export function SelectField<T extends object>({
  field,
  values,
  onChange,
}: SelectFieldProps<T>) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-1">
        {field.label}
      </label>
      <select
        value={(values[field.name] as string) || ""}
        onChange={(e) => onChange(field.name, e.target.value as T[keyof T])}
        className="border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-lg px-3 py-2 text-sm outline-none transition-all duration-200 bg-white shadow-sm"
      >
        <option value="">-- Select --</option>
        {field.options?.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
