import JobItem from "@/components/base/jobItem";
import type { JobInterface } from "@/pkg/types/interfaces/job.type";
import { useNavigate } from "react-router-dom";

interface JobListProps {
  jobs: JobInterface[];
}

export function JobList({ jobs }: JobListProps) {
  const navigate = useNavigate();
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Job List</h3>
        <button
          onClick={() => navigate("/jobs")}
          className="text-green-500 hover:text-green-700 hover:cursor-pointer font-medium transition-colors"
        >
          Show more
        </button>
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
