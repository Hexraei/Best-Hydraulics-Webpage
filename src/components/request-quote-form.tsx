"use client";

import { useState, type FormEvent } from "react";
import { AlertIcon, CheckIcon } from "@/components/icons";

/**
 * Customer-details-only quote request — no cart line items. Posts to the same
 * /api/rfq endpoint the cart page uses, just with an empty lines array, which
 * the endpoint already treats as a callback-only enquiry.
 */
export function RequestQuoteForm() {
  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailId, setEmailId] = useState("");
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
          businessName,
          phoneNumber,
          emailId,
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
      <div className="rounded-[4px] border border-slate-200 bg-white p-8 text-center shadow-[0_10px_26px_rgba(15,23,42,0.05)]">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckIcon className="h-6 w-6" />
        </span>
        <h3 className="mt-4 text-2xl font-semibold tracking-tight text-slate-950">Quote Request Sent</h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Your request has been delivered to our sales desk. Our team will get back to you as soon as possible.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-6 inline-flex h-11 items-center justify-center rounded-[3px] border border-slate-300 bg-white px-5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
        >
          Send Another Request
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[4px] border border-slate-200 bg-slate-950 p-5 text-white shadow-[0_10px_26px_rgba(15,23,42,0.08)]"
    >
      <p className="text-[0.82rem] font-semibold uppercase tracking-[0.24em] text-slate-200/75">Request quote</p>
      <div className="mt-4 space-y-4">
        <label className="block space-y-2">
          <span className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-slate-200/75">Name</span>
          <input
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="h-11 w-full rounded-[3px] border border-white/10 bg-slate-900 px-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-white/20"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-slate-200/75">
            Business name <span className="font-normal text-slate-400">(optional)</span>
          </span>
          <input
            value={businessName}
            onChange={(event) => setBusinessName(event.target.value)}
            className="h-11 w-full rounded-[3px] border border-white/10 bg-slate-900 px-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-white/20"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-slate-200/75">Phone number</span>
          <input
            required
            value={phoneNumber}
            onChange={(event) => setPhoneNumber(event.target.value)}
            className="h-11 w-full rounded-[3px] border border-white/10 bg-slate-900 px-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-white/20"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-slate-200/75">Email ID</span>
          <input
            required
            type="email"
            value={emailId}
            onChange={(event) => setEmailId(event.target.value)}
            className="h-11 w-full rounded-[3px] border border-white/10 bg-slate-900 px-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-white/20"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-slate-200/75">
            Extra message <span className="font-normal text-slate-400">(optional)</span>
          </span>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={5}
            className="w-full rounded-[3px] border border-white/10 bg-slate-900 px-3 py-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-white/20"
          />
        </label>

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
          <div
            role="alert"
            className="flex items-start gap-2 rounded-[3px] border border-red-200 bg-red-950 p-3 text-xs font-semibold text-red-200"
          >
            <AlertIcon className="h-4 w-4" />
            <span>{errorMsg}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex h-11 w-full items-center justify-center rounded-[3px] border border-white/15 bg-white px-4 text-sm font-medium text-slate-950 transition-colors hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Sending request..." : "Request Quote"}
        </button>
      </div>
    </form>
  );
}
