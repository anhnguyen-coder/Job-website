import { JOB_STATUS } from "@/pkg/enums/job";
import useHook from "./hook";
import type { FilterFieldInterface } from "@/pkg/interfaces/filterField";
import type { JobsQueryInputForm } from "./type";
import { useEffect } from "react";
import { PageHeading } from "@/components/base/pageheading";
import { FilterBase } from "@/components/base/filter";
import { JobList } from "@/components/job/jobList";
import { Pagination } from "@/components/base/pagy";

const Page: React.FC = () => {
  const {
    jobs,
    queryInput,
    pagy,
    page,
    setPage,
    setQueryInput,
    handleGetJobs,
    categoriesOptions,
  } = useHook();

  const fields: FilterFieldInterface<JobsQueryInputForm>[] = [
    { name: "title", label: "Title", type: "text" },

    { name: "minBudget", label: "Budget min", type: "number" },
    { name: "maxBudget", label: "Budget max", type: "number" },

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
