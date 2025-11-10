import type {
  JobInterface,
  JobRequestInterface,
  JobTaskInterface,
} from "@/pkg/interfaces/job.type";
import { BaseBadge } from "../base/badgeBase";
import { getStatusBadgeVariant, getStatusLabel } from "@/pkg/helper/formatter";
import { ProgressBar } from "../base/progressBar";
import { useNavigate } from "react-router-dom";

interface props {
  jobs: JobRequestInterface[];
}

function CurrentJobList({ jobs }: props) {
  const navigate = useNavigate();

  const calculateProgress = (job: JobInterface) => {
    if (job && job.jobTasks && job.jobTasks.length > 0) {
      const tasks = job.jobTasks as JobTaskInterface[];
      const completed = tasks.filter((t) => t.isCompleted).length;
      return Math.round((completed / tasks.length) * 100);
    } else {
      return 0;
    }
  };

  return (
    <div className="w-full p-6">
      <p className="text-xl font-semibold mb-6">
        Current list: <span>{jobs.length}</span>
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {jobs.map((job, index) => (
          <div
            key={job._id}
            className="bg-white rounded-lg shadow-lg px-6 py-4 border border-gray-200 cursor-pointer transition-transform duration-300 hover:-translate-y-2"
            onClick={() => navigate(`/jobs/${job.jobId._id}`)}
          >
            {/* title */}
            <div className="text-xl font-semibold flex items-center justify-between">
              <p className="max-w-[80%] line-clamp-1">{job.jobId.title}</p>
              <span>#{index + 1}</span>
            </div>

            {/* status */}
            <div className="mt-5 flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-1">
                <i className="mdi mdi-alert-circle-outline text-lg"></i>
                <p className="font-semibold">Request status</p>
              </div>

              <BaseBadge variant={getStatusBadgeVariant(job.status)}>
                {getStatusLabel(job.status)}
              </BaseBadge>
            </div>

            {/* customer */}
            <div className="mt-5 flex flex-wrap gap-4 items-center">
              <div className="flex items-center gap-1">
                <i className="mdi mdi-account-outline text-lg"></i>
                <p>Customer:</p>
              </div>

              <p>{job.customerId.name}</p>
            </div>

            {/* Progress */}
            <div className="mt-4 sm:mt-5">
              <ProgressBar progress={calculateProgress(job.jobId)} />
              <p className="text-[11px] sm:text-xs text-gray-500 text-right mt-1">
                {calculateProgress(job.jobId)}% completed
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CurrentJobList;
