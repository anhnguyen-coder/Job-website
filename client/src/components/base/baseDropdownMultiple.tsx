import { useState, useRef, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";

interface Option {
  label: string;
  value: string;
}

interface BaseDropdownMultiProps {
  label?: string;
  options: Option[];
  selected: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

export function BaseDropdownMulti({
  label,
  options,
  selected,
  onChange,
  placeholder = "Select options...",
}: BaseDropdownMultiProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleSelect = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className="w-full relative" ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      {/* Dropdown toggle */}
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="border border-gray-300 rounded-lg p-2.5 bg-white flex items-center justify-between cursor-pointer hover:border-blue-400 transition"
      >
        <div className="flex flex-wrap gap-2 items-center">
          {selected.length > 0 ? (
            selected.map((val) => {
              const opt = options.find((o) => o.value === val);
              return (
                <span
                  key={val}
                  className="flex items-center bg-blue-100 text-blue-700 text-sm px-2 py-1 rounded-md"
                >
                  {opt?.label}
                  <X
                    size={14}
                    className="ml-1 cursor-pointer hover:text-red-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSelect(val);
                    }}
                  />
                </span>
              );
            })
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </div>
        <ChevronDown
          size={18}
          className={`text-gray-500 transition ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      {/* Dropdown list */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-1 border border-gray-300 rounded-lg bg-white shadow-md max-h-60 overflow-y-auto z-50 w-full">
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => toggleSelect(opt.value)}
              className={`p-2 cursor-pointer hover:bg-blue-50 flex items-center justify-between ${
                selected.includes(opt.value) ? "bg-blue-100" : ""
              }`}
            >
              <span>{opt.label}</span>
              {selected.includes(opt.value) && (
                <span className="text-blue-600 text-sm font-semibold">✓</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
