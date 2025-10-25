import { useEffect, useMemo, useState } from "react";
import { ProgressBar } from "./progressBar";
import { JOB_STATUS } from "@/pkg/types/enums/job";
import type {
  JobInterface,
  JobTaskInterface,
} from "@/pkg/types/interfaces/job.type";

interface JobItemProps {
  job: JobInterface;
}

const JobItem = ({ job }: JobItemProps) => {
  const [progress, setProgress] = useState<number>(0);

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

  return (
    <div className="p-4 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-base font-semibold text-gray-800">{job.title}</h4>
        <span
          className={`text-xs px-3 py-1 rounded-full font-medium transition-all duration-200 ${bg} ${text}`}
        >
          {job.status.replace("_", " ").toUpperCase()}
        </span>
      </div>

      {/* Assigned worker + progress */}
      <div className="space-y-3">
        <p className="text-sm text-gray-600">
          Assigned to:{" "}
          <span className="font-medium text-gray-800">
            {job.assignedWorkerId?.name || "Unassigned"}
          </span>
        </p>

        {/* Progress bar */}
        <div className="w-full transition-all duration-500">
          <ProgressBar progress={progress} />
        </div>

        {/* Animated percentage display */}
        <p className="text-xs text-gray-500 text-right transition-opacity duration-300">
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
