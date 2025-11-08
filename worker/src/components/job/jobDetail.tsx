import type { JobInterface, JobTaskInterface } from "@/pkg/interfaces/job.type";
import { Link } from "react-router-dom";
import { BaseBadge } from "../base/badgeBase";
import {
  getStatusLabel,
  getStatusBadgeVariant,
  formatUSD,
} from "@/pkg/helper/formatter";
import { useEffect, useState } from "react";
import { ConfirmModal } from "../base/confirmModal";
import { useWorkerAuth } from "@/context/context";
import { ProgressBar } from "../base/progressBar";
import { JOB_STATUS } from "@/pkg/enums/job";

type Props = {
  jobData: JobInterface;
  handleApplyJob: (jobId: string) => Promise<void>;
  handleSaveJob: (jobId: string) => Promise<void>;
  makeTaskComplete: (taskId: string, jobId: string) => Promise<void>;
  handleStartJob: (jobId: string) => Promise<void>;
  handleCancelJob: (jobId: string) => Promise<void>;
  handleRequestCheckComplete: (jobId: string) => Promise<void>;
};

export default function JobDetailPage({
  jobData,
  handleApplyJob,
  handleSaveJob,
  makeTaskComplete,
  handleCancelJob,
  handleStartJob,
  handleRequestCheckComplete,
}: Props) {
  const auth = useWorkerAuth();
  const [isAssigned, setIsAssigned] = useState(false);
  const { worker, profile } = auth;
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [openModalCancel, setOpenModalCancel] = useState(false);

  useEffect(() => {
    profile();
  }, []);

  useEffect(() => {
    if (
      worker?._id &&
      jobData.assignedWorkerId?._id &&
      worker._id === jobData.assignedWorkerId._id
    ) {
      setIsAssigned(true);
    }
  }, [worker?._id, jobData.assignedWorkerId?._id]);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("vi-VN");

  const handleConfirm = async () => {
    await handleApplyJob(jobData._id);
  };

  const makeSave = async () => {
    await handleSaveJob(jobData._id);
  };

  const calculateProgress = () => {
    if (jobData.jobTasks && jobData.jobTasks.length > 0) {
      const tasks = jobData.jobTasks as JobTaskInterface[];
      const completed = tasks.filter((t) => t.isCompleted).length;
      return Math.round((completed / tasks.length) * 100);
    } else {
      return 0;
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {openConfirmModal && (
        <ConfirmModal
          isOpen={openConfirmModal}
          onConfirm={handleConfirm}
          onClose={() => setOpenConfirmModal(false)}
        />
      )}

      {openModalCancel && (
        <ConfirmModal
          isOpen={openModalCancel}
          onConfirm={() => handleCancelJob(jobData._id)}
          onClose={() => setOpenModalCancel(false)}
        />
      )}

      {/* Header */}
      <div className="border-b border-blue-200 bg-white shadow-sm mt-5 rounded-lg">
        <div className="mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
                <Link to="/jobs" className="hover:text-gray-700">
                  Jobs
                </Link>
                <span>/</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-800">
                {jobData.title}
              </h1>
            </div>
            <BaseBadge variant={getStatusBadgeVariant(jobData.status)}>
              {getStatusLabel(jobData.status)}
            </BaseBadge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto mt-5">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="mb-4 text-xl font-semibold text-gray-800">
                Description details
              </h2>
              <p className="text-base leading-relaxed text-gray-700">
                {jobData.description}
              </p>
            </div>

            {/* Job Information */}
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Location */}
              <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex items-start gap-3">
                  <div className="mt-1 rounded-lg bg-blue-50 p-2">
                    <i className="mdi mdi-map-marker text-blue-600 text-xl"></i>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Location
                    </p>
                    <p className="mt-1 text-base font-semibold text-gray-800">
                      {jobData.location}
                    </p>
                  </div>
                </div>
              </div>

              {/* Budget */}
              <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex items-start gap-3">
                  <div className="mt-1 rounded-lg bg-blue-50 p-2">
                    <i className="mdi mdi-cash text-blue-600 text-xl"></i>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Budget</p>
                    <p className="mt-1 text-base font-semibold text-gray-800">
                      {formatUSD(jobData.budget)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Date */}
              <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex items-start gap-3">
                  <div className="mt-1 rounded-lg bg-blue-50 p-2">
                    <i className="bx bx-time text-blue-600 text-xl"></i>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Posted Date
                    </p>
                    <p className="mt-1 text-base font-semibold text-gray-800">
                      {formatDate(jobData.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="flex items-start gap-3">
                  <div className="mt-1 rounded-lg bg-blue-50 p-2">
                    <i className="bx bx-briefcase text-blue-600 text-xl"></i>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <p className="mt-1 text-base font-semibold text-gray-800">
                      {getStatusLabel(jobData.status)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Tasks */}
            {jobData.jobTasks && jobData.jobTasks.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="mb-4 text-lg font-semibold text-gray-800">
                  Tasks
                </h2>
                {isAssigned &&
                  (jobData.status === JOB_STATUS.IN_PROGRESS ||
                    jobData.status === JOB_STATUS.CHECK_COMPLETE) && (
                    <ProgressBar progress={calculateProgress()} />
                  )}

                <div className="space-y-3 mt-5">
                  {jobData.jobTasks.map((task, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between bg-gray-100 p-3">
                        <div className="flex items-center gap-3 rounded-lg ">
                          <span className="flex items-center gap-2">
                            <i className="bx bx-task text-green-600 text-lg"></i>
                            <span className="font-semibold">#{index + 1}</span>
                          </span>
                          {"-"}
                          <span className="text-gray-800">{task.title}</span>
                        </div>
                        {isAssigned &&
                          (jobData.status === JOB_STATUS.IN_PROGRESS ||
                            jobData.status === JOB_STATUS.CHECK_COMPLETE) && (
                            <input
                              type="checkbox"
                              checked={task.isCompleted}
                              disabled={
                                jobData.status === JOB_STATUS.CHECK_COMPLETE
                              }
                              onChange={() =>
                                makeTaskComplete(task._id, jobData._id)
                              }
                              className="w-5 h-5"
                            />
                          )}
                      </div>

                      <div className="flex flex-col items-start gap-3 rounded-lg bg-gray-100 p-3 mt-2">
                        <p className="font-semibold">Description:</p>
                        <pre>{task.description}</pre>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="mb-4 text-lg font-semibold text-gray-800">
                Customer info
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Name</p>
                  <p className="mt-1 text-base font-semibold text-gray-800">
                    {jobData.customerId.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="mt-1 break-all text-base text-gray-800">
                    {jobData.customerId.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {!isAssigned && (
              <div className="space-y-3">
                <button
                  onClick={() => setOpenConfirmModal(true)}
                  className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white py-2 font-medium cursor-pointer"
                >
                  Apply
                </button>
                <button
                  onClick={() => makeSave()}
                  className="w-full rounded-lg border border-gray-300 py-2 font-medium hover:bg-gray-50 cursor-pointer"
                >
                  Save to bookmark
                </button>
              </div>
            )}

            {jobData.status === JOB_STATUS.TAKEN && (
              <div className="space-y-3">
                <button
                  onClick={() => handleStartJob(jobData._id)}
                  className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white py-2 font-medium cursor-pointer"
                >
                  Start Job
                </button>
                <button
                  onClick={() => {
                    setOpenModalCancel(true);
                  }}
                  className="w-full rounded-lg bg-red-400 text-white py-2 font-medium hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                >
                  Cancel Job
                </button>
              </div>
            )}

            {jobData.status === JOB_STATUS.IN_PROGRESS &&
              calculateProgress() === 100 && (
                <div className="space-y-3">
                  <button
                    onClick={() => handleRequestCheckComplete(jobData._id)}
                    className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white py-2 font-medium cursor-pointer"
                  >
                    Request to check complete
                  </button>
                </div>
              )}

            {/* Job ID */}
            <div className="rounded-lg bg-gray-100 p-4">
              <p className="text-xs font-medium text-gray-500">Job's ID</p>
              <p className="mt-2 break-all font-mono text-sm text-gray-800">
                {jobData._id}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
