export type FilterFieldInterface<T> = {
  name: keyof T;
  label: string;
  type: "text" | "number" | "select" | "inputRange" | "datetime";
  options?: FilterOption[];
  rangeKeys?: {
    min: keyof T;
    max: keyof T;
  };
};

export type FilterOption = {
  label: string;
  value: string | number;
};
