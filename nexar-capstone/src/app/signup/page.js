"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/services/auth";

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error: signUpError } = await signUp(form);

      if (signUpError) {
        setError(signUpError);
        return;
      }

      // No need for manual state setting; 
      // router.push triggers the ProtectedRoute to check the new Firebase session.
      router.push("/dashboard"); 
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4 selection:bg-indigo-100">
      <div className="w-full max-w-md bg-white p-10 rounded-[2.5rem] border border-neutral-100 shadow-xl shadow-neutral-200/50">
        
        <div className="flex flex-col items-center mb-10">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl mb-4">
            N
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-neutral-900 text-center">
            Start Your Journey
          </h1>
          <p className="text-neutral-400 font-medium text-sm">Create your student operating system</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            required
            className="bg-neutral-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-indigo-600 transition outline-none font-medium"
          />

          <input
            name="email"
            type="email"
            placeholder="Student Email"
            onChange={handleChange}
            required
            className="bg-neutral-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-indigo-600 transition outline-none font-medium"
          />

          <input
            name="password"
            type="password"
            placeholder="Create Password"
            onChange={handleChange}
            required
            minLength={6}
            className="bg-neutral-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-indigo-600 transition outline-none font-medium"
          />

          <button
            disabled={loading}
            className="bg-neutral-900 text-white py-4 rounded-2xl font-black hover:bg-indigo-600 transition-all disabled:opacity-50 shadow-lg active:scale-[0.98] mt-2"
          >
            {loading ? "Creating Account..." : "Join Nexar"}
          </button>

          {error && (
            <div className="bg-red-50 text-red-500 text-xs font-bold p-3 rounded-xl text-center border border-red-100 mt-2">
              {error}
            </div>
          )}
        </form>

        <div className="mt-8 pt-6 border-t border-neutral-50 text-center">
          <p className="text-xs font-bold text-neutral-400">
            Already have an account?{" "}
            <span
              onClick={() => router.push("/login")}
              className="text-indigo-600 cursor-pointer hover:underline underline-offset-4"
            >
              Sign In
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}