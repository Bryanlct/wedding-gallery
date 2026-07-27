import UploadForm from "@/components/UploadForm";
import WeddingHeader from "@/components/WeddingHeader";
import { WEDDING } from "@/lib/wedding";

export const metadata = {
  title: `上傳照片 | ${WEDDING.couple}`,
};

export default function UploadPage() {
  return (
    <div className="flex flex-col">
      <WeddingHeader title="上傳照片" showDetails={false} compact />
      <UploadForm />
    </div>
  );
}
