import { BaseModal } from "@/components/base/baseModal";
import type { TaskInputForm } from "@/pages/jobs/create/type";
import { useEffect, useState } from "react";

interface Props {
  setOpen: (val: boolean) => void;
  isOpen: boolean;
  setInputValue: (value: TaskInputForm, index?: number) => void;
  task?: TaskInputForm;
  index?: number;
  setIndex?: (num: number) => void;
  setTask?: (task: TaskInputForm) => void;
}

export function JobTaskModal({
  setOpen,
  isOpen,
  setInputValue,
  task,
  index,
  setIndex,
  setTask,
}: Props) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const handleSave = () => {
    if (!title.trim()) return alert("Please enter a title");
    const form = {
      title: title,
      description: desc,
    };

    setInputValue(form, index);
    setIndex?.(-1);
    setTask?.({ title: "", description: "" });
    setOpen(false);
  };

  const removeSpecialChars = (value: string) => {
    return value.replace(/[^a-zA-Z0-9\sÀ-Ỹà-ỹ]/g, "");
  };


  useEffect(() => {
    if (task && index !== undefined && index !== null) {
      setTitle(task.title);
      setDesc(task.description);
    }
  }, []);

  return (
    <BaseModal isOpen={isOpen} onClose={() => setOpen(false)}>
      <div className="bg-white rounded-2xl w-[400px] max-w-md p-10 relative animate-fade-in">
        {/* Heading */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-5">
          Create Sub Task
        </h2>

        {/* Form */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(removeSpecialChars(e.target.value))}
              type="text"
              placeholder="Enter task title"
              className="w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg p-2.5 transition"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              Description
            </label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(removeSpecialChars(e.target.value))}
              placeholder="Enter task description"
              rows={4}
              className="w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg p-2.5 resize-none transition"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => setOpen(false)}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm transition"
          >
            Save
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
