import { modalVariants } from "@/constants/variants";
import { Dispatch, SetStateAction } from "react";
import { motion } from "framer-motion";

type FileUploadModalProps = {
  setOpenFileUploadModal: Dispatch<SetStateAction<boolean>>;
};

function FileUploadModal({ setOpenFileUploadModal }: FileUploadModalProps) {
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
          <input
            type="file"
            className="w-full rounded-lg bg-storm border border-graphite text-skyfog
            file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0
            file:bg-skyflare file:text-midnight file:font-medium
            hover:file:opacity-90 cursor-pointer focus:outline-none"
          />
        </label>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setOpenFileUploadModal(false)}
            className="px-4 py-2 rounded-lg border border-graphite text-steel hover:bg-graphite transition"
          >
            Cancel
          </button>
          <button className="px-4 py-2 rounded-lg bg-skyflare text-midnight font-medium hover:opacity-90 transition">
            Upload
          </button>
        </div>
      </motion.div>
    </>
  );
}

export default FileUploadModal;
