import { PageHeading } from "@/components/customer/pageheading";
import type React from "react";
import useHook, { type stat } from "./hook";
import { useEffect } from "react";
import { StatItem } from "@/components/customer/statItem";

const Page: React.FC = () => {
  const { stats, loading, err, handleGetStats } = useHook();

  useEffect(() => {
    handleGetStats();
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
        return "bg-blue-500";
      case 2:
        return "bg-green-500";
      case 3:
        return "bg-yellow-500";
      case 4:
        return "bg-red-500";
    }
    return "";
  };

  return (
    <div>
      <PageHeading title="Dashboard" />

      {/* stats */}
      <div className="grid xl:grid-cols-4 sm:grid-cols-2 xs:grid-col-1 p-4 gap-4">
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

      <h1>Customer Dashboard</h1>
    </div>
  );
};

export default Page;
