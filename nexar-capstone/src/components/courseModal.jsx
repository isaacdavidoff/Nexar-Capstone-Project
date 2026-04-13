"use client";

import { useState, useEffect, useMemo } from "react";
import useAuthUser from "@/hooks/useAuth";
import { createCourse } from "@/lib/courses";

export default function CourseModal({ isOpen, onClose }) {
  const user = useAuthUser();

  const initialState = useMemo(() => ({
    courseName: "",
    term: "",
    color: "#6366f1",
  }), []);

  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      setForm(initialState);
      setError(null);
    }

    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    }

    if (isOpen)  window.addEventListener("keydown", handleEsc);

    return () => window.removeEventListener("keydown", handleEsc);

  }, [initialState, isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
 
    if (!form.courseName.trim()) {
      setError("Please enter a valid course name.");
      return;
    }
  
    if (!user?.id) {
      setError("You must be logged in to create a course.");
      return;
    }
  
    try {
      setLoading(true);
      setError(null);
  
      await createCourse({
        userId: user.id,
        ...form,
        courseName: form.courseName.trim(),
      });
  
      onClose();
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-white w-full max-w-md rounded-xl shadow-xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Create Course</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-black transition-colors"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {error && (
          <p className="mb-4 text-sm text-red-600 bg-red-50 p-2 rounded">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
              Course Name
            </label>
            <input
              type="text"
              name="courseName"
              placeholder="e.g. Advanced Web Development"
              value={form.courseName}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
              Term
            </label>
            <input
              type="text"
              name="term"
              placeholder="e.g. Winter 2026"
              value={form.term}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-violet-500 outline-none transition-all"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700">
              Theme Color
            </span>
            <input
              type="color"
              name="color"
              value={form.color}
              onChange={handleChange}
              className="w-10 h-10 border-none rounded-lg cursor-pointer bg-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-violet-600 text-white py-3 rounded-lg text-sm font-semibold hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-[0.98]"
          >
            {loading ? "Creating..." : "Create Course"}
          </button>
        </form>
      </div>
    </div>
  );
}