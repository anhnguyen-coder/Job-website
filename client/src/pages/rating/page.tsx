import { PageHeading } from "@/components/customer/pageheading";
import Stats from "@/components/rating/stats";
import useHook from "./hook";
import { LoadingOverlay } from "@/components/base/loading";
import Chart from "./chart";
import { BaseTable, type Column } from "@/components/base/baseTable";
import type { RatingInterface } from "@/pkg/types/interfaces/rating";
import { formatDateDDMMYYYY } from "@/pkg/helpers/formatter";
import { Pagination } from "@/components/base/pagy";

function Page() {
  const {
    stats,
    loading,
    ratingDistribution,
    sentimentDistribution,
    ratings,
    pagy,
    setPage,
  } = useHook();

  const columns: Column<RatingInterface>[] = [
    {
      key: "authorId",
      label: "Author",
      render: (item) => {
        return (
          <span>
            <span>
              <i className="mdi mdi-account mr-2"></i>
            </span>
            {item.authorId?.name}
          </span>
        );
      },
    },
    {
      key: "authorId",
      label: "Email",
      render: (item) => {
        return (
          <span>
            <span>
              <i className="mdi mdi-email mr-2"></i>
            </span>
            {item.authorId?.email}
          </span>
        );
      },
    },
    {
      key: "rating",
      label: "Rating",
      render: (item) => {
        return (
          <span>
            {item.rating} / 5{" "}
            <span>
              <i className="mdi mdi-star text-yellow-500"></i>
            </span>
          </span>
        );
      },
    },
    {
      key: "comment",
      label: "Comment",
      render: (item) => {
        return <pre>{item.comment || "No comment"}</pre>;
      },
    },
    {
      key: "jobId",
      label: "Job",
      render: (item) => {
        return <span>{item.jobId?.title}</span>;
      },
    },
    {
      key: "createdAt",
      label: "Date",
      render: (item) => {
        return (
          <span>
            <span>
              <i className="mdi mdi-calendar mr-2"></i>
            </span>
            {formatDateDDMMYYYY(item.createdAt)}
          </span>
        );
      },
    },
  ];

  if (loading) return <LoadingOverlay />;
  return (
    <div className="flex flex-col gap-5">
      <PageHeading title="Reviews" />

      {/* stats */}
      {stats && <Stats stats={stats} />}

      {/* charts */}
      {ratingDistribution && sentimentDistribution && (
        <Chart rating={ratingDistribution} sentiment={sentimentDistribution} />
      )}

      {/* table list */}
      <BaseTable
        columns={columns}
        data={ratings || []}
        loading={loading}
        title="Your Reviews"
        emptyText="You have not received any reviews yet."
        onRowClick={() => {}}
      />

      <Pagination pagy={pagy ?? {}} onPageChange={setPage} />
    </div>
  );
}

export default Page;
