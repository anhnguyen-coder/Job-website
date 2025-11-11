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
import Header from "@/components/job/id/header";
import MessageSideBar from "@/components/job/id/messageSideBar";
import { useCustomerAuth } from "@/contexts/customer";
import type { UserInterface } from "@/pkg/types/interfaces/user.type";

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
    handleMakeRateWorker,
    handleGetConversation,
    handleGetConversationMessage,
    handleSendMessage,
  } = useHook();

  useEffect(() => {
    if (jobId) handleFetchJobId(jobId.toString());
  }, [jobId]);

  const { user: currentUser, profile } = useCustomerAuth();

  useEffect(() => {
    if (!currentUser) {
      profile();
    }
  }, [currentUser]);

  const [showMarkCompleteModal, setShowMarkCompleteModal] = useState(false);
  const [openMessageSideBar, setOpenMessageSideBar] = useState(false);

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
          <Header
            title={inputFormUpdate.title}
            setTitle={(val) =>
              setInputUpdate((pre) => ({
                ...pre,
                title: val,
              }))
            }
            job={job}
            disable={disable}
            setDisable={setDisable}
            onDelete={onDelete}
            handleEdit={handleEdit}
            onSubmit={onSubmit}
            setShowMarkCompleteModal={setShowMarkCompleteModal}
            handlePublishJob={handlePublishJob}
            makeRateWorker={handleMakeRateWorker}
          />

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
              className="whitespace-pre-line"
            />
          </Section>

          {/* worker */}
          {job.assignedWorkerId && (
            <Section title="Worker">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <p className="w-14 h-14 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold">
                    {job.assignedWorkerId.name.charAt(0).toUpperCase()}
                  </p>
                  <div className="flex items-center gap-8">
                    <div>
                      <label className="text-gray-500 font-semibold">
                        User Name:
                      </label>
                      <p className="m-0 text-lg">{job.assignedWorkerId.name}</p>
                    </div>
                    <div>
                      <label className="text-gray-500 font-semibold">
                        Email:
                      </label>
                      <p className="m-0 text-lg">
                        {job.assignedWorkerId.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => setOpenMessageSideBar(true)}
                  className="p-4 rounded-full flex items-center justify-center text-xl bg-blue-500 cursor-pointer hover:bg-blue-800"
                >
                  <i className="mdi mdi-message-text-outline text-2xl w-6 h-6 flex items-center justify-center text-white"></i>
                </div>
              </div>
            </Section>
          )}

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

      {openMessageSideBar && (
        <MessageSideBar
          isOpen={openMessageSideBar}
          setIsOpen={setOpenMessageSideBar}
          currentUser={currentUser || ({} as UserInterface)}
          userId={job.assignedWorkerId?._id || ""}
          handleGetConversation={handleGetConversation}
          handleGetMessages={handleGetConversationMessage}
          handleSendMessage={handleSendMessage}
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
  <div className="mb-8 shadow-md border border-gray-200 px-6 py-6 rounded-lg">
    {title && (
      <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 w-fit">
        {title}:
      </h3>
    )}
    {children}
  </div>
);

export default JobIdPage;
