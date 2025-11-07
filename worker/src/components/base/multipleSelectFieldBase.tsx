import { useState, useRef, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";

type Option = {
  label: string;
  value: string | number;
};

type MultipleSelectFieldProps = {
  value?: (string | number)[];
  options: Option[];
  onChange: (values: (string | number)[]) => void;
  placeholder?: string;
};

export function MultipleSelectField({
  value = [],
  options,
  onChange,
  placeholder = "Select options...",
}: MultipleSelectFieldProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (val: string | number) => {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      onChange([...value, val]);
    }
  };

  const removeOption = (val: string | number) => {
    onChange(value.filter((v) => v !== val));
  };

  const selectedOptions = options.filter((opt) => value.includes(opt.value));

  return (
    <div className="relative" ref={ref}>
      {/* Input box */}
      <div
        className="border border-gray-300 rounded-lg px-3 py-2 bg-white shadow-sm flex items-center justify-between cursor-pointer focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100"
        onClick={() => setOpen((prev) => !prev)}
      >
        <div className="flex flex-wrap gap-2 items-center flex-1">
          {selectedOptions.length > 0 ? (
            selectedOptions.map((opt) => (
              <span
                key={opt.value}
                className="bg-blue-100 text-blue-700 px-2 py-1 text-xs rounded-lg flex items-center gap-1"
              >
                {opt.label}
                <X
                  size={12}
                  className="cursor-pointer hover:text-blue-900"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeOption(opt.value);
                  }}
                />
              </span>
            ))
          ) : (
            <span className="text-gray-400 text-sm">{placeholder}</span>
          )}
        </div>
        <ChevronDown
          size={18}
          className={`text-gray-500 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Dropdown list */}
      {open && (
        <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-md max-h-56 overflow-y-auto">
          {options.map((opt) => {
            const isSelected = value.includes(opt.value);
            return (
              <div
                key={opt.value}
                onClick={() => toggleOption(opt.value)}
                className={`px-3 py-2 cursor-pointer text-sm flex items-center justify-between hover:bg-blue-50 ${
                  isSelected ? "bg-blue-100 text-blue-700" : "text-gray-700"
                }`}
              >
                <span>{opt.label}</span>
                {isSelected && (
                  <span className="text-blue-600 font-semibold text-xs">✓</span>
                )}
              </div>
            );
          })}
          {options.length === 0 && (
            <div className="px-3 py-2 text-sm text-gray-400">
              No options available
            </div>
          )}
        </div>
      )}
    </div>
  );
}
