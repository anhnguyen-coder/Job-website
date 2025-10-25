import type { FilterFieldInterface } from "@/pkg/types/interfaces/filterField";
import React from "react";
import { Search, SlidersHorizontal } from "lucide-react"; // icon đẹp
import { flushSync } from "react-dom";
import type { PagyInput } from "@/pkg/types/interfaces/pagy";

type FilterBaseProps<T extends object> = {
  fields: FilterFieldInterface<T>[];
  page: number;
  values: T;
  onChange: (values: T) => void;
  onSubmit: (queries: T, pagyInput: PagyInput) => void;
};

export function FilterBase<T extends object>({
  fields,
  values,
  page,
  onChange,
  onSubmit,
}: FilterBaseProps<T>) {
  const handleFieldChange = (name: keyof T, value: any) => {
    onChange({
      ...values,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pagyInput = {
      page: page,
      limit: 10,
    };
    onSubmit(values, pagyInput);
  };

  const handleReset = () => {
    const resetValues = fields.reduce((acc, field) => {
      const key = field.name as keyof T;
      if (field.type === "number") acc[key] = "" as unknown as T[keyof T];
      else acc[key] = "" as unknown as T[keyof T];
      return acc;
    }, {} as T);

    flushSync(() => onChange(resetValues));
    const pagyInput = {
      page: 1,
      limit: 10,
    };
    onSubmit(resetValues, pagyInput);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 bg-gradient-to-br from-white to-gray-50 border border-gray-100 rounded-2xl shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2 text-gray-700 font-semibold text-base">
          <SlidersHorizontal size={18} className="text-blue-600" />
          <span>Filters</span>
        </div>
      </div>

      {/* Filter Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {fields.map((field) => (
          <div key={String(field.name)} className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              {field.label}
            </label>

            {field.type === "text" && (
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={(values[field.name] as string) || ""}
                  onChange={(e) =>
                    handleFieldChange(field.name, e.target.value)
                  }
                  placeholder={`Search ${field.label.toLowerCase()}...`}
                  className="w-full border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-lg pl-9 pr-3 py-2 text-sm outline-none transition-all duration-200 bg-white shadow-sm"
                />
              </div>
            )}

            {field.type === "number" && (
              <input
                type="number"
                value={(values[field.name] as number) || ""}
                onChange={(e) =>
                  handleFieldChange(field.name, Number(e.target.value))
                }
                placeholder={`Enter ${field.label.toLowerCase()}...`}
                className="border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-lg px-3 py-2 text-sm outline-none transition-all duration-200 bg-white shadow-sm"
              />
            )}

            {field.type === "select" && field.options && (
              <select
                value={(values[field.name] as string) || ""}
                onChange={(e) => handleFieldChange(field.name, e.target.value)}
                className="border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-lg px-3 py-2 text-sm outline-none transition-all duration-200 bg-white shadow-sm"
              >
                <option value="">-- Select --</option>
                {field.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={handleReset}
          className="text-sm font-medium px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 bg-gray-100 hover:bg-gray-200 active:scale-95 transition-all duration-150"
        >
          Reset
        </button>

        <button
          type="submit"
          className="text-sm font-semibold px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-all duration-150 shadow-sm"
        >
          Apply Filters
        </button>
      </div>
    </form>
  );
}
