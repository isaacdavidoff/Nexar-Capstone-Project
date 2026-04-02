"use client";

import { useState } from "react";
import useAuthUser from "@/hooks/useAuth";
import { addTask } from "@/lib/task";

export default function AddTaskModal({ isOpen, onClose, courses = [] }) {
  const user = useAuthUser();
  const [loading, setLoading] = useState(false);

  const initialFormState = {
    title: "",
    courseId: "",
    courseName: "",
    courseColor: "",
    dueDate: "",
    type: "assignment",
    priority: "medium",
    estimatedTime: 60,
    notes: "",
  };

  const [form, setForm] = useState(initialFormState);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "courseId") {
      const selected = courses.find((c) => c.courseId === value);
      setForm((prev) => ({
        ...prev,
        courseId: selected?.courseId || "",
        courseName: selected?.courseName || "",
        courseColor: selected?.color || "",
      }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    if (!form.courseId) {
      alert("Please select a course for this task.");
      return;
    }

    try {
      setLoading(true);
      await addTask({
        ...form,
        userId: user.userId,
        dueDate: new Date(form.dueDate).toISOString(),
      });

      setForm(initialFormState);
      onClose();
    } catch (err) {
      console.error("Failed to add task:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-800">New Task</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition text-gray-500"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1 ml-1">
              Task Title
            </label>
            <input
              type="text"
              name="title"
              placeholder="e.g., Study for Midterm"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full border-gray-200 border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1 ml-1">
                Course
              </label>
              <select
                name="courseId"
                value={form.courseId}
                onChange={handleChange}
                className="w-full border-gray-200 border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="">Select Course</option>
                {courses.length === 0 ? (
                  <option disabled>No courses yet</option>
                ) : (
                  <>
                    <option value="">Select course</option>
                    {courses.map((course) => (
                      <option key={course.courseId} value={course.courseId}>
                        {course.courseName}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1 ml-1">
                Due Date
              </label>
              <input
                type="datetime-local"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
                required
                className="w-full border-gray-200 border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1">
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1 ml-1">
                Type
              </label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full border rounded-xl px-3 py-2 text-sm outline-none"
              >
                <option value="assignment">Assignment</option>
                <option value="lab">Lab</option>
                <option value="quiz">Quiz</option>
                <option value="exam">Exam</option>
              </select>
            </div>

            <div className="col-span-1">
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1 ml-1">
                Priority
              </label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="w-full border rounded-xl px-3 py-2 text-sm outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Med</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="col-span-1">
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1 ml-1">
                Mins
              </label>
              <input
                type="number"
                name="estimatedTime"
                value={form.estimatedTime}
                onChange={handleChange}
                min="0"
                className="w-full border rounded-xl px-3 py-2 text-sm outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-gray-500 mb-1 ml-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows="3"
              placeholder="Add details..."
              className="w-full border-gray-200 border rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] bg-violet-600 text-white py-2.5 rounded-xl font-bold hover:bg-violet-700 transition disabled:opacity-50"
            >
              {loading ? "Adding..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
