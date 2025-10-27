import type { FilterFieldInterface } from "@/pkg/types/interfaces/filterField";

interface InputRangeFieldProps<T extends object> {
  field: FilterFieldInterface<T>;
  values: T;
  onChange: <K extends keyof T>(name: K, value: T[K] | null) => void;
}

export function InputRangeField<T extends object>({
  field,
  values,
  onChange,
}: InputRangeFieldProps<T>) {
  const minKey = `${String(field.name)}Min` as keyof T;
  const maxKey = `${String(field.name)}Max` as keyof T;

  const minValue = values[minKey] as number | null;
  const maxValue = values[maxKey] as number | null;

  // ✅ Validate logic
  const isInvalid =
    minValue != null &&
    maxValue != null &&
    !Number.isNaN(minValue) &&
    !Number.isNaN(maxValue) &&
    maxValue < minValue;

  const errorMessage = isInvalid
    ? "Max must be greater than or equal to Min"
    : "";

  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-1">
        {field.label}
      </label>

      <div className="flex gap-2">
        <input
          type="number"
          placeholder="Min"
          value={minValue ?? ""}
          onChange={(e) =>
            onChange(
              minKey,
              e.target.value === ""
                ? null
                : (Number(e.target.value) as T[keyof T])
            )
          }
          className={`w-full border ${
            isInvalid ? "border-red-400" : "border-gray-300"
          } focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-lg px-3 py-2 text-sm outline-none transition-all duration-200 bg-white shadow-sm`}
        />
        <input
          type="number"
          placeholder="Max"
          value={maxValue ?? ""}
          onChange={(e) =>
            onChange(
              maxKey,
              e.target.value === ""
                ? null
                : (Number(e.target.value) as T[keyof T])
            )
          }
          className={`w-full border ${
            isInvalid ? "border-red-400" : "border-gray-300"
          } focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-lg px-3 py-2 text-sm outline-none transition-all duration-200 bg-white shadow-sm`}
        />
      </div>

      {isInvalid && (
        <p className="mt-1 text-xs text-red-500 font-medium">{errorMessage}</p>
      )}
    </div>
  );
}
