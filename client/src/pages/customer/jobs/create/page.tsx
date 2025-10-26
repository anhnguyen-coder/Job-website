import React, { useEffect, useState } from "react";
import useHook from "./hook";
import { PageHeading } from "@/components/customer/pageheading";
import { Button } from "@/components/base/button";
import type { TaskInputForm } from "./type";
import { TaskItem } from "@/components/base/taskItem";
import { JobTaskModal } from "@/components/customer/job/ jobTaskModal";
import { BaseDropdownMulti } from "@/components/base/baseDropdownMultiple";

const Page = () => {
  const {
    categoriesOptions,
    handleGetCategories,
    formInput,
    setFormInput,
    handleCreateJob,
  } = useHook();

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    handleGetCategories();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCreateJob();
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTask = (task: TaskInputForm) => {
    if (!task) return;
    setFormInput((prev) => ({
      ...prev,
      tasks: [...(prev.tasks || []), task],
    }));
  };

  const removeTask = (index: number) => {
    const tasks = formInput.tasks.filter((_, i) => i !== index);
    setFormInput((prev) => ({ ...prev, tasks }));
  };

  const handleChangeCategory = (values: string[]) => {
    setFormInput((prev) => ({
      ...prev,
      categoryIds: values,
    }));
  };

  return (
    <div>
      <PageHeading title="Create New Job" />

      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-md mt-10">
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Title
            </label>
            <input
              type="text"
              name="title"
              value={formInput.title}
              onChange={handleChange}
              className="block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Enter job title"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formInput.description}
              onChange={handleChange}
              rows={4}
              className="block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Describe the job details"
              required
            />
          </div>

          {/* Category */}
          {categoriesOptions && (
            <div>
              <BaseDropdownMulti
                label="Categories"
                options={categoriesOptions}
                selected={formInput.categoryIds}
                onChange={handleChangeCategory}
              />
            </div>
          )}

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formInput.location}
              onChange={handleChange}
              className="block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Enter job location"
              required
            />
          </div>

          {/* Budget */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Budget
            </label>
            <input
              type="number"
              name="budget"
              value={formInput.budget}
              onChange={handleChange}
              className="block w-full border border-gray-300 rounded-lg shadow-sm p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Enter budget"
              required
            />
          </div>

          {/* Tasks Section */}
          <div className="border-t pt-4 mt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-800">Sub Tasks</h3>
              <Button
                className="rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                onClick={() => setShowModal(true)}
              >
                + Add Task
              </Button>
            </div>

            {showModal && (
              <JobTaskModal
                isOpen={showModal}
                setOpen={setShowModal}
                setInputValue={handleAddTask}
              />
            )}

            {formInput.tasks?.length > 0 ? (
              <div className="space-y-3">
                {formInput.tasks.map((task: TaskInputForm, index: number) => (
                  <div
                    key={index}
                    className="grid grid-cols-[9fr_1fr] border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition"
                  >
                    <TaskItem task={task} isShowCompleted={false} />
                    <button
                      type="button"
                      onClick={() => removeTask(index)}
                      className="text-red-500 hover:text-red-700"
                      title="Remove Task"
                    >
                      <i className="fa fa-trash"></i>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic mt-2">
                No tasks added yet.
              </p>
            )}
          </div>

          {/* Submit */}
          <div className="pt-6 border-t">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Create Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
