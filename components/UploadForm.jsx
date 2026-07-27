"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, X, Loader2, CheckCircle2, Sparkles } from "lucide-react";
import { uploadPhoto } from "@/utils/uploadPhoto";

export default function UploadForm() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [previews, setPreviews] = useState([]);
  const [userName, setUserName] = useState("");
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const [success, setSuccess] = useState(false);

  const handleFileSelect = useCallback((e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newPreviews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      id: `${file.name}-${file.lastModified}-${Math.random()}`,
    }));

    setPreviews((prev) => [...prev, ...newPreviews]);
    setSuccess(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const removePreview = useCallback((id) => {
    setPreviews((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((p) => p.id !== id);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (previews.length === 0 || isUploading) return;

    setIsUploading(true);
    setUploadProgress({ current: 0, total: previews.length });
    setSuccess(false);

    try {
      for (let i = 0; i < previews.length; i++) {
        const { file } = previews[i];
        setUploadProgress({ current: i + 1, total: previews.length });
        await uploadPhoto(file, { userName, message });
      }

      previews.forEach((p) => URL.revokeObjectURL(p.url));
      setPreviews([]);
      setUserName("");
      setMessage("");
      setSuccess(true);

      setTimeout(() => router.push("/"), 1500);
    } catch (err) {
      console.error("Upload failed:", err);
      alert(`上傳失敗：${err.message || "請稍後再試"}`);
    } finally {
      setIsUploading(false);
      setUploadProgress({ current: 0, total: 0 });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-4 py-5">
      {success && (
        <div className="flex items-center gap-2 rounded-2xl bg-green-50 px-4 py-3.5 text-sm font-medium text-green-700 ring-1 ring-green-100">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          上傳成功！正在跳轉至相簿牆...
        </div>
      )}

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="upload-zone flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-purple-300 bg-gradient-to-b from-wedding-bg-alt to-white px-6 py-14 transition-all hover:border-wedding-primary-light hover:shadow-md disabled:opacity-50"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-wedding-accent-soft shadow-inner">
          <Camera className="h-8 w-8 text-wedding-primary-light" />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-purple-800">
            Tap to capture or select photos
          </p>
          <p className="mt-1.5 text-xs leading-relaxed text-purple-400">
            支援多張照片同時選取，自動壓縮後上傳
          </p>
        </div>
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        capture="environment"
        className="hidden"
        onChange={handleFileSelect}
      />

      {previews.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold text-purple-500">
            已選 {previews.length} 張照片
          </p>
          <div className="grid grid-cols-3 gap-2">
            {previews.map((preview) => (
              <div key={preview.id} className="relative aspect-square">
                <img
                  src={preview.url}
                  alt="預覽"
                  className="h-full w-full rounded-xl object-cover ring-1 ring-purple-100"
                />
                <button
                  type="button"
                  onClick={() => removePreview(preview.id)}
                  disabled={isUploading}
                  className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-wedding-primary text-white shadow-md transition-transform hover:scale-110 disabled:opacity-50"
                  aria-label="移除照片"
                >
                  <X className="h-3.5 w-3.5" strokeWidth={3} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <input
          type="text"
          placeholder="Your Name (Optional)"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          disabled={isUploading}
          className="w-full rounded-xl border border-purple-100 bg-white px-4 py-3.5 text-sm text-purple-900 shadow-sm placeholder:text-purple-300 focus:border-wedding-primary-light focus:outline-none focus:ring-2 focus:ring-purple-200/60 disabled:opacity-50"
        />
        <textarea
          placeholder="Leave a Wish..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={isUploading}
          rows={3}
          className="w-full resize-none rounded-xl border border-purple-100 bg-white px-4 py-3.5 text-sm text-purple-900 shadow-sm placeholder:text-purple-300 focus:border-wedding-primary-light focus:outline-none focus:ring-2 focus:ring-purple-200/60 disabled:opacity-50"
        />
      </div>

      {isUploading && uploadProgress.total > 0 && (
        <div className="rounded-2xl bg-gradient-to-r from-purple-50 to-wedding-bg-alt px-4 py-4 text-center ring-1 ring-purple-100">
          <div className="flex items-center justify-center gap-2 text-sm font-semibold text-wedding-primary">
            <Loader2 className="h-4 w-4 animate-spin" />
            正在上傳第 {uploadProgress.current} / {uploadProgress.total} 張...
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-purple-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-wedding-primary to-wedding-primary-light transition-all duration-300"
              style={{
                width: `${(uploadProgress.current / uploadProgress.total) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={previews.length === 0 || isUploading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-wedding-primary to-wedding-primary-light py-4 text-sm font-bold tracking-wide text-white shadow-lg shadow-purple-900/25 transition-all hover:shadow-purple-900/40 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Sparkles className="h-4 w-4" />
        {isUploading ? "Uploading..." : "Share My Moment"}
      </button>
    </form>
  );
}
