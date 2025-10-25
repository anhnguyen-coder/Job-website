import { FilterBase } from "@/components/base/filter";
import { PageHeading } from "@/components/customer/pageheading";
import React, { useEffect } from "react";
import useHook from "./hook";
import type { FilterFieldInterface } from "@/pkg/types/interfaces/filterField";
import type { JobsQueryInputForm } from "./type";
import { JOB_STATUS } from "@/pkg/types/enums/job";
import { JobList } from "@/components/customer/job/jobList";

const Page: React.FC = () => {
  const statusOptions = [
    { label: "Available", value: JOB_STATUS.AVAILABLE },
    { label: "Taken", value: JOB_STATUS.TAKEN },
    { label: "In progress", value: JOB_STATUS.IN_PROGRESS },
    { label: "Check complete", value: JOB_STATUS.CHECK_COMPLETE },
    { label: "Completed", value: JOB_STATUS.COMPLETED },
    { label: "Cancelled", value: JOB_STATUS.CANCELLED },
  ];
  const { jobs, queryInput, setQueryInput, handleGetJobs } = useHook();

  const fields: FilterFieldInterface<JobsQueryInputForm>[] = [
    { name: "title", label: "Title", type: "text" },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: Object.values(statusOptions),
    },
    { name: "budget", label: "Budget", type: "number" },
    { name: "location", label: "Location", type: "text" },
    { name: "category", label: "Category", type: "select", options: [] },
  ] as const;

  useEffect(() => {
    handleGetJobs(queryInput);
  }, []);

  return (
    <div>
      <PageHeading title="Jobs" />

      <div className="mt-4">
        <FilterBase
          fields={fields}
          values={queryInput}
          onChange={setQueryInput}
          onSubmit={handleGetJobs}
        />
      </div>

      {/* job list */}
      {jobs && <JobList jobs={jobs} />}
    </div>
  );
};

export default Page;
