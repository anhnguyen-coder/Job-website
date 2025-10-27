import { NOTI_TYPE } from "../types/enums/noti";
import type { NotificationInterface } from "../types/interfaces/notification";

export const mockNotifications: NotificationInterface[] = [
  {
    _id: "1",
    userId: { _id: "u1", name: "Alice Nguyen", email: "alice@example.com" },
    type: NOTI_TYPE.INFO,
    title: "New Job Application",
    content:
      "Your job posting 'Fix plumbing issue' has received a new applicant. Your job posting 'Fix plumbing issue' has received a new applicant. Your job posting 'Fix plumbing issue' has received a new applicant.",
    isRead: false,
  },
  {
    _id: "2",
    userId: { _id: "u2", name: "Bao Tran", email: "bao@example.com" },
    type: NOTI_TYPE.SUCCESS,
    title: "Payment Completed",
    content:
      "Payment of $120 for 'Website Design' has been successfully processed.",
    isRead: true,
  },
  {
    _id: "3",
    userId: { _id: "u3", name: "Linh Pham", email: "linh@example.com" },
    type: NOTI_TYPE.WARNING,
    title: "Job Deadline Approaching",
    content: "The job 'Home Cleaning Service' is due in 2 hours.",
    isRead: false,
  },
  {
    _id: "4",
    userId: { _id: "u4", name: "David Le", email: "david@example.com" },
    type: NOTI_TYPE.ERROR,
    title: "Payment Failed",
    content:
      "We couldn’t process your payment for 'Car Repair Service'. Please try again.",
    isRead: true,
  },
  {
    _id: "5",
    userId: { _id: "u5", name: "Emma Vo", email: "emma@example.com" },
    type: NOTI_TYPE.INFO,
    title: "Job Cancelled",
    content: "The customer has cancelled the job 'Carpentry Repair'.",
    isRead: false,
  },
  {
    _id: "6",
    userId: { _id: "u6", name: "Huy Dang", email: "huy@example.com" },
    type: NOTI_TYPE.WARNING,
    title: "System Maintenance Notice",
    content:
      "Scheduled maintenance will occur tonight at 10 PM. Some features may be unavailable.",
    isRead: true,
  },
  {
    _id: "7",
    userId: { _id: "u7", name: "Mai Tran", email: "mai@example.com" },
    type: NOTI_TYPE.SUCCESS,
    title: "Job Completed",
    content:
      "The job 'Air Conditioner Installation' has been successfully marked as completed.",
    isRead: false,
  },
  {
    _id: "8",
    userId: { _id: "u8", name: "Nam Vo", email: "nam@example.com" },
    type: NOTI_TYPE.INFO,
    title: "New Review Received",
    content:
      "You received a new 5-star review from Alice Nguyen for 'Interior Painting'.",
    isRead: true,
  },
  {
    _id: "9",
    userId: { _id: "u9", name: "Quynh Le", email: "quynh@example.com" },
    type: NOTI_TYPE.SUCCESS,
    title: "Special Promotion",
    content: "Get 20% off your next service booking this week. Don’t miss out!",
    isRead: false,
  },
  {
    _id: "10",
    userId: { _id: "u10", name: "Son Pham", email: "son@example.com" },
    type: NOTI_TYPE.INFO,
    title: "Job Reminder",
    content: "Reminder: Your job 'Electrical Wiring' starts in 2 hours.",
    isRead: false,
  },
];
