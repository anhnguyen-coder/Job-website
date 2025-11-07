import type { FilterFieldInterface } from "@/pkg/interfaces/filterField";
import type { PagyInput } from "@/pkg/interfaces/pagy";
import { SlidersHorizontal } from "lucide-react";
import { flushSync } from "react-dom";
import { TextField } from "./textFieldBase";
import { NumberField } from "./numberFieldBase";
import { SelectField } from "./singleSelectFieldBase";
import { DateField } from "./dateFieldBase";
import { MultipleSelectField } from "./multipleSelectFieldBase";

type FilterBaseProps<T extends object> = {
  fields: FilterFieldInterface<T>[];
  page: number;
  values: T;
  onChange: (values: T) => void;
  onSubmit: (queries: T, pagyInput: PagyInput) => Promise<void>;
};

export function FilterBase<T extends object>({
  fields,
  values,
  page,
  onChange,
  onSubmit,
}: FilterBaseProps<T>) {
  const handleFieldChange = <K extends keyof T>(name: K, value: T[K]) => {
    onChange({
      ...values,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const pagyInput = {
      page: page,
      limit: 10,
    };
    await onSubmit(values, pagyInput);
  };

  const handleReset = async () => {
    const resetValues = fields.reduce((acc, field) => {
      const key = field.name as keyof T;
      acc[key] = "" as unknown as T[keyof T];
      return acc;
    }, {} as T);

    flushSync(() => onChange(resetValues));

    await onSubmit(resetValues, { page: 1, limit: 10 }); // <- dùng resetValues trực tiếp
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
              <TextField
                label={field.label}
                value={values[field.name]}
                onChange={(val) =>
                  handleFieldChange(field.name as keyof T, val as T[keyof T])
                }
              />
            )}

            {field.type === "number" && (
              <NumberField
                label={field.label}
                value={values[field.name]}
                onChange={(val) =>
                  handleFieldChange(field.name as keyof T, val as T[keyof T])
                }
              />
            )}

            {field.type === "select" && field.options && (
              <SelectField
                label={field.label}
                value={values[field.name]}
                options={field.options}
                onChange={(val) =>
                  handleFieldChange(field.name as keyof T, val as T[keyof T])
                }
              />
            )}

            {field.type === "date" && (
              <DateField
                value={values[field.name] as unknown as string | undefined}
                onChange={(val) =>
                  handleFieldChange(field.name as keyof T, val as T[keyof T])
                }
              />
            )}

            {field.type === "multiSelect" && field.options && (
              <MultipleSelectField
                value={values[field.name] as unknown as (string | number)[]}
                options={field.options}
                onChange={(val) =>
                  handleFieldChange(field.name as keyof T, val as T[keyof T])
                }
              />
            )}
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={handleReset}
          className="text-sm font-medium px-5 py-2.5 rounded-3 border border-gray-300 text-gray-700 bg-gray-100 hover:bg-gray-200 active:scale-95 transition-all duration-150"
        >
          Reset
        </button>

        <button
          type="submit"
          className="text-sm font-semibold px-5 py-2.5 rounded-3 bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-all duration-150 shadow-sm"
        >
          Apply Filters
        </button>
      </div>
    </form>
  );
}
