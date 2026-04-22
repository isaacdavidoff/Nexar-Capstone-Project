"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/services/auth";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
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
      const { data, error } = await login(form);
  
      if (error) {
        setError(error);
        return; // loading is handled by finally block
      }
      
      router.push("/dashboard"); 
    } catch (err) {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // ... inside return ...
<div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4 selection:bg-indigo-100">
  <div className="w-full max-w-md bg-white p-10 rounded-[2.5rem] border border-neutral-100 shadow-xl shadow-neutral-200/50">
    
    <div className="flex flex-col items-center mb-10">
      <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl mb-4">
        N
      </div>
      <h1 className="text-3xl font-black tracking-tighter text-neutral-900">
        Welcome Back
      </h1>
      <p className="text-neutral-400 font-medium text-sm">Continue your focus session</p>
    </div>

    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
        placeholder="Password"
        onChange={handleChange}
        required
        className="bg-neutral-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-indigo-600 transition outline-none font-medium"
      />

      <button
        disabled={loading}
        className="bg-neutral-900 text-white py-4 rounded-2xl font-black hover:bg-indigo-600 transition-all disabled:opacity-50 shadow-lg active:scale-[0.98] mt-2"
      >
        {loading ? "Authenticating..." : "Sign In"}
      </button>

      {error && (
        <div className="bg-red-50 text-red-500 text-xs font-bold p-3 rounded-xl text-center border border-red-100">
          {error}
        </div>
      )}
    </form>

    <div className="mt-8 pt-6 border-t border-neutral-50 flex flex-col gap-3">
      <button
        onClick={() => router.push("/forgot-password")}
        className="text-xs font-bold text-neutral-400 hover:text-indigo-600 transition"
      >
        Forgot your password?
      </button>
      <button 
        onClick={() => router.push("/signup")} 
        className="text-xs font-bold text-neutral-400 hover:text-neutral-900 transition"
      >
        New to Nexar? <span className="text-indigo-600 underline underline-offset-4">Create an account</span>
      </button>
    </div>
  </div>
</div>
);
}