import { IFolder } from "@/types";
import { Folder, Star, Trash, Trash2 } from "lucide-react";

type FolderCardProps = {
  folder: IFolder;
};

function FolderCard({ folder }: FolderCardProps) {
  return (
    <div className="w-[350px] grow flex items-center gap-5 bg-gradient-dark py-5 px-5 rounded-[5px] relative group">
      <div className="w-10 h-10 bg-gradient-to-tr from-[#1f2937] to-[#10b981] rounded-[5px] flex items-center justify-center">
        <Folder color="white" width={30} height={30} />
      </div>

      <div>
        <h3 className="text-skyfog mb-1 cursor-pointer">{folder.name}</h3>
        <p className="text-steel">
          {new Date(folder.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="absolute top-3 right-3 hidden group-hover:flex items-center gap-2">
        <button className="w-6 h-6 bg-[rgba(255,255,255,0.08)] rounded-full flex justify-center items-center border border-graphite text-steel cursor-pointer">
          <Star width={14} height={14} />
        </button>

        <button className="w-6 h-6 bg-[rgba(255,255,255,0.08)] rounded-full flex justify-center items-center border border-graphite text-steel cursor-pointer">
          <Trash2 width={14} height={14} />
        </button>
      </div>
    </div>
  );
}

export default FolderCard;
