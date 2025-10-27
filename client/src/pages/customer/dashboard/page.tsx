import { PageHeading } from "@/components/customer/pageheading";
import type React from "react";
import useHook, { type stat } from "./hook";
import { useEffect } from "react";
import { StatItem } from "@/components/customer/statItem";
import { JobList } from "@/components/customer/dashboard/jobList";
import { Notification } from "@/components/customer/dashboard/notification";
import { CUSTOMER_APP_THEME } from "@/constant/constant";
import { mockNotifications } from "@/pkg/data/noti";

const Page: React.FC = () => {
  const { stats, jobs, handleGetStats, handleGetJobList } = useHook();

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
