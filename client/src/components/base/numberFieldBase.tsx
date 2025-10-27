import type { FilterFieldInterface } from "@/pkg/types/interfaces/filterField";

interface NumberFieldProps<T extends object> {
  field: FilterFieldInterface<T>;
  values: T;
  onChange: <K extends keyof T>(name: K, value: T[K]) => void;
}

export function NumberField<T extends object>({
  field,
  values,
  onChange,
}: NumberFieldProps<T>) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-1">
        {field.label}
      </label>
      <input
        type="number"
        value={(values[field.name] as number) || ""}
        onChange={(e) =>
          onChange(field.name, Number(e.target.value) as T[keyof T])
        }
        placeholder={`Enter ${field.label.toLowerCase()}...`}
        className="border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-lg px-3 py-2 text-sm outline-none transition-all duration-200 bg-white shadow-sm"
      />
    </div>
  );
}
