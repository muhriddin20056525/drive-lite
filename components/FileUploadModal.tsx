"use client";
import { modalVariants } from "@/constants/variants";
import { Dispatch, SetStateAction, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { supabase } from "@/utils/supabase";
import { Loader2 } from "lucide-react";
import { useFiles } from "@/hooks/useFiles";

type FileUploadModalProps = {
  setOpenFileUploadModal: Dispatch<SetStateAction<boolean>>;
};

function FileUploadModal({ setOpenFileUploadModal }: FileUploadModalProps) {
  // States For File Data
  const [fileUrl, setFileUrl] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [fileSize, setFileSize] = useState<number>(0);
  const [fileType, setFileType] = useState<string>("");

  // State For File Upload Loading
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // useFiles Hook
  const { uploadFile, isUploading } = useFiles();

  // Change Event For Get File Input Value
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // Get File
    const selectedFile = e.target.files?.[0];

    // Check File
    if (!selectedFile) {
      toast.error("Choose A File");
      return;
    }

    try {
      setIsLoading(true);
      // Generate Name For File
      const fileName = `${Date.now()}-${selectedFile.name}`;

      // Upload File To Supabase
      const { data, error } = await supabase.storage
        .from("drive-lite")
        .upload(fileName, selectedFile);

      // Returt Error
      if (error) throw error;

      // Get File Url From Supabase
      const {
        data: { publicUrl },
      } = supabase.storage.from("drive-lite").getPublicUrl(fileName);

      // Set Data To File Data States
      setFileUrl(publicUrl);
      setFileName(fileName);
      setFileSize(selectedFile.size);
      setFileType(selectedFile.type);
    } catch (error) {
      console.error("Error File Upload", error);
    } finally {
      setIsLoading(false);
    }
  };

  // File Uplaod
  const handleFileUpload = async (
    fileName: string,
    fileType: string,
    fileUrl: string,
    fileSize: number
  ) => {
    const data = await uploadFile(fileName, fileType, fileUrl, fileSize);

    if (data) {
      setFileName("");
      setFileSize(0);
      setFileUrl("");
      setFileType("");
      setOpenFileUploadModal(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <motion.div
        className="fixed inset-0 bg-black/60 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setOpenFileUploadModal(false)}
      />

      {/* Modal */}
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]
        w-[500px] max-w-[90%] z-50 rounded-2xl border border-graphite
        shadow-[var(--shadow-elevated)] bg-gradient-dark p-6"
      >
        {/* Title */}
        <h2 className="text-skyfog text-xl font-semibold mb-4">Upload File</h2>

        {/* File Input */}
        <label className="block mb-6">
          <span className="text-steel text-sm mb-2 block">Choose a file</span>
          <div className="flex items-center gap-3">
            <input
              type="file"
              accept="image/*,video/*,.pdf,.doc,.docx,.xlsx,.txt"
              onChange={handleFileChange}
              className="w-full rounded-lg bg-storm border border-graphite text-skyfog
            file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0
            file:bg-skyflare file:text-midnight file:font-medium
            hover:file:opacity-90 cursor-pointer focus:outline-none"
            />

            {isLoading && <Loader2 className="animate-spin text-skyflare" />}
          </div>
        </label>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setOpenFileUploadModal(false)}
            className="px-4 py-2 rounded-lg border border-graphite text-steel hover:bg-graphite transition"
          >
            Cancel
          </button>
          <button
            onClick={() =>
              handleFileUpload(fileName, fileType, fileUrl, fileSize)
            }
            className="px-4 py-2 rounded-lg bg-skyflare text-midnight font-medium hover:opacity-90 transition flex items-center gap-2"
          >
            Upload
            {isUploading && <Loader2 className="animate-spin" color="white" />}
          </button>
        </div>
      </motion.div>
    </>
  );
}

export default FileUploadModal;
