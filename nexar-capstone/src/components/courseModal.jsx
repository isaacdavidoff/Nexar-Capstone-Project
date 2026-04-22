"use client";

import { useState, useEffect } from "react";
import useAuthUser from "@/hooks/useAuth";
import { createCourse } from "@/lib/courses";

// We move the initial state outside the component to avoid re-creation on every render
const initialState = {
  courseName: "",
  term: "",
  color: "#6366f1", // Indigo default
};

export default function CourseModal({ isOpen, onClose }) {
  const user = useAuthUser();

  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle resets and Global Listeners
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
      const handleEsc = (e) => { if (e.key === "Escape") onClose(); };
      window.addEventListener("keydown", handleEsc);
      return () => {
        window.removeEventListener("keydown", handleEsc);
        document.body.style.overflow = 'unset';
      };
    } else {
      setForm(initialState);
      setError(null);
    }
  }, [isOpen, onClose]);

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
  
    const actualUid = user?.uid || user?.id;
    if (!actualUid) {
      setError("Session expired. Please log in again.");
      return;
    }
  
    try {
      setLoading(true);
      setError(null);
  
      await createCourse({
        userId: actualUid,
        ...form,
        courseName: form.courseName.trim(),
        createdAt: new Date().toISOString(), // Good for sorting later
      });
  
      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to save course. Check your connection.");
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
        className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl p-8 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-black text-neutral-900">Add Course</h2>
            <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest mt-1">Academic Registry</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 text-neutral-400 hover:text-neutral-900 transition-colors"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-6 text-xs font-bold text-rose-500 bg-rose-50 p-3 rounded-xl border border-rose-100 animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">
              Course Title
            </label>
            <input
              type="text"
              name="courseName"
              placeholder="e.g. Data Structures"
              value={form.courseName}
              onChange={handleChange}
              autoFocus
              className="w-full bg-neutral-50 border-2 border-neutral-100 rounded-2xl px-4 py-3 text-sm font-medium focus:border-indigo-500 focus:bg-white outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">
              Term / Semester
            </label>
            <input
              type="text"
              name="term"
              placeholder="e.g. Spring 2026"
              value={form.term}
              onChange={handleChange}
              className="w-full bg-neutral-50 border-2 border-neutral-100 rounded-2xl px-4 py-3 text-sm font-medium focus:border-indigo-500 focus:bg-white outline-none transition-all"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl border-2 border-dashed border-neutral-200">
            <div className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded-lg shadow-inner transition-colors duration-300"
                style={{ backgroundColor: form.color }}
              />
              <span className="text-xs font-bold text-neutral-600 uppercase tracking-tighter">
                Branding Color
              </span>
            </div>
            <input
              type="color"
              name="color"
              value={form.color}
              onChange={handleChange}
              className="w-8 h-8 border-none bg-transparent cursor-pointer overflow-hidden"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-neutral-900 text-white py-4 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-indigo-600 disabled:opacity-50 transition-all shadow-xl active:scale-[0.98]"
          >
            {loading ? "Syncing..." : "Confirm Course"}
          </button>
        </form>
      </div>
    </div>
  );
}