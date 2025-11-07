import { useState } from "react";
import useHook from "./hook";
import { PageHeading } from "@/components/base/pageheading";
import type { FilterFieldInterface } from "@/pkg/interfaces/filterField";
import type { CurrentListJobQueryInput } from "./type";
import { FilterBase } from "@/components/base/filter";
import { Pagination } from "@/components/base/pagy";
import CurrentJobList from "@/components/job/currentJobList";
import { LoadingOverlay } from "@/components/base/loading";

function Page() {
  const {
    jobs,
    loading,
    handleGetMyCurrentListJobs,
    page,
    pagy,
    setPage,
    statusRequestOptions,
  } = useHook();

  const [query, setQuery] = useState<CurrentListJobQueryInput>({ status: "" });

  const fields: FilterFieldInterface<CurrentListJobQueryInput>[] = [
    {
      name: "status",
      label: "Status",
      type: "select",
      options: statusRequestOptions,
    },
  ];

  if (loading) return <LoadingOverlay />;
  return (
    <div className="flex flex-col gap-4">
      <PageHeading title="Current Jobs" />

      <FilterBase
        fields={fields}
        values={query}
        onChange={(val) => setQuery(val)}
        onSubmit={handleGetMyCurrentListJobs}
        page={page}
      />

      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        {jobs && <CurrentJobList jobs={jobs} />}
      </div>

      <Pagination pagy={pagy ?? {}} onPageChange={setPage} />
    </div>
  );
}

export default Page;
