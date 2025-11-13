import { PageHeading } from "@/components/customer/pageheading";
import type React from "react";
import useHook, { type stat } from "./hook";
import { useEffect } from "react";
import { StatItem } from "@/components/customer/statItem";
import { JobList } from "@/components/customer/dashboard/jobList";
import { Notification } from "@/components/customer/dashboard/notification";

import { CUSTOMER_APP_THEME } from "@/constant/constant";
import { LoadingOverlay } from "@/components/base/loading";
import { formatDate, formatUSD } from "@/pkg/helpers/formatter";
import useNotiHooks from "@/hooks/useNoti";
import { BaseTable, type Column } from "@/components/base/baseTable";
import type { PaymentInterface } from "@/pkg/types/interfaces/payment";
import { Pagination } from "@/components/base/pagy";

const Page: React.FC = () => {
  const {
    stats,
    loading,
    jobs,
    handleGetStats,
    handleGetJobList,

    // payment
    paymentLoad,
    payments,
    paymentPage,
    setPaymentPage,
    paymentPagy,
    handleGetPaymentHistory,
  } = useHook();
  const { notifications, handleGetNotiList } = useNotiHooks();

  useEffect(() => {
    handleGetStats();
    handleGetJobList();
    handleGetNotiList(1, false, 5);
  }, []);

  useEffect(() => {
    handleGetPaymentHistory(paymentPage);
  }, [paymentPage]);

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

  if (loading) return <LoadingOverlay />;

  const columns: Column<PaymentInterface>[] = [
    {
      key: "jobId",
      label: "Job Title",
      render: (item) => {
        return <div>{item.jobId.title}</div>;
      },
    },
    {
      key: "workerId",
      label: "Worker",
      render: (item) => {
        return (
          <div>
            <p className="m-0">
              <span>
                <i className="mdi mdi-account-outline text-md"></i>
              </span>
              {item.workerId.name}
            </p>
            <p className="m-0">
              <span>
                <i className="mdi mdi-email-outline text-md"></i>
              </span>
              {item.workerId.email}
            </p>
          </div>
        );
      },
    },
    {
      key: "amount",
      label: "Amount",
      render: (item) => {
        return <span>{formatUSD(item.amount)}</span>;
      },
    },
    {
      key: "status",
      label: "Status",
      render: (item) => {
        return <span>{item.status}</span>;
      },
    },
    {
      key: "status",
      label: "Status",
      render: (item) => {
        return <span>{item.status}</span>;
      },
    },
    {
      key: "paymentMethod",
      label: "Payment method",
      render: (item) => {
        return <span>{item.paymentMethod.replace("_", " ").toLocaleUpperCase()}</span>;
      },
    },
    {
      key: "transactionId",
      label: "TransactionId",
      render: (item) => {
        return <span>{item.transactionId}</span>;
      },
    },
    {
      key: "paidAt",
      label: "Paid at",
      render: (item) => {
        return <span>{formatDate(item.paidAt)}</span>;
      },
    },
  ];

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
              value={stat.id === 2 ? formatUSD(Number(stat.value)) : stat.value}
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
          <Notification notifications={notifications} />
        </div>
      </div>

      {/* payments history */}
      <div className="mt-6">
        <BaseTable
          columns={columns}
          data={payments || []}
          loading={paymentLoad}
          title="Payment history"
          emptyText="No data"
        />

        <Pagination pagy={paymentPagy ?? {}} onPageChange={setPaymentPage} />
      </div>
    </div>
  );
};

export default Page;
