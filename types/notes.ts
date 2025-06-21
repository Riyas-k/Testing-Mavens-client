export interface Note {
    _id: string;
    title: string;
    content: string;
    owner: string;
    collaborators: string[];
    isShared: boolean;
    lastEdited: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface NoteFormData {
    title: string;
    content: string;
    collaborators?: string[];
    isShared:any;
  }
  