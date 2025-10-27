export interface JobsQueryInputForm {
  status?: string;
  title?: string;
  category?: string;
  location?: string;
  budget?: rageNumberInput;
}

export interface rageNumberInput {
  min?: number;
  max?: number;
}
