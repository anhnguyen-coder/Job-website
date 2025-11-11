import { Input } from "@/components/base/input";
import { RatingModal } from "@/components/rating/ratingModal";
import { JOB_STATUS } from "@/pkg/types/enums/job";
import type { JobInterface } from "@/pkg/types/interfaces/job.type";
import React, { useState } from "react";

interface HeaderProps {
  job: JobInterface;
  disable: boolean;
  setDisable: React.Dispatch<React.SetStateAction<boolean>>;
  onDelete: () => void;
  handleEdit: () => void;
  onSubmit: () => void;
  setShowMarkCompleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  handlePublishJob: (jobId: string) => void;
  makeRateWorker: (workerId: string, rating: number, comment?: string) => void;
  setTitle: (val: string) => void;
  title: string;
}

function Header({
  job,
  disable,
  setDisable,
  onDelete,
  handleEdit,
  onSubmit,
  setShowMarkCompleteModal,
  handlePublishJob,
  makeRateWorker,
  title,
  setTitle,
}: HeaderProps) {
  const [openModalRating, setOpenModalRating] = useState(false);

  return (
    <>
      {openModalRating && (
        <RatingModal
          isOpen={openModalRating}
          onClose={() => setOpenModalRating(false)}
          onSubmit={makeRateWorker}
          workerId={job.assignedWorkerId?._id ?? ""}
        />
      )}

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        {!disable ? (
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        ) : (
          <h2 className="text-3xl font-extrabold text-gray-900">{job.title}</h2>
        )}
        <div className="flex items-center">
          {/* Delete button — only when AVAILABLE */}
          {job.status === JOB_STATUS.AVAILABLE && (
            <button
              onClick={() => onDelete()}
              className="px-4 py-2 mx-4 bg-red-500 text-white font-semibold rounded-3xl shadow hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
          )}

          {(job.status === JOB_STATUS.AVAILABLE ||
            job.status === JOB_STATUS.TAKEN) && (
            <div>
              {disable ? (
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-3xl shadow hover:bg-blue-700 transition-colors"
                >
                  Update
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setDisable(true)}
                    className="px-4 py-2 mx-4 bg-gray-600 text-white rounded-3xl shadow hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onSubmit}
                    className="px-4 py-2 bg-green-600 text-white rounded-3xl shadow hover:bg-green-700 transition-colors"
                  >
                    Save
                  </button>
                </>
              )}
            </div>
          )}

          {/* Mark completed — only when CHECK_COMPLETE */}
          {job.status === JOB_STATUS.CHECK_COMPLETE && (
            <button
              onClick={() => setShowMarkCompleteModal(true)}
              className="px-4 py-2 mx-4 bg-green-500 text-white font-semibold rounded-3xl shadow hover:bg-green-600 transition-colors"
            >
              Mark completed
            </button>
          )}

          {job.status === JOB_STATUS.CANCELLED && (
            <button
              onClick={() => handlePublishJob(job._id)}
              className="px-4 py-2 mx-4 bg-green-500 text-white font-semibold rounded-3xl shadow hover:bg-green-600 transition-colors"
            >
              Publish job
            </button>
          )}

          {job.status === JOB_STATUS.COMPLETED && (
            <button
              onClick={() => setOpenModalRating(true)}
              className="px-4 py-2 mx-4 bg-green-500 text-white font-semibold rounded-3xl shadow hover:bg-green-600 transition-colors"
            >
              Give feedback for worker
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default Header;
