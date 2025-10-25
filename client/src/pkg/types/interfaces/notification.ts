import type { UserInterface } from "./user.type";

export interface NotificationInterface {
  _id: string;
  userId: UserInterface;
  type: string;
  title: string;
  content: string;
  isRead: boolean;
}
