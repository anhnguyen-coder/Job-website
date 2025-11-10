import type { TaskInputForm } from "@/pages/jobs/create/type";
import type { JobTaskInterface } from "@/pkg/types/interfaces/job.type";
import { Button } from "../base/button";
import { ProgressBar } from "../base/progressBar";

interface TaskSectionProps {
  disable: boolean;
  jobTasks: JobTaskInterface[];
  inputTasks: TaskInputForm[];
  progress: number;
  onAdd: () => void;
  onOpenTask: (task: TaskInputForm, index: number) => void;
  handleRemoveJobTasks: (removeIndex: number) => void;
}

export const TaskSection = ({
  disable,
  jobTasks,
  inputTasks,
  progress,
  onAdd,
  onOpenTask,
  handleRemoveJobTasks,
}: TaskSectionProps) => (
  <section>
    {/* Header */}
    <div className="flex items-center justify-between mb-10">
      <p className="font-semibold text-lg">Tasks</p>
      {!disable && (
        <Button onClick={onAdd} className="flex items-center gap-2">
          <i className="bx bx-plus text-base"></i> Add
        </Button>
      )}
    </div>

    {/* Editable Task List */}
    {!disable && inputTasks?.length > 0 && (
      <>
        <ProgressBar progress={progress} />
        <ul className="list-disc mt-3 space-y-2 text-gray-700">
          {inputTasks.map((task, index) => (
            <li
              key={index}
              onClick={() => onOpenTask(task, index)}
              className="grid grid-cols-[2fr_5fr_1fr] px-3 py-2 rounded-md transition-colors hover:bg-gray-50 bg-green-50 cursor-pointer"
            >
              <span className="w-full">{task.title}</span>
              <pre className="w-full text-xs font-semibold text-green-700">
                {task.description}
              </pre>
              <i
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveJobTasks(index);
                }}
                className="mdi mdi-delete text-red-500 text-2xl text-end"
              ></i>
            </li>
          ))}
        </ul>
      </>
    )}

    {/* View-only Task List */}
    {disable && jobTasks?.length > 0 && (
      <>
        <ProgressBar progress={progress} />
        <ul className="list-disc mt-3 space-y-2 text-gray-700">
          {jobTasks.map((task, index) => (
            <li
              key={task._id}
              className={`grid grid-cols-[2fr_5fr_1fr] px-3 py-2 rounded-md transition-colors hover:bg-gray-50 ${
                task.isCompleted ? "bg-green-50" : "bg-yellow-50"
              }`}
            >
              <p className="text-lg font-semibold">
                <span>#{index + 1} - </span>
                <span>{task.title}</span>
              </p>
              <div>
                <p>Description</p>
                <pre className="line-clamp-2">{task.description}</pre>
              </div>
              <span
                className={`text-xs font-semibold ${
                  task.isCompleted ? "text-green-700" : "text-yellow-700"
                }`}
              >
                {task.isCompleted ? "Done" : "Pending"}
              </span>
            </li>
          ))}
        </ul>
      </>
    )}
  </section>
);
