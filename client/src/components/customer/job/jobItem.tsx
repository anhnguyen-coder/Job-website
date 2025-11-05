import { useEffect, useMemo, useState } from "react";
import { JOB_STATUS } from "@/pkg/types/enums/job";
import type {
  JobInterface,
  JobTaskInterface,
} from "@/pkg/types/interfaces/job.type";
import { ProgressBar } from "@/components/base/progressBar";
import { formatUSD } from "@/pkg/helpers/formatter";
import { MapPin, DollarSign, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CUSTOMER_APP_THEME } from "@/constant/constant";
import { applyOpacity } from "@/pkg/helpers/style";

interface JobItemProps {
  job: JobInterface;
}

const JobItem = ({ job }: JobItemProps) => {
  const [progress, setProgress] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (job.jobTasks && job.jobTasks.length > 0) {
      const tasks = job.jobTasks as JobTaskInterface[];
      const completed = tasks.filter((t) => t.isCompleted).length;
      setProgress(Math.round((completed / tasks.length) * 100));
    } else {
      setProgress(0);
    }
  }, [job.jobTasks]);

  const { bg, text } = useMemo(
    () => getJobStatusStyle(job.status),
    [job.status]
  );

  const handleViewJobDetails = (jobId: string) => {
    navigate(`/jobs/${jobId}`);
  };

  return (
    <div className="p-5 border border-gray-200 rounded-2xl bg-white shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <h4 className="text-lg font-semibold mr-3 text-gray-800 truncate">
            {job.title}
          </h4>
          <div
            onClick={() => handleViewJobDetails(job._id)}
            className={`border px-2 rounded-lg text-sm text-green-500 hover:cursor-pointer hover:text-green-700`}
            style={{
              borderColor: CUSTOMER_APP_THEME.COLOR.SECONDARY,
              backgroundColor: applyOpacity(
                CUSTOMER_APP_THEME.COLOR.SECONDARY,
                0.2
              ),
            }}
          >
            <p>View</p>
          </div>
        </div>

        <span
          className={`text-xs px-3 py-1 rounded-full font-semibold ${bg} ${text}`}
        >
          {job.status.replace("_", " ").toUpperCase()}
        </span>
      </div>

      {/* Info section */}
      <div className="space-y-3 text-sm">
        <div className="flex items-center gap-2 text-gray-700">
          <User size={16} className="text-gray-500" />
          <span className="font-medium">Assigned:</span>
          <span>{job.assignedWorkerId?.name || "Unassigned"}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-700">
          <MapPin size={16} className="text-gray-500" />
          <span className="font-medium">Location:</span>
          <span>{job.location}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-700">
          <DollarSign size={16} className="text-gray-500" />
          <span className="font-medium">Budget:</span>
          <span>{formatUSD(job.budget)}</span>
        </div>
      </div>

      {/* Progress */}
      <div className="mt-5">
        <ProgressBar progress={progress} />
        <p className="text-xs text-gray-500 text-right mt-1">
          {progress}% completed
        </p>
      </div>
    </div>
  );
};

const statusStyleMap: Record<string, { bg: string; text: string }> = {
  [JOB_STATUS.AVAILABLE]: { bg: "bg-gray-400", text: "text-white" },
  [JOB_STATUS.TAKEN]: { bg: "bg-blue-500", text: "text-white" },
  [JOB_STATUS.IN_PROGRESS]: { bg: "bg-yellow-400", text: "text-gray-800" },
  [JOB_STATUS.CHECK_COMPLETE]: { bg: "bg-purple-500", text: "text-white" },
  [JOB_STATUS.COMPLETED]: { bg: "bg-green-500", text: "text-white" },
  [JOB_STATUS.CANCELLED]: { bg: "bg-red-500", text: "text-white" },
};

const getJobStatusStyle = (status: string) =>
  statusStyleMap[status] || statusStyleMap[JOB_STATUS.AVAILABLE];

export default JobItem;
