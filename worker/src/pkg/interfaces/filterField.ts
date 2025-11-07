export type FilterFieldInterface<T> = {
  name: keyof T;
  label: string;
  type: "text" | "number" | "select" | "multiSelect" | "date";
  options?: FilterOption[];
};

export type FilterOption = {
  label: string;
  value: string | number;
};
