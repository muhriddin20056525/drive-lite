export interface IFolder {
  id: string;
  name: string;
  ownerId: string;
  isStarred: boolean;
  isTrashed: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastAccessedAt: Date;
}

export interface IFile {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  ownerId: string;
  folderId?: string;
  createdAt: Date;
  updatedAt: Date;
  lastAccessedAt: Date;
  isStarred: boolean;
  isTrashed: boolean;
}

export type DriveItemsType = IFolder | IFile;
