'use client';

import { useEffect, useState } from 'react';
import { useNotes } from '../../hooks/useNotes';
import NoteList from '../../components/notes/NoteList';
import ProtectedRoute from '../../components/auth/ProtectedRoute';

export default function NotesPage() {
  const { notes, deleteNote, fetchNotes } = useNotes();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadNotes = async () => {
      await fetchNotes();
      setIsLoading(false);
    };

    loadNotes();
  }, []);

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <NoteList
          notes={notes}
          onDelete={deleteNote}
          isLoading={isLoading}
        />
      </div>
    </ProtectedRoute>
  );
}
