"use client";

import Image from "next/image";
import { useRef, useState } from "react";

const MAX_EDGE = 1600;
const QUALITY = 0.82;

/**
 * Downscales and re-encodes to WebP in the browser before upload.
 *
 * A phone photo is 4-6 MB; Blob's free tier is ~1 GB total. Resizing here keeps
 * a 100+ product catalog comfortably inside it and makes the storefront faster,
 * rather than trusting whoever uploads to have resized first.
 */
async function compress(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);

  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) return file;

  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", QUALITY),
  );

  // If encoding failed or somehow grew the file, keep the original.
  return blob && blob.size < file.size ? blob : file;
}

export function ImageUploader({
  images,
  onChange,
}: {
  images: string[];
  onChange: (images: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState("");

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;

    setBusy(true);
    setError("");
    const uploaded: string[] = [];

    try {
      for (const [index, file] of Array.from(files).entries()) {
        setProgress(`Uploading ${index + 1} of ${files.length}...`);

        const optimised = await compress(file);
        const form = new FormData();
        form.append("file", new File([optimised], file.name.replace(/\.[^.]+$/, ".webp"), {
          type: optimised.type || file.type,
        }));

        const response = await fetch("/api/admin/upload", { method: "POST", body: form });
        const data = await response.json().catch(() => ({}));

        if (!response.ok) throw new Error(data.message || "Upload failed");
        uploaded.push(data.url);
      }

      onChange([...images, ...uploaded].slice(0, 12));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
      setProgress("");
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <button
        type="button"
        disabled={busy}
        onClick={() => inputRef.current?.click()}
        className="h-14 w-full rounded-md border-2 border-dashed border-slate-400 bg-white text-base font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
      >
        {busy ? progress || "Uploading..." : "Choose photos from your device"}
      </button>
      <p className="text-sm text-slate-500">
        You can pick more than one. Photos are shrunk automatically, so large phone pictures are fine.
      </p>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        multiple
        hidden
        onChange={(event) => handleFiles(event.target.files)}
      />

      {error && (
        <p role="alert" className="rounded-[3px] border border-red-200 bg-red-50 p-2 text-xs font-semibold text-red-700">
          {error}
        </p>
      )}

      {images.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {images.map((url, index) => (
            <div
              key={url}
              className="relative h-24 w-24 overflow-hidden rounded-[3px] border border-slate-200 bg-slate-100"
            >
              <Image src={url} alt="" fill sizes="96px" className="object-cover" />
              {index === 0 && (
                <span className="absolute inset-x-0 bottom-0 bg-slate-950/85 py-1 text-center text-[0.65rem] font-bold uppercase tracking-wide text-white">
                  Main photo
                </span>
              )}
              <button
                type="button"
                aria-label="Remove photo"
                onClick={() => onChange(images.filter((item) => item !== url))}
                className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-slate-950/85 text-base text-white hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
