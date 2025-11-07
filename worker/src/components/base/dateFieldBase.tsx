import type React from "react";

type DateFieldProps = {
  value?: string;
  onChange: (value: string) => void;
};

export function DateField({ value, onChange }: DateFieldProps) {
  // Chỉ lấy YYYY-MM-DD để hiển thị trong input
  const inputValue = value ? new Date(value).toISOString().slice(0, 10) : "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value; // dạng YYYY-MM-DD
    onChange(selectedDate); // ✅ truyền giá trị vào callback
  };

  return (
    <div className="flex flex-col">
      <input
        type="date"
        value={inputValue}
        onChange={handleChange}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 bg-white shadow-sm"
      />
    </div>
  );
}
