import { modalVariants } from "@/constants/variants";
import axios from "axios";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import toast from "react-hot-toast";

type CreateFolderModalProps = {
  setOpenFolderModal: Dispatch<SetStateAction<boolean>>;
};

function CreateFolderModal({ setOpenFolderModal }: CreateFolderModalProps) {
  // State For Get Input Value
  const [name, setName] = useState<string>("");
  // State For Create Folder Loading
  const [loading, setLoading] = useState<boolean>(false);

  // Create Folder Function
  const handleCreateFolder = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post("/api/folder", { name });
      toast.success(data.message || "Folder Created Successfully");
    } catch (error: any) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Unexpected error occurred!");
      }
    } finally {
      setLoading(false);
      setName("");
      setOpenFolderModal(false);
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
        onClick={() => setOpenFolderModal(false)}
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
        <h2 className="text-skyfog text-xl font-semibold mb-4">
          Create Folder
        </h2>

        {/* Input */}
        <input
          type="text"
          placeholder="Enter folder name..."
          className="w-full rounded-lg px-3 py-2 bg-storm border border-graphite text-skyfog
          placeholder-steel focus:outline-none focus:ring-2 focus:ring-skyflare mb-6"
          onChange={(e) => setName(e.target.value)}
          value={name}
        />

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setOpenFolderModal(false)}
            className="px-4 py-2 rounded-lg border border-graphite text-steel hover:bg-graphite transition"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateFolder}
            className="px-4 py-2 rounded-lg bg-skyflare text-midnight font-medium hover:opacity-90 transition flex items-center gap-2"
          >
            Create {loading && <Loader2 className="animate-spin" />}
          </button>
        </div>
      </motion.div>
    </>
  );
}

export default CreateFolderModal;
