import { FilterBase } from "@/components/base/filter";
import { PageHeading } from "@/components/customer/pageheading";
import React, { useEffect } from "react";
import useHook from "./hook";
import type { FilterFieldInterface } from "@/pkg/types/interfaces/filterField";
import type { JobsQueryInputForm } from "./type";
import { JOB_STATUS } from "@/pkg/types/enums/job";
import { JobList } from "@/components/customer/job/jobList";
import { Pagination } from "@/components/base/pagy";

const Page: React.FC = () => {
  const {
    jobs,
    queryInput,
    pagy,
    page,
    categoriesOptions,
    setPage,
    setQueryInput,
    handleGetJobs,
    handleGetCategories,
  } = useHook();

  const statusOptions = [
    { label: "Available", value: JOB_STATUS.AVAILABLE },
    { label: "Taken", value: JOB_STATUS.TAKEN },
    { label: "In progress", value: JOB_STATUS.IN_PROGRESS },
    { label: "Check complete", value: JOB_STATUS.CHECK_COMPLETE },
    { label: "Completed", value: JOB_STATUS.COMPLETED },
    { label: "Cancelled", value: JOB_STATUS.CANCELLED },
  ];
  const fields: FilterFieldInterface<JobsQueryInputForm>[] = [
    { name: "title", label: "Title", type: "text" },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: Object.values(statusOptions),
    },
    { name: "budget", label: "Budget", type: "inputRange" },
    { name: "location", label: "Location", type: "text" },
    {
      name: "category",
      label: "Category",
      type: "select",
      options: categoriesOptions,
    },
  ] as const;

  useEffect(() => {
    const pagyInput = {
      page: page,
      limit: 10,
    };
    handleGetJobs(queryInput, pagyInput);
  }, [page]);

  useEffect(() => {
    if (categoriesOptions && categoriesOptions.length > 0) return;
    handleGetCategories();
  }, [categoriesOptions, handleGetCategories]);

  return (
    <div>
      <PageHeading title="Jobs" />

      <div className="mt-4">
        <FilterBase
          fields={fields}
          values={queryInput}
          page={page}
          onChange={setQueryInput}
          onSubmit={handleGetJobs}
        />
      </div>

      {/* job list */}
      <div className="py-4 px-6 rounded-2xl shadow-lg bg-white mt-6">
        {jobs && <JobList jobs={jobs} />}
      </div>

      <div>{pagy && <Pagination pagy={pagy} onPageChange={setPage} />}</div>
    </div>
  );
};

export default Page;
