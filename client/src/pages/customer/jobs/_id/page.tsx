import { useEffect } from "react";
import { useParams } from "react-router-dom";
import useHook from "./hook";
import { formatUSD } from "@/pkg/helpers/formatter";
import { JOB_STATUS } from "@/pkg/types/enums/job";
import type { JobTaskInterface } from "@/pkg/types/interfaces/job.type";
import { ProgressBar } from "@/components/base/progressBar";
import { PageHeading } from "@/components/customer/pageheading";
import { Button } from "@/components/base/button";

const JobIdPage = () => {
  const { jobId } = useParams();
  const { job, err, handleFetchJobId } = useHook();

  useEffect(() => {
    if (!jobId) return;
    handleFetchJobId(jobId.toString());
  }, [jobId]);

  if (err)
    return (
      <div className="p-6 text-center text-red-500 font-medium">
        Failed to load job details.
      </div>
    );
  if (!job)
    return (
      <div className="p-6 text-center text-gray-500 animate-pulse">
        Loading job details...
      </div>
    );

  // progress for tasks
  const progress =
    job.jobTasks && job.jobTasks.length > 0
      ? Math.round(
          (job.jobTasks.filter((t) => t.isCompleted).length /
            job.jobTasks.length) *
            100
        )
      : 0;

  return (
    <div>
      <PageHeading title="Job details" />
      <div className="container mx-auto px-6 lg:px-12 py-10">
        <div className="max-w-6xl mx-auto bg-white/95 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl p-8 transition-transform hover:-translate-y-1 hover:shadow-2xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900">
              {job.title}
            </h2>
            <div className="flex items-center">
              <span
                className={`px-5 py-2 mr-3 rounded-full font-semibold text-sm shadow ${
                  getStatusStyle(job.status).bg
                } ${getStatusStyle(job.status).text}`}
              >
                {job.status
                  .replace("_", " ")
                  .replace(/^./, (c) => c.toUpperCase())}
              </span>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-3xl shadow hover:bg-blue-700 transition-colors hover:cursor-pointer">
                Update
              </button>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <InfoItem label="Location" value={job.location} />
            <InfoItem label="Budget" value={formatUSD(job.budget)} />
            <InfoItem
              label="Assigned Worker"
              value={job.assignedWorkerId?.name || "Unassigned"}
            />
            <InfoItem
              label="Created At"
              value={new Date(job.createdAt).toLocaleString()}
            />
            <InfoItem
              label="Updated At"
              value={new Date(job.updatedAt).toLocaleString()}
            />
          </div>

          {/* Description */}
          <Section title="Description">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </Section>

          {/* Categories */}
          {job.categories && job.categories.length > 0 && (
            <Section title="Categories">
              <div className="flex flex-wrap gap-2">
                {job.categories.map((cat) => (
                  <span
                    key={cat}
                    className="px-4 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-200 to-blue-300 text-blue-900 shadow-sm hover:shadow-md transition-all"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {/* Tasks */}
          <Section title="Tasks">
            {job.jobTasks && job.jobTasks.length > 0 ? (
              <>
                <ProgressBar progress={progress} />
                <ul className="list-disc ml-6 mt-3 space-y-2 text-gray-700">
                  {job.jobTasks.map((task: JobTaskInterface) => (
                    <li
                      key={task._id}
                      className={`flex justify-between items-center px-3 py-2 rounded-md transition-colors hover:bg-gray-50 ${
                        task.isCompleted ? "bg-green-50" : "bg-yellow-50"
                      }`}
                    >
                      <span>{task.title}</span>
                      <span
                        className={`text-xs font-semibold ${
                          task.isCompleted
                            ? "text-green-700"
                            : "text-yellow-700"
                        }`}
                      >
                        {task.isCompleted ? "Done" : "Pending"}
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="text-gray-500 italic">No tasks added yet.</p>
            )}
          </Section>
        </div>
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

const getStatusStyle = (status: string) =>
  statusStyleMap[status] || statusStyleMap[JOB_STATUS.AVAILABLE];

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
    <p className="text-gray-500 text-sm">{label}</p>
    <p className="text-gray-900 font-medium mt-1">{value}</p>
  </div>
);

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="mb-8">
    <h3 className="text-lg font-semibold text-gray-800 mb-3">{title}</h3>
    {children}
  </div>
);

export default JobIdPage;
