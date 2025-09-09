export interface IFolder {
  id: string;
  name: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFile {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
