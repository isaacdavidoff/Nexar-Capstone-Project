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
          setLoading(false);
          return;
        }
    
      router.push("/");
    } catch (err) {
      setError(err.message || "invalid credentials");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div className="w-full max-w-md bg-white p-6 rounded-xl shadow">
      
      <h1 className="text-2xl font-semibold mb-6 text-center">
        Welcome Back
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          required
          className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
          className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          disabled={loading}
          className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}
      </form>

      <button
        onClick={() => router.push("/forgot-password")}
        className="mt-4 text-sm text-blue-600 hover:underline w-full text-center"
      >
        Forgot Password?
      </button>

      <button onClick={() => router.push("/signup")} className="mt-2 text-sm text-gray-600 hover:underline w-full text-center">
      <span>Don&apos;t have an account? Sign Up</span>
      </button>
    </div>
  </div>
);
}