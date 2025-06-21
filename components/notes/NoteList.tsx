import React, { useEffect } from 'react';
import NoteCard from './NoteCard';
import { Note } from '../../types/notes';
import { FiPlus } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

interface NoteListProps {
  notes: Note[];
  onDelete: (id: string) => void;
  isLoading: boolean;
}

export default function NoteList({ notes, onDelete, isLoading }: NoteListProps) {
  const router = useRouter();
  
  const handleCreateNew = () => {
    router.push('/notes/new');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">My Notes</h2>
        <button
          onClick={handleCreateNew}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FiPlus className="mr-2" /> New Note
        </button>
      </div>

      {notes.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No notes yet</h3>
          <p className="text-gray-600 mb-4">Create your first note to get started</p>
          <button
            onClick={handleCreateNew}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiPlus className="mr-2" /> Create Note
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes?.map((note) => (
            <NoteCard key={note._id} note={note} onDelete={()=>onDelete(note._id)} />
          ))}
        </div>
      )}
    </div>
  );
}
