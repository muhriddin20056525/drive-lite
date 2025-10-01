"use client";

import { DriveItemsType } from "@/types";
import DriveItemIcon from "./DriveItemIcon";
import { formatFileSize } from "@/utils/formatSize";
import { ArchiveRestore, Edit, Star, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDriveStore } from "@/store/useDriveStore";
import toast from "react-hot-toast";
import Link from "next/link";

type DriveItemsProps = {
  item: DriveItemsType;
  status?: "drive" | "starred" | "trashed" | "recent";
};

function DriveItems({ item, status }: DriveItemsProps) {
  // Get Edit Input Value
  const [name, setName] = useState<string>(item.name);

  // Get Edit And Delete Function From useDriveStore
  const { deleteData, updateData, markAsAccessed } = useDriveStore();

  // Check Edit State
  const [isEdit, setIsEdit] = useState<boolean>(false);

  // For Hide Edit Input
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Check Data Type (File OR Folder)
  const isFile = "url" in item;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsEdit(false); // Click On Out
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // File And Folder Name Update
  const handleNameUpdate = (
    id: string,
    type: "file" | "folder",
    name: string
  ) => {
    // Check Name
    if (!name.trim()) {
      toast.error("Name Is Required");
      return;
    }

    // Call updateData fuction from zustand
    updateData(id, type, { name });

    markAsAccessed(id, type);

    // Hide edit input
    setIsEdit(false);
  };

  // Starred File And Folder
  const handleStarred = (
    id: string,
    type: "file" | "folder",
    isStarred: boolean
  ) => {
    updateData(id, type, { isStarred: !isStarred });
    markAsAccessed(id, type);
  };

  // Trashed File And Folder
  const handleTrashed = (
    id: string,
    type: "file" | "folder",
    isTrashed: boolean
  ) => {
    updateData(id, type, { isTrashed, isStarred: false });
    markAsAccessed(id, type);
  };

  return (
    <div
      ref={wrapperRef}
      className="w-full p-3 bg-gradient-dark flex items-center gap-5 rounded-xs relative group"
    >
      {/* Icon */}
      {isFile ? (
        <DriveItemIcon type={item.type.split("/")[0]} />
      ) : (
        <DriveItemIcon type="folder" />
      )}

      {/* Body */}
      <div>
        {!isEdit ? (
          !isFile ? (
            status !== "trashed" ? (
              <Link
                href={`/folder/${item.id}`}
                className="text-xl text-skyfog font-semibold"
              >
                {item.name}
              </Link>
            ) : (
              <h2 className="text-xl text-skyfog font-semibold">{item.name}</h2>
            )
          ) : (
            <h2 className="text-xl text-skyfog font-semibold">{item.name}</h2>
          )
        ) : (
          <div className="flex items-center gap-2">
            <input
              type="text"
              className="w-full h-7 rounded-xs border border-graphite outline-none px-1 block text-skyfog"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button
              onClick={() =>
                handleNameUpdate(item.id, isFile ? "file" : "folder", name)
              }
            >
              <Edit className="stroke-steel" />
            </button>
          </div>
        )}

        <p className="text-steel font-medium">
          {new Date(item.createdAt).toLocaleDateString()}
          {isFile ? <span> - {formatFileSize(item.size)}</span> : null}
        </p>
      </div>

      {/* Actions */}
      <div className="hidden group-hover:flex items-center gap-1 absolute top-2 right-2">
        {status === "trashed" ? (
          <button
            onClick={() =>
              handleTrashed(item.id, isFile ? "file" : "folder", false)
            }
            className="bg-steel/60 w-6 h-6 flex items-center justify-center rounded-xs cursor-pointer"
          >
            <ArchiveRestore width={15} height={15} className="text-skyfog" />
          </button>
        ) : status === "recent" ? null : (
          <>
            <button
              onClick={() => setIsEdit(true)}
              className="bg-steel/60 w-6 h-6 flex items-center justify-center rounded-xs cursor-pointer"
            >
              <Edit width={15} height={15} className="text-skyfog" />
            </button>
            <button
              onClick={() =>
                handleStarred(
                  item.id,
                  isFile ? "file" : "folder",
                  item.isStarred
                )
              }
              className="bg-steel/60 w-6 h-6 flex items-center justify-center rounded-xs cursor-pointer"
            >
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
          </>
        )}

        {status !== "recent" && (
          <button
            onClick={() =>
              status === "trashed"
                ? deleteData(item.id, isFile ? "file" : "folder")
                : handleTrashed(item.id, isFile ? "file" : "folder", true)
            }
            className="bg-steel/60 w-6 h-6 flex items-center justify-center rounded-xs cursor-pointer"
          >
            <Trash2 width={15} height={15} className="text-skyfog" />
          </button>
        )}
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
