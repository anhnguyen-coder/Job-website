import type { JobInterface } from "./job.type";
import type { UserInterface } from "./user.type";

export interface RatingInterface {
  _id: string;
  authorType: "worker" | "customer";
  authorId: UserInterface;
  targetId: UserInterface;
  targetType: "worker" | "customer";
  jobId: JobInterface;
  rating: number;
  comment?: string;
  createdAt: Date;
  updatedAt: Date;
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
