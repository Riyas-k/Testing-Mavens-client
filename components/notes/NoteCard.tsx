import React from 'react';
import { useRouter } from 'next/navigation';
import { FiEdit2, FiTrash2, FiUsers } from 'react-icons/fi';
import { Note } from '../../types/notes';
import { formatDate, truncateText } from '../../lib/utils';
import { useNotes } from '@/hooks/useNotes';

interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => void;
}

export default function NoteCard({ note, onDelete }: NoteCardProps) {
  const router = useRouter();

  const handleEdit = (id:string) => {
    router.push(`/notes/${id}`);
  };
  const {deleteNote} = useNotes()

  const handleDelete = (e: React.MouseEvent,id:string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this note?')) {
      console.log(note._id);
      
      deleteNote(note._id);
      router.push('/notes')
    }
  };

  return (
    <div key={note?._id}
      className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={()=>handleEdit(note?._id)}
    >
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-medium text-gray-900 mb-1">{note.title}</h3>
        <div className="flex space-x-2">
          {note.isShared && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
              <FiUsers className="mr-1" /> Shared
            </span>
          )}
        </div>
      </div>
      <p className="text-gray-600 text-sm mb-3">
        {truncateText(note.content, 100)}
      </p>
      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>Last edited {formatDate(note.lastEdited)}</span>
        <div className="flex space-x-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(note._id);
            }}
            className="text-gray-400 hover:text-blue-500"
          >
            <FiEdit2 className="h-4 w-4" />
          </button>
          <button 
            onClick={(e)=>handleDelete(e,note._id)}
            className="text-gray-400 hover:text-red-500"
          >
            <FiTrash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
