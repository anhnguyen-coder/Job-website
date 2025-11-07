import { PageHeading } from "@/components/base/pageheading";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import useHook from "./hook";
import JobDetailPage from "@/components/job/jobDetail";
import { LoadingOverlay } from "@/components/base/loading";

function Page() {
  const { jobId } = useParams();
  const { job, loading, handleFetchJobId } = useHook();

  useEffect(() => {
    handleFetchJobId(jobId || "");
  }, [jobId]);

  if (loading) return <LoadingOverlay />;

  return (
    <div>
      <PageHeading title="Job details" />

      <div className="mt -5">{job && <JobDetailPage jobData={job} />}</div>
    </div>
  );
}

export default Page;
