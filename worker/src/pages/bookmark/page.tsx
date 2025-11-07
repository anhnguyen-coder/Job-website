import { PageHeading } from "@/components/base/pageheading";
import type { FilterFieldInterface } from "@/pkg/interfaces/filterField";
import type { JobBookmarkQueryFormInput } from "./type";
import { FilterBase } from "@/components/base/filter";
import useHook from "./hook";
import { LoadingOverlay } from "@/components/base/loading";
import { useState } from "react";
import type { PagyInput } from "@/pkg/interfaces/pagy";
import { Pagination } from "@/components/base/pagy";
import { JobList } from "@/components/job/jobList";

function Page() {
  const {
    categoriesOptions,
    loading,
    pagy,
    setPage,
    jobs,
    page,
    handleGetBookmarkedList,
  } = useHook();
  const [query, setQuery] = useState<JobBookmarkQueryFormInput>({
    title: "",
    minBudget: "",
    maxBudget: "",
    categories: [],
  });

  const fields: FilterFieldInterface<JobBookmarkQueryFormInput>[] = [
    { name: "title", label: "Title", type: "text" },

    { name: "minBudget", label: "Budget min", type: "number" },
    { name: "maxBudget", label: "Budget max", type: "number" },

    {
      name: "categories",
      label: "Category",
      type: "multiSelect",
      options: categoriesOptions,
    },
  ] as const;

  const handleSearch = async (
    query: JobBookmarkQueryFormInput,
    pagyInput: PagyInput
  ) => {
    handleGetBookmarkedList(query, pagyInput);
  };

  if (loading) return <LoadingOverlay />;
  return (
    <div>
      <PageHeading title="Boorkmarked Jobs" />

      <FilterBase
        fields={fields}
        values={query}
        onChange={(val) => setQuery(val)}
        onSubmit={handleSearch}
        page={page}
      />

      {/* job list */}
      <div className="py-4 px-6 rounded-2xl shadow-lg bg-white mt-6">
        {jobs && <JobList jobs={jobs} />}
      </div>

      <Pagination pagy={pagy ?? {}} onPageChange={setPage} />
    </div>
  );
}

export default Page;
