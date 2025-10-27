import { Search } from "lucide-react";
import type { FilterFieldInterface } from "@/pkg/types/interfaces/filterField";

interface TextFieldProps<T extends object> {
  field: FilterFieldInterface<T>;
  values: T;
  onChange: <K extends keyof T>(name: K, value: T[K]) => void;
}

export function TextField<T extends object>({
  field,
  values,
  onChange,
}: TextFieldProps<T>) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-1">
        {field.label}
      </label>
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          value={(values[field.name] as string) || ""}
          onChange={(e) => onChange(field.name, e.target.value as T[keyof T])}
          placeholder={`Search ${field.label.toLowerCase()}...`}
          className="w-full border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-lg pl-9 pr-3 py-2 text-sm outline-none transition-all duration-200 bg-white shadow-sm"
        />
      </div>
    </div>
  );
}
