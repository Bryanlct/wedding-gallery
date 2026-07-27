"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, X, Loader2, Check } from "lucide-react";
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

    if (fileInputRef.current) fileInputRef.current.value = "";
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
        setUploadProgress({ current: i + 1, total: previews.length });
        await uploadPhoto(previews[i].file, { userName, message });
      }

      previews.forEach((p) => URL.revokeObjectURL(p.url));
      setPreviews([]);
      setUserName("");
      setMessage("");
      setSuccess(true);
      setTimeout(() => router.push("/"), 1800);
    } catch (err) {
      alert(`上傳失敗：${err.message || "請稍後再試"}`);
    } finally {
      setIsUploading(false);
      setUploadProgress({ current: 0, total: 0 });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 px-5 py-6">
      {success && (
        <div className="flex items-center gap-3 border border-luxury-gold/30 bg-luxury-ivory px-4 py-3.5 text-sm text-luxury-charcoal">
          <Check className="h-4 w-4 text-luxury-gold" strokeWidth={1.5} />
          <span className="tracking-wide">Uploaded successfully</span>
        </div>
      )}

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="flex flex-col items-center gap-5 border border-dashed border-luxury-parchment bg-white px-6 py-16 transition-colors hover:border-luxury-gold/50 hover:bg-luxury-warm disabled:opacity-40"
      >
        <div className="flex h-14 w-14 items-center justify-center border border-luxury-gold/30">
          <Camera className="h-6 w-6 text-luxury-gold-muted" strokeWidth={1.25} />
        </div>
        <div className="text-center">
          <p className="text-[11px] uppercase tracking-[0.2em] text-luxury-charcoal">
            Select Photos
          </p>
          <p className="mt-2 text-[11px] tracking-wide text-luxury-stone">
            Tap to capture or choose from gallery
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
          <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-luxury-stone">
            {previews.length} selected
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            {previews.map((preview) => (
              <div key={preview.id} className="relative aspect-square">
                <img
                  src={preview.url}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removePreview(preview.id)}
                  disabled={isUploading}
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center bg-luxury-charcoal text-luxury-cream disabled:opacity-50"
                  aria-label="Remove"
                >
                  <X className="h-3 w-3" strokeWidth={2} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <input
          type="text"
          placeholder="Your name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          disabled={isUploading}
          className="input-luxury w-full px-4 py-3.5 text-sm text-luxury-charcoal placeholder:text-luxury-stone-light/50 disabled:opacity-40"
        />
        <textarea
          placeholder="Leave a wish..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={isUploading}
          rows={3}
          className="input-luxury w-full resize-none px-4 py-3.5 font-[family-name:var(--font-cormorant)] text-sm italic text-luxury-charcoal placeholder:font-[family-name:var(--font-inter)] placeholder:not-italic placeholder:text-luxury-stone-light/50 disabled:opacity-40"
        />
      </div>

      {isUploading && uploadProgress.total > 0 && (
        <div className="border border-luxury-parchment bg-white px-4 py-4 text-center">
          <p className="flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.15em] text-luxury-charcoal">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            {uploadProgress.current} / {uploadProgress.total}
          </p>
          <div className="mt-3 h-px overflow-hidden bg-luxury-parchment">
            <div
              className="h-full bg-luxury-gold transition-all duration-500"
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
        className="btn-luxury w-full py-4"
      >
        {isUploading ? "Uploading" : "Share Moment"}
      </button>
    </form>
  );
}
