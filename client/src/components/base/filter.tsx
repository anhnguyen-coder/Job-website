import React from "react";
import { SlidersHorizontal } from "lucide-react";
import { flushSync } from "react-dom";
import type { FilterFieldInterface } from "@/pkg/types/interfaces/filterField";
import type { PagyInput } from "@/pkg/types/interfaces/pagy";
import { TextField } from "./textFieldBase";
import { NumberField } from "./numberFieldBase";
import { SelectField } from "./selectFieldBase";
import { InputRangeField } from "./inputNumberRangeFieldBase";

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
  const handleFieldChange = <K extends keyof T>(
    name: K,
    value: T[K] | string | number | null
  ) => {
    onChange({
      ...values,
      [name]: value as T[K],
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values, { page, limit: 10 });
  };

  const handleReset = () => {
    const resetValues = fields.reduce((acc, field) => {
      const key = field.name as keyof T;
      acc[key] = "" as unknown as T[keyof T];
      return acc;
    }, {} as T);

    flushSync(() => onChange(resetValues));
    onSubmit(resetValues, { page: 1, limit: 10 });
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
        {fields.map((field, index) => {
          const commonProps = {
            field,
            values,
            onChange: handleFieldChange,
          };

          switch (field.type) {
            case "text":
              return (
                <TextField key={String(field.name) + index} {...commonProps} />
              );
            case "number":
              return (
                <NumberField
                  key={String(field.name) + index}
                  {...commonProps}
                />
              );
            case "select":
              return (
                <SelectField
                  key={String(field.name) + index}
                  {...commonProps}
                />
              );
            case "inputRange":
              return (
                <InputRangeField
                  key={String(field.name) + index}
                  {...commonProps}
                />
              );
            default:
              return null;
          }
        })}
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
