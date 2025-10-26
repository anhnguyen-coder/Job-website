import type { JobTaskInterface } from "@/pkg/types/interfaces/job.type";
import { InfoItem } from "./item";

interface Props {
  task: JobTaskInterface | { title: string; description: string };
  isShowCompleted: boolean;
}

export function TaskItem({ task, isShowCompleted }: Props) {
  return (
    <div
      className={`grid  ${
        isShowCompleted ? "grid-cols-[3fr_6fr_1fr]" : "grid-cols-[3fr_6fr]"
      } items-center gap-4 border-b border-gray-200 py-2`}
    >
      <InfoItem value={task.title} label="Title" />
      <InfoItem value={task.description} label="Description" />
      {isShowCompleted && (
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Completed</label>
          <input
            type="checkbox"
            checked={!!(task as JobTaskInterface).isCompleted}
            readOnly
            className="w-4 h-4 accent-blue-600 cursor-not-allowed"
          />
        </div>
      )}
    </div>
  );
}
