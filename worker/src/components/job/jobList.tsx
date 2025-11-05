import type { JobInterface } from "@/pkg/types/interfaces/job.type";
import JobItem from "./jobItem";

interface JobListProps {
  jobs: JobInterface[];
}

export function JobList({ jobs }: JobListProps) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Job List: <span>{jobs.length} jobs</span></h3>

      </div>

      {/* Job items */}
      {jobs.length > 0 ? (
        jobs.map((job) => <JobItem key={job._id} job={job} />)
      ) : (
        <p className="text-gray-500 italic">No jobs available.</p>
      )}
    </div>
  );
}
