"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";

const MAX_IMAGES = 5;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"]);

type PendingImage = {
  file: File;
  previewUrl: string;
};

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      // reader.result is a data URL like "data:image/png;base64,AAAA..." —
      // Resend's attachments field wants just the base64 payload.
      const result = reader.result as string;
      resolve(result.slice(result.indexOf(",") + 1));
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function HeroQuoteForm() {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [images, setImages] = useState<PendingImage[]>([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    // Always clear the input so selecting the same file again re-fires onChange.
    event.target.value = "";
    if (files.length === 0) return;

    setErrorMsg("");

    const room = MAX_IMAGES - images.length;
    if (room <= 0) {
      setErrorMsg(`You can attach at most ${MAX_IMAGES} images.`);
      return;
    }

    const accepted: PendingImage[] = [];
    for (const file of files.slice(0, room)) {
      if (!ALLOWED_TYPES.has(file.type)) {
        setErrorMsg(`${file.name}: only JPG, PNG, WEBP, or HEIC images are allowed.`);
        continue;
      }
      if (file.size > MAX_IMAGE_BYTES) {
        setErrorMsg(`${file.name}: image must be under 5MB.`);
        continue;
      }
      accepted.push({ file, previewUrl: URL.createObjectURL(file) });
    }

    if (files.length > room) {
      setErrorMsg(`Only ${MAX_IMAGES} images can be attached — some were not added.`);
    }

    setImages((prev) => [...prev, ...accepted]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[index].previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMsg("");
    setSubmitting(true);

    try {
      const encodedImages = await Promise.all(
        images.map(async ({ file }) => ({
          filename: file.name,
          contentType: file.type,
          content: await fileToBase64(file),
        })),
      );

      const response = await fetch("/api/rfq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phoneNumber,
          message,
          company: honeypot,
          lines: [],
          images: encodedImages,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "We could not submit your request. Please try again.");
      }

      images.forEach((image) => URL.revokeObjectURL(image.previewUrl));
      setImages([]);
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

        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
            multiple
            onChange={handleFilesSelected}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={images.length >= MAX_IMAGES}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-[3px] border border-dashed border-white/20 bg-slate-800/50 px-3 text-sm text-slate-300 transition-colors hover:border-white/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span aria-hidden="true">📎</span>
            {images.length > 0 ? `Add more images (${images.length}/${MAX_IMAGES})` : "Attach images (optional, up to 5)"}
          </button>

          {images.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {images.map((image, index) => (
                <div key={image.previewUrl} className="group relative h-16 w-16 overflow-hidden rounded-[3px] border border-white/15">
                  {/* eslint-disable-next-line @next/next/no-img-element -- local object URL preview, not a served asset */}
                  <img src={image.previewUrl} alt={image.file.name} className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    aria-label={`Remove ${image.file.name}`}
                    className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-slate-950/80 text-[10px] text-white transition-opacity hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

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
