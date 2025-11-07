import type { CategoryInterface } from "./category";
import type { UserInterface } from "./user.type";

export interface JobTaskInterface {
  _id: string;
  title: string;
  description: string;
  isCompleted: boolean;
}

export interface JobInterface {
  _id: string;
  customerId: UserInterface;
  title: string;
  description: string;
  categories: CategoryInterface[];
  location: string;
  status: string;
  budget: number;
  jobTasks?: JobTaskInterface[];
  assignedWorkerId?: UserInterface | null;
  createdAt: string;
  updatedAt: string;
}

export interface JobRequestInterface {
  _id: string;
  jobId: JobInterface;
  workerId: UserInterface;
  customerId: UserInterface;
  status: string;
  createdAt: string;
  updatedAt: string;
}
