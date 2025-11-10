import type { JobInterface } from "./job.type";
import type { UserInterface } from "./user.type";

export interface RatingInterface {
  _id: string;
  authorId: UserInterface;
  authorType: string;
  targetType: string;
  targetId: UserInterface;
  jobId: JobInterface;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface RatingStatsInterface {
  avgRating: number;
  totalRatings: number;
  fiveStars: number;
  positiveSentiment: number;
}

export interface RatingDistributionInterface {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
}

export interface RatingSentimentInterface {
  positive: number;
  neutral: number;
  negative: number;
}
