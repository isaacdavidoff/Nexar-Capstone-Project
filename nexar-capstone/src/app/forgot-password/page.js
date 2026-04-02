"use client";

import { useState } from "react";
import { resetPasswordAuth } from "@/lib/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await resetPasswordAuth(email);
      setMessage("Password reset email sent.");
    } catch (err) {
      setError("Failed to send reset email.");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Reset Password</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button>Send Reset Link</button>
        <p className="text-sm text-gray-500">
            go back to <a href="/login" className="text-blue-500">Login</a>
        </p>

        {message && <p className="text-green-500">{message}</p>}
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
}