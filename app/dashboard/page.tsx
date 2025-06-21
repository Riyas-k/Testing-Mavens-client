'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiPlus, FiFileText, FiUsers, FiClock } from 'react-icons/fi';
import { useNotes } from '../../hooks/useNotes';
import { useAuthStore } from '../../store/authStore';
import NoteCard from '../../components/notes/NoteCard';
import Button from '../../components/ui/Button';
import ProtectedRoute from '../../components/auth/ProtectedRoute';

export default function Dashboard() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { notes, deleteNote, fetchNotes } = useNotes();
  const [isLoading, setIsLoading] = useState(true);

  // Stats
  const totalNotes = notes.length;
  const sharedNotes = notes.filter(note => note.isShared).length;
  const recentlyEdited = notes.slice().sort((a, b) => 
    new Date(b.lastEdited).getTime() - new Date(a.lastEdited).getTime()
  ).slice(0, 3);

  useEffect(() => {
    const loadData = async () => {
      await fetchNotes();
      setIsLoading(false);
    };

    loadData();
  }, []);

  const handleCreateNew = () => {
    router.push('/notes/new');
  };

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.name || 'User'}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Here's an overview of your notes and recent activity
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <FiFileText className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Notes</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{totalNotes}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <FiUsers className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Shared Notes</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">{sharedNotes}</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                  <FiClock className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Last Activity</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        {notes.length > 0 
                          ? new Date(notes[0].lastEdited).toLocaleDateString() 
                          : 'No activity'}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recently edited */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Recently edited</h2>
            <Button
              onClick={handleCreateNew}
              variant="primary"
              size="sm"
            >
              <FiPlus className="mr-2" /> New Note
            </Button>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : recentlyEdited?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentlyEdited?.map((note) => (
                
                  <NoteCard key={note?._id} note={note} onDelete={()=>deleteNote(note._id)} />
            
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-500">No notes yet. Create your first note to get started!</p>
              <Button
                onClick={handleCreateNew}
                variant="primary"
                className="mt-4"
              >
                <FiPlus className="mr-2" /> Create Note
              </Button>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
