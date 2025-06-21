'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useNoteStore } from '../../../store/noteStore';
import { useNotes } from '../../../hooks/useNotes';
import NoteEditor from '../../../components/notes/NoteEditor';
import ProtectedRoute from '../../../components/auth/ProtectedRoute';

export default function NotePage() {
  const params = useParams();
  const noteId = params.id as string;
  const { setCurrentNote } = useNoteStore();
  const { fetchNoteById } = useNotes();

  useEffect(() => {
    const loadNote = async () => {
      if (noteId && noteId !== 'new') {
        const note = await fetchNoteById(noteId);
        if (note) {
          setCurrentNote(note);
        }
      } else {
        setCurrentNote(null);
      }
    };

    loadNote();

    return () => {
      setCurrentNote(null);
    };
  }, [noteId, setCurrentNote]);

  return (
    <ProtectedRoute>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <NoteEditor noteId={noteId} />
      </div>
    </ProtectedRoute>
  );
}
