'use client';

import NoteEditor from '../../../components/notes/NoteEditor';
import ProtectedRoute from '../../../components/auth/ProtectedRoute';

export default function NewNotePage() {
  return (
    <ProtectedRoute>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <NoteEditor />
      </div>
    </ProtectedRoute>
  );
}
