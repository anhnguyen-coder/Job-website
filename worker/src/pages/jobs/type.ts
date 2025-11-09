export interface JobsQueryInputForm {
  title?: string;
  category?: string;
  location?: string;
  minBudget?: number;
  maxBudget?: number;
}

export interface JobRequestQueryInput {
  status?: string;
}

export type RatingInput = {
  targetType: string;
  targetId: string;
  jobId: string;
  rating: number;
  comment: string;
};
