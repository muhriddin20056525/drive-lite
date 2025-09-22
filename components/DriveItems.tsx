import { DriveItemsType } from "@/types";
import DriveItemIcon from "./DriveItemIcon";
import { formatFileSize } from "@/utils/formatSize";
import { Edit, Star, Trash2 } from "lucide-react";

type DriveItemsProps = {
  item: DriveItemsType;
};

function DriveItems({ item }: DriveItemsProps) {
  // Check Data Type (File OR Folder)
  const isFile = "url" in item;

  return (
    <div className="w-full p-3 bg-gradient-dark flex items-center gap-5 rounded-xs relative group">
      {/* Icon */}
      {isFile ? (
        <DriveItemIcon type={item.type.split("/")[0]} />
      ) : (
        <DriveItemIcon type="folder" />
      )}

      {/* Body */}
      <div>
        <h2 className="text-xl text-skyfog font-semibold">{item.name}</h2>
        <p className="text-steel font-medium">
          {new Date(item.createdAt).toLocaleDateString()}
          {isFile ? <span> - {formatFileSize(item.size)}</span> : null}
        </p>
      </div>

      {/* Actions */}
      <div className="hidden group-hover:flex items-center gap-1 absolute top-2 right-2">
        <button className="bg-steel/60 w-6 h-6 flex items-center justify-center rounded-xs cursor-pointer">
          <Edit width={15} height={15} className="text-skyfog" />
        </button>
        <button className="bg-steel/60 w-6 h-6 flex items-center justify-center rounded-xs cursor-pointer">
          <Star
            width={15}
            height={15}
            className={
              item.isStarred
                ? "fill-amber-400 stroke-amber-400"
                : "stroke-skyfog"
            }
          />
        </button>
        <button className="bg-steel/60 w-6 h-6 flex items-center justify-center rounded-xs cursor-pointer">
          <Trash2 width={15} height={15} className="text-skyfog" />
        </button>
      </div>

      {/* File Extname */}
      {isFile && (
        <div className="text-xs absolute bottom-2 right-2 bg-steel/60 text-skyfog uppercase py-1 px-2 rounded-4xl">
          {item.type.split("/")[1]}
        </div>
      )}
    </div>
  );
}

export default DriveItems;
