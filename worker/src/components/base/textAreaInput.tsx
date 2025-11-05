export const TextArea = ({
  id,
  label,
  placeholder,
  value,
  onChange,
  className,
  labelClassName,
  required,
  readOnly,
  rows,
}: {
  id?: string;
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
  labelClassName?: string;
  required?: boolean;
  readOnly?: boolean;
  rows?: number;
}) => {
  return (
    <div className="flex flex-col space-y-1">
      {label && (
        <label
          htmlFor={id}
          className={labelClassName || "text-sm font-medium text-slate-700"}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <textarea
        id={id}
        placeholder={placeholder}
        value={value || ""}
        onChange={onChange}
        required={required}
        readOnly={readOnly}
        rows={rows || 4}
        className={
          className
            ? className
            : `w-full border rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-400 ${
                readOnly
                  ? "bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200"
                  : "border-slate-200"
              }`
        }
      />
    </div>
  );
};
