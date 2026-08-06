"use client";

import { useState, type FormEvent } from "react";

export function HeroQuoteForm() {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMsg("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/rfq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phoneNumber,
          message,
          company: honeypot,
          lines: [],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "We could not submit your request. Please try again.");
      }

      setSuccess(true);
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : "Something went wrong. Please try again or call us directly.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-[4px] border border-white/10 bg-slate-900 p-6 text-center shadow-[0_10px_26px_rgba(15,23,42,0.35)]">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-xl text-emerald-400">
          ✓
        </span>
        <h3 className="mt-3 text-lg font-semibold text-white">Request Sent</h3>
        <p className="mt-2 text-sm leading-6 text-slate-300">We will call you back shortly.</p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-4 inline-flex h-10 items-center justify-center rounded-[3px] border border-white/15 bg-transparent px-4 text-sm font-medium text-white transition-colors hover:bg-slate-800"
        >
          Send Another Request
        </button>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-4 text-center text-2xl font-semibold tracking-tight text-white sm:text-3xl">
        Get a Callback
      </p>
      <form
        onSubmit={handleSubmit}
        className="rounded-[6px] border border-white/10 bg-slate-900 p-5 shadow-[0_10px_26px_rgba(15,23,42,0.35)]"
      >
      <div className="space-y-3">
        <input
          required
          placeholder="Name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="h-11 w-full rounded-[3px] border border-white/15 bg-slate-800 px-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-white/30"
        />
        <input
          required
          placeholder="Phone Number"
          value={phoneNumber}
          onChange={(event) => setPhoneNumber(event.target.value)}
          className="h-11 w-full rounded-[3px] border border-white/15 bg-slate-800 px-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-white/30"
        />
        <textarea
          required
          placeholder="What do you need?"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={3}
          className="w-full rounded-[3px] border border-white/15 bg-slate-800 px-3 py-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-white/30"
        />

        {/* Spam trap: hidden from users, ignored by them, filled by bots. */}
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={honeypot}
          onChange={(event) => setHoneypot(event.target.value)}
          className="absolute h-0 w-0 overflow-hidden opacity-0"
        />

        {errorMsg && (
          <div role="alert" className="rounded-[3px] border border-red-400/30 bg-red-950/60 p-3 text-xs font-semibold text-red-200">
            {errorMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex h-11 w-full items-center justify-center rounded-[3px] border border-white/15 bg-white px-4 text-sm font-medium text-slate-950 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Sending..." : "Send Request"}
        </button>
      </div>
      </form>
    </div>
  );
}
