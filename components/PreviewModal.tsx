"use client";

import { usePreviewStore } from "@/store/usePreviewStore";

export default function PreviewModal() {
  const { isOpen, file, closePreview } = usePreviewStore();

  if (!isOpen || !file) return null;

  const isImage = file.type.startsWith("image/");
  const isVideo = file.type.startsWith("video/");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="relative w-[90%] max-w-3xl rounded-md bg-storm p-4 shadow-lg">
        {/* Close Button */}
        <button
          onClick={closePreview}
          className="absolute right-2 top-2 text-skyfog hover:text-crimson"
        >
          ✕
        </button>

        {/* File Preview */}
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-lg font-semibold text-skyfog">{file.name}</h2>

          {isImage && (
            <img
              src={file.url}
              alt={file.name}
              className="max-h-[60vh] rounded-md object-contain"
            />
          )}

          {isVideo && (
            <video
              src={file.url}
              controls
              className="max-h-[60vh] w-full rounded-md"
            />
          )}

          {!isImage && !isVideo && (
            <div className="flex flex-col items-center">
              <p className="text-steel">File preview not available</p>
              <a
                href={file.url}
                target="_blank"
                className="mt-2 rounded bg-skyflare px-4 py-2 text-sm text-white"
              >
                Download
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
