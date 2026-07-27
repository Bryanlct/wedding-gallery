import UploadForm from "@/components/UploadForm";
import WeddingHeader from "@/components/WeddingHeader";
import { WEDDING } from "@/lib/wedding";

export const metadata = {
  title: `Upload | ${WEDDING.couple}`,
};

export default function UploadPage() {
  return (
    <div className="flex flex-col">
      <WeddingHeader title="Upload" showDetails={false} compact />
      <UploadForm />
    </div>
  );
}
