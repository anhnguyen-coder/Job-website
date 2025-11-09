import type { UserInterface } from "./user.type";

export interface RatingInterface {
  _id: string;
  authorId: UserInterface;
  authorType: string;
  targetType: string;
  targetId: UserInterface;
  jobId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}
