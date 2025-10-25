import { PageHeading } from "@/components/customer/pageheading";
import type React from "react";
import useHook, { type stat } from "./hook";
import { useEffect } from "react";
import { StatItem } from "@/components/customer/statItem";
import { JobList } from "@/components/customer/job/jobList";
import { Notification } from "@/components/customer/dashboard/notification";
import type { NotificationInterface } from "@/pkg/types/interfaces/notification";
import { NOTI_TYPE } from "@/pkg/types/enums/noti";
import { CUSTOMER_APP_THEME } from "@/constant/constant";

const Page: React.FC = () => {
  const { stats, loading, err, jobs, handleGetStats, handleGetJobList } =
    useHook();

  useEffect(() => {
    handleGetStats();
    handleGetJobList();
  }, []);

  const getIconBasedOnStat = (stat: stat) => {
    switch (stat.id) {
      case 1:
        return "mdi mdi-calendar";
      case 2:
        return "mdi mdi-cash";
      case 3:
        return "mdi mdi-check";
      case 4:
        return "mdi mdi-star";
    }
    return "";
  };

  const getStatColor = (stat: stat) => {
    switch (stat.id) {
      case 1:
        return CUSTOMER_APP_THEME.COLOR.PRIMARY;
      case 2:
        return CUSTOMER_APP_THEME.COLOR.SECONDARY;
      case 3:
        return CUSTOMER_APP_THEME.COLOR.WARNING;
      case 4:
        return CUSTOMER_APP_THEME.COLOR.DANGER;
    }
    return "";
  };

  return (
    <div className="p-4">
      <PageHeading title="Dashboard" />

      {/* ===== Stats Section ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        {stats &&
          stats.map((stat) => (
            <StatItem
              key={stat.id}
              label={stat.label}
              value={stat.value}
              icon={getIconBasedOnStat(stat)}
              color={getStatColor(stat)}
            />
          ))}
      </div>

      {/* ===== Dashboard & Notifications ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 mt-6">
        {/* Job List */}
        <div className="bg-white px-6 py-4 rounded-xl border border-gray-200 shadow-sm h-fit">
          {jobs && <JobList jobs={jobs} />}
        </div>

        {/* Notifications */}
        <div className="bg-white px-6 py-4 rounded-xl border border-gray-200 shadow-sm h-fit">
          <Notification notifications={mockNotifications} />
        </div>
      </div>
    </div>
  );
};

export default Page;

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
