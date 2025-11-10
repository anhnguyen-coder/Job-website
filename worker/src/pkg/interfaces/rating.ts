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
