import type { JobInterface } from "@/pkg/interfaces/job.type";
import JobItem from "./jobItem";

interface JobListProps {
  jobs: JobInterface[];
}

export function JobList({ jobs }: JobListProps) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">
          Job List: <span>{jobs.length} jobs</span>
        </h3>
      </div>

      {/* Job items */}
      {jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobItem key={job._id} job={job} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic">No jobs available.</p>
      )}
    </div>
  );
}
