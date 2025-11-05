import { PageHeading } from "@/components/customer/pageheading";
import useHook from "./hook";
import { Pagination } from "@/components/base/pagy";
import { BaseTable, type Column } from "@/components/base/baseTable";
import type { JobRequestInterface } from "@/pkg/types/interfaces/job.type";
import { FilterBase } from "@/components/base/filter";
import type { FilterFieldInterface } from "@/pkg/types/interfaces/filterField";
import { useState } from "react";
import type { JobRequestQueryInput } from "../type";
import type { PagyInput } from "@/pkg/types/interfaces/pagy";
import { LoadingOverlay } from "@/components/base/loading";
import ModalDetail from "@/components/job/modalDetail";

function Page() {
  const {
    jobRequests,
    pagy,
    page,
    setPage,
    loading,
    statusOptions,
    handleGetJobRequestList,
    makeJobApproval,
  } = useHook();
  const jobRequestColumns: Column<JobRequestInterface>[] = [
    {
      key: "jobTitle",
      label: "Job Title",
      render: (item) => item.jobId?.title || "—",
    },
    {
      key: "worker",
      label: "Worker",
      render: (item) => item.workerId?.name || "—",
    },
    {
      key: "location",
      label: "Location",
      render: (item) => item.jobId?.location || "—",
    },
    {
      key: "budget",
      label: "Budget",
      render: (item) =>
        item.jobId?.budget ? `${item.jobId.budget.toLocaleString()}₫` : "—",
    },
    {
      key: "status",
      label: "Status",
      render: (item) => {
        const statusMap: Record<string, string> = {
          pending: "Pending",
          accepted: "Accepted",
          rejected: "Rejected",
          in_progress: "In Progress",
          completed: "Completed",
        };
        return (
          <span className="capitalize">
            {statusMap[item.status] || item.status}
          </span>
        );
      },
    },
  ];
  const [query, setQuery] = useState<JobRequestQueryInput>({ status: "" });
  const [openModal, setOpenModal] = useState(false);
  const [jobRequest, setJobRequest] = useState<JobRequestInterface>();

  const filter: FilterFieldInterface<JobRequestQueryInput>[] = [
    {
      name: "status",
      label: "Status",
      type: "select",
      options: statusOptions,
    },
  ];

  const handleSearch = (input: JobRequestQueryInput, pagyInput: PagyInput) => {
    setPage(pagyInput.page);
    handleGetJobRequestList(input);
  };

  const onRowClick = (id: string) => {
    const jobRequest = jobRequests?.find((e) => e._id === id);
    if (jobRequest) {
      setJobRequest(jobRequest);
      setOpenModal(true);
    }
  };

  if (loading) return <LoadingOverlay />;

  return (
    <div>
      <PageHeading title="Job request list" />
      {/* filter base */}
      <div className="my-4">
        <FilterBase
          fields={filter}
          values={query}
          onChange={(val) => setQuery(val)}
          onSubmit={handleSearch}
          page={page}
        />
      </div>

      {/* content */}
      <div className="">
        <BaseTable
          title="Job request list"
          columns={jobRequestColumns}
          data={jobRequests ?? []}
          loading={loading}
          onRowClick={onRowClick}
        />
      </div>

      <Pagination pagy={pagy ?? {}} onPageChange={setPage} />

      {openModal && jobRequest && (
        <ModalDetail
          jobRequest={jobRequest}
          isOpen={openModal}
          onOpenChange={() => setOpenModal(false)}
          makeAcceptRequest={makeJobApproval}
        />
      )}
    </div>
  );
}

export default Page;
