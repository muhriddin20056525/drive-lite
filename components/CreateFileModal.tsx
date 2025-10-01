import { supabase } from "@/utils/supabase";
import Modal from "./Modal";
import { useState } from "react";
import { useDriveStore } from "@/store/useDriveStore";
import toast from "react-hot-toast";
import { formatFileType } from "@/utils/getFileType";
import { nanoid } from "nanoid";

type CreateFileModalProps = {
  isOpen: boolean;
  onClose: () => void;
  folderId?: string | null;
};

function CreateFileModal({
  isOpen,
  onClose,
  folderId = null,
}: CreateFileModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const { createFile } = useDriveStore();

  const handleUpload = async () => {
    if (!file) {
      toast.error("File Is Required");
      return;
    }

    try {
      setLoading(true);

      const filePath = `${nanoid(10)}.${file.name.split(".")[1]}`;

      const { error } = await supabase.storage
        .from("drive-storage")
        .upload(filePath, file);

      if (error) throw error;

      const { data } = supabase.storage
        .from("drive-storage")
        .getPublicUrl(filePath);
      const url = data.publicUrl;

      await createFile(
        filePath,
        file.size,
        url,
        formatFileType(file.type, filePath),
        folderId
      );

      setFile(null);
      onClose();
    } catch (err) {
      console.error("[SUPABASE_UPLOAD_ERROR]", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload File">
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="w-full text-skyfog"
      />

      <button
        onClick={handleUpload}
        disabled={loading}
        className="mt-3 w-full py-2 bg-skyflare text-midnight rounded-md hover:bg-blue-400 disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
    </Modal>
  );
}

export default CreateFileModal;
