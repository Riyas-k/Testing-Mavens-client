import { create } from 'zustand';
import { Note } from '../types/notes';

interface NoteState {
  notes: Note[];
  currentNote: Note | null;
  isLoading: boolean;
  error: string | null;
  setNotes: (notes: Note[]) => void;
  addNote: (note: Note) => void;
  updateNote: (id: string, note: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  setCurrentNote: (note: Note | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useNoteStore = create<NoteState>((set) => ({
  notes: [],
  currentNote: null,
  isLoading: false,
  error: null,
  setNotes: (notes) => set({ notes }),
  addNote: (note) => set((state) => ({ notes: [...state.notes, note] })),
  updateNote: (id, updatedNote) =>
    set((state) => ({
      notes: state.notes.map((note) =>
        note.id === id ? { ...note, ...updatedNote } : note
      ),
      currentNote: state.currentNote?.id === id 
        ? { ...state.currentNote, ...updatedNote } 
        : state.currentNote
    })),
  deleteNote: (id) =>
    set((state) => ({
      notes: state.notes.filter((note) => note.id !== id),
      currentNote: state.currentNote?.id === id ? null : state.currentNote
    })),
  setCurrentNote: (note) => set({ currentNote: note }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
