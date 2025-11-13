import type { JobInterface } from "./job.type";
import type { UserInterface } from "./user.type";

export interface PaymentInterface {
  _id: string;
  jobId: JobInterface;
  customerId: UserInterface;
  workerId: UserInterface;
  amount: number;
  status: string;
  paymentMethod: string;
  transactionId: string;
  paidAt: string;
}
