import UploadForm from "@/components/UploadForm";
import { WEDDING } from "@/lib/wedding";

export const metadata = {
  title: `Upload | ${WEDDING.couple}`,
};

export default function UploadPage() {
  return <UploadForm />;
}
