import { useFolders } from "@/hooks/useFolders";
import { IFolder } from "@/types";
import { Edit, Folder, Star, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

type FolderCardProps = {
  folder: IFolder;
};

function FolderCard({ folder }: FolderCardProps) {
  // State For Toggle Edit Folder Input
  const [showEditInput, setShowEditInput] = useState<boolean>(false);

  // State For Get Folder Name
  const [name, setName] = useState<string>("");

  // Get Update And Delete Fodler Function From Context
  const { updateFolder, deleteFolder } = useFolders();

  const router = useRouter();

  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Single Click Handler
  const handleClick = () => {
    // Clear Click Timer Ref
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
      clickTimerRef.current = null;
    }

    // Set New Timer
    clickTimerRef.current = setTimeout(() => {
      router.push(`/folder/${folder.id}`);
    }, 200);
  };

  // Double Click Handler
  const handleDoubleClick = () => {
    // Stop Working Timer
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
      clickTimerRef.current = null;
    }

    // Show Input
    setShowEditInput(true);
  };

  return (
    <div className="w-full grow flex items-center gap-5 bg-gradient-dark py-5 px-5 rounded-[5px] relative group">
      {/* Card Icon */}
      <div className="w-10 h-10 bg-gradient-to-tr from-[#1f2937] to-[#10b981] rounded-[5px] flex items-center justify-center">
        <Folder color="white" width={30} height={30} />
      </div>

      {/* Card Info */}
      <div>
        {!showEditInput ? (
          <h3
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            className="text-skyfog mb-1 cursor-pointer"
          >
            {folder.name}
          </h3>
        ) : (
          <div className="flex items-center gap-2">
            <input
              type="text"
              autoFocus
              onBlur={() => setShowEditInput(false)}
              placeholder="Enter folder name..."
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="w-[70%] rounded-md px-2 py-1 text-sm
                 bg-storm border border-graphite text-skyfog
                 placeholder-steel focus:outline-none focus:ring-1 focus:ring-skyflare"
            />

            <button
              onMouseDown={() => {
                updateFolder(folder.id, name);
                setShowEditInput(false);
              }}
              className="p-1.5 rounded-md bg-graphite hover:bg-storm transition"
            >
              <Edit className="h-5 w-5 text-skyfog" />
            </button>
          </div>
        )}
        <p className="text-steel">
          {new Date(folder.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Card Actions */}
      <div className="absolute top-3 right-3 hidden group-hover:flex items-center gap-2">
        <button className="w-6 h-6 bg-[rgba(255,255,255,0.08)] rounded-full flex justify-center items-center border border-graphite text-steel cursor-pointer">
          <Star width={14} height={14} />
        </button>

        <button
          className="w-6 h-6 bg-[rgba(255,255,255,0.08)] rounded-full flex justify-center items-center border border-graphite text-steel cursor-pointer"
          onClick={() => deleteFolder(folder.id)}
        >
          <Trash2 width={14} height={14} />
        </button>
      </div>
    </div>
  );
}

export default FolderCard;
