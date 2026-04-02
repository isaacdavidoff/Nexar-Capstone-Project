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

      // ❌ error case
      if (signUpError) {
        setError(signUpError);
        setLoading(false);
        return;
      }

      // ✅ success case
      if (data) {
        router.push("/dashboard"); // change to your route
        return;
      }

    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false); // ✅ always reset loading
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow">
        
        <h1 className="text-2xl font-semibold mb-6 text-center">
          Create Account
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" disabled={loading}>
          
          <input
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            required
            className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

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
            minLength={6}
            className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            disabled={loading}
            className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}
        </form>

        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}