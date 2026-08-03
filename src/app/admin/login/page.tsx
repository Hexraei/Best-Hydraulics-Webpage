"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  // Prefilled: there is one account, so the owner only needs to type a password.
  const [email, setEmail] = useState("alfaruberss@gmail.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Sign in failed");
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-lg"
      >
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Best Hydraulics
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Store Login</h1>
          <p className="mt-2 text-base text-slate-600">Sign in to manage your products</p>
        </div>

        <label className="mt-8 block">
          <span className="text-base font-semibold text-slate-800">Email</span>
          <input
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 h-14 w-full rounded-md border-2 border-slate-300 bg-white px-4 text-base text-slate-900 outline-none focus:border-slate-900"
          />
        </label>

        <label className="mt-5 block">
          <span className="text-base font-semibold text-slate-800">Password</span>
          <div className="relative mt-2">
            <input
              type={showPassword ? "text" : "password"}
              required
              autoFocus
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-14 w-full rounded-md border-2 border-slate-300 bg-white px-4 pr-20 text-base text-slate-900 outline-none focus:border-slate-900"
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </label>

        {error && (
          <p
            role="alert"
            className="mt-5 rounded-md border-2 border-red-200 bg-red-50 p-4 text-base font-semibold text-red-700"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-7 h-14 w-full rounded-md bg-slate-900 text-lg font-semibold text-white transition-colors hover:bg-slate-700 disabled:opacity-50"
        >
          {submitting ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
