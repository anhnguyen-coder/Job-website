import type { JobInterface, JobTaskInterface } from "@/pkg/interfaces/job.type";
import { DollarSign, MapPin, User, FolderTree } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProgressBar } from "../base/progressBar";
import { JOB_STATUS } from "@/pkg/enums/job";
import { formatUSD } from "@/pkg/helper/formatter";
import { ConfirmModal } from "../base/confirmModal";

interface JobItemProps {
  job: JobInterface;
  onDelete?: (id: string) => Promise<void>;
  isShowDelete?: boolean;
}

const JobItem = ({ job, isShowDelete, onDelete }: JobItemProps) => {
  const [progress, setProgress] = useState<number>(0);
  const navigate = useNavigate();
  const [openConfirmModal, setOpenModal] = useState(false);

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
    <>
      {openConfirmModal && (
        <ConfirmModal
          isOpen={openConfirmModal}
          onConfirm={() => onDelete?.(job._id)}
          onClose={() => setOpenModal(false)}
        />
      )}

      <div className="relative group flex flex-col justify-between p-4 sm:p-5 border border-gray-200 rounded-2xl cursor-pointer bg-white shadow-sm hover:shadow-md transition-all duration-500 overflow-hidden">
        {/* Overlay buttons */}

        <div className="absolute inset-0 flex items-center justify-center bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <div className="flex gap-3">
            <button
              onClick={() => handleViewJobDetails(job._id)}
              className="px-4 py-2 rounded-lg bg-blue-200 text-blue-500 font-medium hover:bg-blue-500 hover:text-white transition cursor-pointer"
            >
              <i className="mdi mdi-eye-outline"></i>
            </button>
            {isShowDelete && (
              <button
                onClick={() => setOpenModal(true)}
                className="px-4 py-2 rounded-lg bg-red-200 text-red-500 font-medium hover:bg-red-600 hover:text-white transition cursor-pointer"
              >
                <i className="mdi mdi-delete"></i>
              </button>
            )}
          </div>
        </div>

        {/* Normal content (faded when hover) */}
        <div className="mb-3 group-hover:opacity-30 transition-opacity duration-300">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 sm:mb-4 gap-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <h4 className="text-base sm:text-lg font-semibold text-gray-800 truncate">
                {job.title}
              </h4>
            </div>

            <span
              className={`text-xs sm:text-sm px-3 py-1 rounded-full font-semibold self-start sm:self-auto ${bg} ${text}`}
            >
              {job.status.replace("_", " ").toUpperCase()}
            </span>
          </div>

          {/* Info section */}
          <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
            <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-gray-700">
              <User size={16} className="text-gray-500 shrink-0" />
              <span className="font-medium">Assigned:</span>
              <span className="truncate">
                {job.assignedWorkerId?.name || "Unassigned"}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-gray-700">
              <MapPin size={16} className="text-gray-500 shrink-0" />
              <span className="font-medium">Location:</span>
              <span className="truncate">{job.location}</span>
            </div>

            <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-gray-700">
              <DollarSign size={16} className="text-gray-500 shrink-0" />
              <span className="font-medium">Budget:</span>
              <span>{formatUSD(job.budget)}</span>
            </div>

            <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-gray-700">
              <FolderTree size={16} className="text-gray-500 shrink-0" />
              <span className="font-medium">Categories:</span>
              <div className="flex flex-wrap items-center text-wrap gap-2">
                {job.categories.map((cate) => (
                  <div
                    key={cate._id}
                    className="bg-blue-200 rounded-xl px-2 border border-blue-500"
                  >
                    <p className="text-blue-700">{cate.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-4 sm:mt-5 group-hover:opacity-30 transition-opacity duration-300">
          <ProgressBar progress={progress} />
          <p className="text-[11px] sm:text-xs text-gray-500 text-right mt-1">
            {progress}% completed
          </p>
        </div>
      </div>
    </>
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
