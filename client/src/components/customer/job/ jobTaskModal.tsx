import { BaseModal } from "@/components/base/baseModal";
import type { TaskInputForm } from "@/pages/customer/jobs/create/type";
import { useState } from "react";

interface Props {
  setOpen: (val: boolean) => void;
  isOpen: boolean;
  setInputValue: (value: TaskInputForm) => void;
}

export function JobTaskModal({ setOpen, isOpen, setInputValue }: Props) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const handleSave = () => {
    if (!title.trim()) return alert("Please enter a title");
    const form = {
      title: title,
      description: desc,
    };

    setInputValue(form);
    setOpen(false);
  };

  return (
    <BaseModal isOpen={isOpen} onClose={() => setOpen(false)}>
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative animate-fade-in">
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
              onChange={(e) => setTitle(e.target.value)}
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
              onChange={(e) => setDesc(e.target.value)}
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
