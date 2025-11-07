import { Search } from "lucide-react";

type TextFieldProps<T> = {
  label: string;
  value: T;
  onChange: (value: string) => void;
};

export function TextField<T>({ label, value, onChange }: TextFieldProps<T>) {
  return (
    <div className="relative">
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
      <input
        type="text"
        value={(value as unknown as string) || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`Search ${label.toLowerCase()}...`}
        className="w-full border border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-lg pl-9 pr-3 py-2 text-sm outline-none transition-all duration-200 bg-white shadow-sm"
      />
    </div>
  );
}
