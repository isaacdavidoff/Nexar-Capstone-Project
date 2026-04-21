"use client";

import { useState, useEffect, useMemo } from "react";
import useAuthUser from "@/hooks/useAuth";
import { addTask, updateTask } from "@/lib/task";
import { formatDateInput } from "@/lib/dateFormat";
import { Timestamp } from "firebase/firestore";

export default function AddTaskModal({ isOpen, onClose, courses = [], existingTask = null }) {
  const user = useAuthUser();
  const isEdit = !!existingTask;
  const [loading, setLoading] = useState(false);

  const initialFormState = useMemo(() => ({
    title: "",
    courseId: "",
    courseName: "",
    courseColor: "",
    dueDate: "",
    type: "assignment",
    priority: "medium",
    estimatedTime: 60,
    notes: "",
  }), []);

  const [form, setForm] = useState(initialFormState);

  // Sync form state when modal opens or existingTask changes
  useEffect(() => {
    if (isOpen) {
      if (existingTask) {
        setForm({
          ...existingTask,
          dueDate: formatDateInput(existingTask.dueDate) || "",
        });
      } else {
        setForm(initialFormState);
      }
    }
  }, [isOpen, existingTask, initialFormState]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "courseId") {
      const selected = courses.find((c) => (c.id || c.courseId) === value);
      setForm((prev) => ({
        ...prev,
        courseId: value,
        courseName: selected?.courseName || "",
        courseColor: selected?.color || "",
      }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const actualUid = user?.uid || user?.id;

    if (!actualUid) {
      alert("Session expired. Please log in.");
      return;
    }

    if (!form.courseId) {
      alert("Please assign this task to a course.");
      return;
    }

    try {
      setLoading(true);
      const dateObj = new Date(form.dueDate);
      const taskData = {
        ...form,
        userId: actualUid,
        estimatedTime: parseInt(form.estimatedTime, 10) || 0,
        dueDate: Timestamp.fromDate(dateObj),
        updatedAt: Timestamp.now(),
        status: existingTask?.status || "pending" // Preserve status on edit
      };

      if (isEdit) {
        await updateTask(existingTask.id, taskData);
      } else {
        await addTask({
          ...taskData,
          createdAt: Timestamp.now(),
        });
      }

      onClose();
    } catch (err) {
      console.error("Task Action Error:", err);
      alert("Failed to save task.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-8 py-6 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50">
          <div>
            <h2 className="text-2xl font-black text-neutral-900">
              {isEdit ? "Refine Task" : "Add Task"}
            </h2>
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-0.5">
              {isEdit ? "Updating your schedule" : "Create a new task"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-neutral-200 transition text-neutral-400"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {/* Title Input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-neutral-400 tracking-widest ml-1">
              Task Title
            </label>
            <input
              type="text"
              name="title"
              placeholder="e.g., Final Project Proposal"
              value={form.title}
              onChange={handleChange}
              required
              autoFocus
              className="w-full bg-neutral-50 border-2 border-neutral-100 rounded-2xl px-5 py-3 text-sm font-medium focus:border-indigo-500 focus:bg-white outline-none transition"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Course Select */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-neutral-400 tracking-widest ml-1">
                Course
              </label>
              <select
                name="courseId"
                value={form.courseId}
                onChange={handleChange}
                className="w-full bg-neutral-50 border-2 border-neutral-100 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:border-indigo-500 transition"
                required
              >
                <option value="" disabled>Select course...</option>
                {courses.map((course) => (
                  <option key={course.id || course.courseId} value={course.id || course.courseId}>
                    {course.courseName}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-neutral-400 tracking-widest ml-1">
                Deadline
              </label>
              <input
                type="datetime-local"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
                required
                className="w-full bg-neutral-50 border-2 border-neutral-100 rounded-2xl px-4 py-3 text-sm font-medium outline-none focus:border-indigo-500 transition"
              />
            </div>
          </div>

          {/* Quick Settings Grid */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-neutral-50 rounded-2xl border-2 border-dashed border-neutral-200">
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-neutral-400">Type</label>
              <select name="type" value={form.type} onChange={handleChange} className="w-full bg-transparent text-xs font-bold outline-none">
                <option value="assignment">Assignment</option>
                <option value="lab">Lab Work</option>
                <option value="quiz">Quiz</option>
                <option value="exam">Exam</option>
              </select>
            </div>

            <div className="space-y-1 border-x border-neutral-200 px-4">
              <label className="text-[9px] font-black uppercase text-neutral-400">Priority</label>
              <select name="priority" value={form.priority} onChange={handleChange} className="w-full bg-transparent text-xs font-bold outline-none">
                <option value="low">Low</option>
                <option value="medium">Normal</option>
                <option value="high">Urgent</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-neutral-400">Time (m)</label>
              <input
                type="number"
                name="estimatedTime"
                value={form.estimatedTime}
                onChange={handleChange}
                className="w-full bg-transparent text-xs font-bold outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-neutral-900 text-white py-4 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Syncing..." : isEdit ? "Update Schedule" : "Confirm Task"}
          </button>
        </form>
      </div>
    </div>
  );
}