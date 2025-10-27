import type { FilterFieldInterface } from "@/pkg/types/interfaces/filterField";
import React from "react";

interface DateTimeInputFieldProps<T extends object> {
  field: FilterFieldInterface<T>;
  values: T;
  onChange: <K extends keyof T>(name: K, value: T[K]) => void;
}

export function DateTimeInputFieldBase<T extends object>({
  field,
  values,
  onChange,
}: DateTimeInputFieldProps<T>) {
  const value = values[field.name] as Date | string | null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const parsedValue = val ? new Date(val) : null;
    onChange(field.name, parsedValue as T[keyof T]);
  };

  const formatValue = (val: Date | string | null) => {
    if (!val) return "";
    const d = val instanceof Date ? val : new Date(val);
    // Convert to YYYY-MM-DDTHH:mm (without timezone offset)
    const localISO = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    return localISO;
  };

  return (
    <div className="flex flex-col">
      <label
        htmlFor={String(field.name)}
        className="text-sm font-medium text-gray-700 mb-1"
      >
        {field.label}
      </label>

      <input
        id={String(field.name)}
        type="datetime-local"
        value={formatValue(value)}
        onChange={handleChange}
        placeholder={`Select ${field.label.toLowerCase()}...`}
        className="border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-lg px-3 py-2 text-sm outline-none transition-all duration-200 bg-white shadow-sm"
      />
    </div>
  );
}
