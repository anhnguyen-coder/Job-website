export const Input = ({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  className,
  iconClassName,
  required,
  labelClassName,
  readOnly,
}: {
  id?: string;
  label?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  iconClassName?: string;
  required?: boolean;
  labelClassName?: string;
  readOnly?: boolean;
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
      <div className="flex items-center border border-slate-200 px-2 py-1 rounded-lg">
        {iconClassName && <i className={iconClassName}></i>}
        <input
          id={id}
          type={type || "text"}
          placeholder={placeholder}
          value={value || ""}
          onChange={onChange}
          required={required}
          readOnly={readOnly}
          className={
            className
              ? className
              : "w-full h-11 border-slate-200 ml-2 focus:outline-none"
          }
        />
      </div>
    </div>
  );
};
