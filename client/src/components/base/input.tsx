export const Input = ({
  id,
  type,
  placeholder,
  value,
  onChange,
  className,
  iconClassName,
}: {
  id?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  iconClassName?: string;
}) => {
  return (
    <div className="flex items-center border border-slate-200 px-2 py-1 rounded-lg">
      <i className={iconClassName}></i>
      <input
        id={id}
        type={type || "text"}
        placeholder={placeholder}
        value={value || ""}
        onChange={onChange}
        className={
          className
            ? className
            : "w-full h-11 border-slate-200 ml-2 focus:outline-none"
        }
      />
    </div>
  );
};
