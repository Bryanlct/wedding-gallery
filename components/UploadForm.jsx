"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, ImageIcon, X } from "lucide-react";
import { uploadPhoto } from "@/utils/uploadPhoto";
import { validateUploadFile } from "@/utils/validateUploadFile";
import { MAX_PHOTOS_PER_UPLOAD } from "@/lib/upload";
import { useLanguage } from "@/contexts/LanguageContext";
import UploadOverlay from "@/components/UploadOverlay";
import WeddingHeader from "@/components/WeddingHeader";

export default function UploadForm() {
  const router = useRouter();
  const { t } = useLanguage();
  const galleryInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const [previews, setPreviews] = useState([]);
  const [userName, setUserName] = useState("");
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadPhase, setUploadPhase] = useState(null);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const [success, setSuccess] = useState(false);

  const handleFileSelect = useCallback(
    (e) => {
      const files = Array.from(e.target.files || []);
      if (files.length === 0) return;

      const remaining = MAX_PHOTOS_PER_UPLOAD - previews.length;
      if (remaining <= 0) {
        alert(t("upload.maxReached", { max: MAX_PHOTOS_PER_UPLOAD }));
        e.target.value = "";
        return;
      }

      const accepted = [];
      let rejectedVideo = false;
      let rejectedInvalid = false;

      for (const file of files) {
        if (accepted.length >= remaining) break;

        const result = validateUploadFile(file);
        if (result === "video") {
          rejectedVideo = true;
          continue;
        }
        if (result === "invalid") {
          rejectedInvalid = true;
          continue;
        }

        accepted.push({
          file,
          url: URL.createObjectURL(file),
          id: `${file.name}-${file.lastModified}-${Math.random()}`,
        });
      }

      if (rejectedVideo) {
        alert(t("upload.videoNotAllowed"));
      } else if (rejectedInvalid) {
        alert(t("upload.invalidFile"));
      }

      if (files.length > remaining && accepted.length > 0) {
        alert(t("upload.maxReached", { max: MAX_PHOTOS_PER_UPLOAD }));
      }

      if (accepted.length > 0) {
        setPreviews((prev) => [...prev, ...accepted]);
        setSuccess(false);
      }

      e.target.value = "";
    },
    [previews.length, t]
  );

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
    setSuccess(false);
    setUploadProgress({ current: 0, total: previews.length });
    setUploadPhase("compressing");

    try {
      for (let i = 0; i < previews.length; i++) {
        setUploadProgress({ current: i + 1, total: previews.length });

        await uploadPhoto(previews[i].file, {
          userName,
          message,
          onPhase: setUploadPhase,
        });
      }

      previews.forEach((p) => URL.revokeObjectURL(p.url));
      setPreviews([]);
      setUserName("");
      setMessage("");
      setUploadPhase(null);
      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
        setIsUploading(false);
        router.push("/");
      }, 2000);
    } catch (err) {
      setUploadPhase(null);
      setIsUploading(false);

      let messageText = t("upload.tryAgain");
      if (err.message === "VIDEO_NOT_ALLOWED") {
        messageText = t("upload.videoNotAllowed");
      } else if (err.message === "INVALID_FILE") {
        messageText = t("upload.invalidFile");
      } else if (err.message) {
        messageText = err.message;
      }

      alert(t("upload.uploadFailed", { message: messageText }));
    }
  };

  const atLimit = previews.length >= MAX_PHOTOS_PER_UPLOAD;

  return (
    <>
      <UploadOverlay
        phase={uploadPhase}
        current={uploadProgress.current}
        total={uploadProgress.total}
        success={success}
      />

      <div className="flex flex-col">
        <WeddingHeader title={t("upload.title")} showDetails={false} compact />

        <form
          onSubmit={handleSubmit}
          className="page-content mx-auto flex max-w-2xl flex-col gap-6 py-6 md:gap-8 md:py-8"
        >
          <div className="border border-dashed border-luxury-parchment bg-white px-5 py-10 md:px-8 md:py-12">
            <p className="mb-6 text-center font-[family-name:var(--font-cormorant)] text-sm tracking-[0.15em] text-luxury-charcoal md:text-base">
              {t("upload.shareMoments")}
            </p>
            <div className="mx-auto grid max-w-lg grid-cols-2 gap-3 md:max-w-xl md:gap-4">
              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                disabled={isUploading || atLimit}
                className="btn-luxury-outline flex flex-col items-center gap-3 px-4 py-6 disabled:opacity-40 md:py-8"
              >
                <ImageIcon className="h-6 w-6 text-luxury-gold-muted" strokeWidth={1.25} />
                <span>{t("upload.photoLibrary")}</span>
                <span className="normal-case tracking-normal text-[10px] text-luxury-stone">
                  {t("upload.photoLibraryHint")}
                </span>
              </button>

              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                disabled={isUploading || atLimit}
                className="btn-luxury-outline flex flex-col items-center gap-3 px-4 py-6 disabled:opacity-40 md:py-8"
              >
                <Camera className="h-6 w-6 text-luxury-gold-muted" strokeWidth={1.25} />
                <span>{t("upload.takePhoto")}</span>
                <span className="normal-case tracking-normal text-[10px] text-luxury-stone">
                  {t("upload.takePhotoHint")}
                </span>
              </button>
            </div>
            <p className="mt-4 text-center text-[10px] leading-relaxed text-luxury-stone">
              {t("upload.compressHint")}
              <br />
              {t("upload.limitHint", { max: MAX_PHOTOS_PER_UPLOAD })}
            </p>
          </div>

          <input
            ref={galleryInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/heic,image/heif"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/heic,image/heif"
            capture="environment"
            className="hidden"
            onChange={handleFileSelect}
          />

          {previews.length > 0 && (
            <div>
              <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-luxury-stone">
                {t("upload.selected", { count: previews.length })}
                {` / ${MAX_PHOTOS_PER_UPLOAD}`}
              </p>
              <div className="grid grid-cols-3 gap-1.5 md:grid-cols-4 lg:grid-cols-5">
                {previews.map((preview) => (
                  <div key={preview.id} className="relative aspect-square">
                    <img
                      src={preview.url}
                      alt={t("common.preview")}
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removePreview(preview.id)}
                      disabled={isUploading}
                      className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center bg-luxury-charcoal text-luxury-cream disabled:opacity-50"
                      aria-label={t("common.remove")}
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
              placeholder={t("upload.yourName")}
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              disabled={isUploading}
              className="input-luxury w-full px-4 py-3.5 text-sm text-luxury-charcoal placeholder:text-luxury-stone-light/50 disabled:opacity-40"
            />
            <textarea
              placeholder={t("upload.leaveWish")}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isUploading}
              rows={3}
              className="input-luxury w-full resize-none px-4 py-3.5 font-[family-name:var(--font-cormorant)] text-sm italic text-luxury-charcoal placeholder:font-[family-name:var(--font-inter)] placeholder:not-italic placeholder:text-luxury-stone-light/50 disabled:opacity-40"
            />
          </div>

          <button
            type="submit"
            disabled={previews.length === 0 || isUploading}
            className="btn-luxury w-full py-4"
          >
            {t("upload.shareMoment")}
          </button>
        </form>
      </div>
    </>
  );
}
