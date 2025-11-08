import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useHook from "./hook";
import { formatUSD } from "@/pkg/helpers/formatter";
import { JOB_STATUS } from "@/pkg/types/enums/job";
import { PageHeading } from "@/components/customer/pageheading";
import type { CategoryInterface } from "@/pkg/types/interfaces/category";
import { Input } from "@/components/base/input";
import { TextArea } from "@/components/base/textAreaInput";
import { BaseDropdownMulti } from "@/components/base/baseDropdownMultiple";
import { LoadingOverlay } from "@/components/base/loading";
import { JobTaskModal } from "@/components/customer/job/ jobTaskModal";
import { TaskSection } from "@/components/job/taskSection";
import MarkCompleteModalDetail from "@/components/job/markCompleteModal";

const JobIdPage = () => {
  const { jobId } = useParams();
  const {
    job,
    loading,
    handleFetchJobId,
    handleGetCategories,
    categoriesOptions,
    handleUpdateJob,
    task,
    setTask,
    index,
    setIndex,
    openTaskModal,
    setOpenTaskModal,
    disable,
    setDisable,
    inputFormUpdate,
    setInputUpdate,
    handleAddTask,
    handleChangeCategory,
    handleOpenTask,
    makeJobComplete,
    handleDeleteJob,
    handlePublishJob,
    handleRemoveJobTasks,
  } = useHook();

  useEffect(() => {
    if (jobId) handleFetchJobId(jobId.toString());
  }, [jobId]);

  const [showMarkCompleteModal, setShowMarkCompleteModal] = useState(false);

  // Progress for tasks
  const progress =
    job?.jobTasks && job.jobTasks.length > 0
      ? Math.round(
          (job.jobTasks.filter((t) => t.isCompleted).length /
            job.jobTasks.length) *
            100
        )
      : 0;

  // Load categories before editing
  const handleEdit = () => {
    if (!categoriesOptions) handleGetCategories();

    if (!job) return;

    const categories = job.categories.map((e) => e._id);
    const tasks = job.jobTasks?.map((e) => ({
      title: e.title,
      description: e.description,
    }));

    setInputUpdate({
      title: job.title,
      description: job.description,
      location: job.location,
      budget: job.budget,
      categoryIds: categories,
      tasks: tasks || [],
    });

    setDisable(false);
  };

  const onSubmit = () => {
    if (!job) return;
    handleUpdateJob(job._id, inputFormUpdate);
    setDisable(true);
  };

  const onDelete = () => {
    if (
      window.confirm(
        "Are you sure you want to delete this job? This action cannot be undone."
      )
    ) {
      handleDeleteJob();
    }
  };

  if (loading) return <LoadingOverlay />;

  if (!job)
    return (
      <div className="p-6 text-center text-gray-500 animate-pulse">
        Loading job details...
      </div>
    );

  return (
    <div className="w-full">
      <PageHeading title="Job details" />
      <div className="w-full mt-8">
        <div className="mx-auto bg-white/95 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl p-8 transition-transform hover:shadow-2xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900">
              {job.title}
            </h2>
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

              {/* Update / Save / Cancel — when AVAILABLE or TAKEN */}
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
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Input
              label="Location"
              value={disable ? job.location : inputFormUpdate.location}
              readOnly={disable}
              onChange={(e) =>
                setInputUpdate({ ...inputFormUpdate, location: e.target.value })
              }
              required
            />
            <Input
              label="Budget"
              type={disable ? "text" : "number"}
              value={
                disable
                  ? formatUSD(job.budget)
                  : inputFormUpdate.budget.toString()
              }
              readOnly={disable}
              onChange={(e) =>
                setInputUpdate({
                  ...inputFormUpdate,
                  budget: Number(e.target.value),
                })
              }
              required
            />
            <Input
              label="Assigned Worker"
              value={job.assignedWorkerId?.name || "Unassigned"}
              readOnly
            />
            <Input
              label="Created At"
              value={new Date(job.createdAt).toLocaleString()}
              readOnly
            />
            <Input
              label="Updated At"
              value={new Date(job.updatedAt).toLocaleString()}
              readOnly
            />
          </div>

          {/* Description */}
          <Section title="Description">
            <TextArea
              value={disable ? job.description : inputFormUpdate.description}
              readOnly={disable}
              onChange={(e) =>
                setInputUpdate({
                  ...inputFormUpdate,
                  description: e.target.value,
                })
              }
            />
          </Section>

          {/* Categories */}
          <Section title="Categories">
            {disable ? (
              <div className="flex flex-wrap gap-2">
                {job.categories.map((cat: CategoryInterface) => (
                  <span
                    key={cat._id}
                    className="px-4 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-200 to-blue-300 text-blue-900 shadow-sm"
                  >
                    {cat.name}
                  </span>
                ))}
              </div>
            ) : (
              <BaseDropdownMulti
                options={categoriesOptions || []}
                selected={inputFormUpdate.categoryIds}
                onChange={handleChangeCategory}
              />
            )}
          </Section>

          {/* Status */}
          <Section title="Status">
            <span
              className={`px-5 py-2 mr-3 rounded-full font-semibold text-sm shadow ${
                getStatusStyle(job.status).bg
              } ${getStatusStyle(job.status).text}`}
            >
              {job.status
                .replace("_", " ")
                .replace(/^./, (c) => c.toUpperCase())}
            </span>
          </Section>
          {/* Tasks */}
          <TaskSection
            disable={disable}
            jobTasks={job.jobTasks || []}
            inputTasks={inputFormUpdate.tasks || []}
            progress={progress}
            onAdd={() => setOpenTaskModal(true)}
            onOpenTask={handleOpenTask}
            handleRemoveJobTasks={handleRemoveJobTasks}
          />
        </div>
      </div>
      {openTaskModal && (
        <JobTaskModal
          isOpen={openTaskModal}
          setOpen={setOpenTaskModal}
          setInputValue={handleAddTask}
          task={task}
          index={index}
          setIndex={setIndex}
          setTask={setTask}
        />
      )}

      {showMarkCompleteModal && (
        <MarkCompleteModalDetail
          isOpen={showMarkCompleteModal}
          onOpenChange={() => setShowMarkCompleteModal(false)}
          job={job}
          makeJobComplete={makeJobComplete}
        />
      )}
    </div>
  );
};

// Status color styles
const statusStyleMap: Record<string, { bg: string; text: string }> = {
  [JOB_STATUS.AVAILABLE]: { bg: "bg-gray-400", text: "text-white" },
  [JOB_STATUS.TAKEN]: { bg: "bg-blue-500", text: "text-white" },
  [JOB_STATUS.IN_PROGRESS]: { bg: "bg-yellow-400", text: "text-gray-800" },
  [JOB_STATUS.CHECK_COMPLETE]: { bg: "bg-purple-500", text: "text-white" },
  [JOB_STATUS.COMPLETED]: { bg: "bg-green-500", text: "text-white" },
  [JOB_STATUS.CANCELLED]: { bg: "bg-red-500", text: "text-white" },
};

const getStatusStyle = (status: string) =>
  statusStyleMap[status] || statusStyleMap[JOB_STATUS.AVAILABLE];

// Section component
const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="mb-8">
    {title && (
      <h3 className="text-lg font-semibold text-gray-800 mb-3">{title}</h3>
    )}
    {children}
  </div>
);

export default JobIdPage;
