"use client";

import { useState } from "react";
import Modal from "./Modal";
import { useDriveStore } from "@/store/useDriveStore";
import toast from "react-hot-toast";

type CreateFolderModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

function CreateFolderModal({ isOpen, onClose }: CreateFolderModalProps) {
  // Calling Create Folder Function From Store
  const { createFolder } = useDriveStore();

  // Get Folder Name
  const [name, setName] = useState<string>("");

  // Create Folder
  const handleCreateFolder = async () => {
    // Check Folder Name
    if (!name.trim()) {
      toast.error("Name Is Required");
      return;
    }

    // Using Store Create Folder Function
    await createFolder(name);

    // Clear Name And Hide Modal
    setName("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Folder">
      {/* Folder Name Input */}
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter folder name"
        className="w-full px-2 py-1 border border-graphite rounded-md bg-abyss text-skyfog outline-none"
      />

      {/* Create Folder Button */}
      <button
        onClick={handleCreateFolder}
        className="mt-3 w-full py-2 bg-skyflare text-white rounded-md hover:bg-blue-400"
      >
        Create
      </button>
    </Modal>
  );
}

export default CreateFolderModal;
