export type FilterFieldInterface<T> = {
  name: keyof T;
  label: string;
  type: "text" | "number" | "select";
  options?: FilterOption[]
};

export type FilterOption = {
  label: string;
  value: string | number;
};