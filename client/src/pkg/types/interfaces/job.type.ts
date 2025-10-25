import type { UserInterface } from "./user.type";

export interface JobTaskInterface {
  _id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
}

export interface JobInterface {
  _id: string;
  customerId: string;
  title: string;
  description: string;
  categories: string[];
  location: string;
  status: string;
  budget: number;
  jobTasks?: JobTaskInterface[];
  assignedWorkerId?: UserInterface | null;
  createdAt: string;
  updatedAt: string;
}
