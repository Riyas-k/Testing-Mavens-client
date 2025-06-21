import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MarkdownIt from 'markdown-it';
import { FiSave, FiEye, FiEdit, FiShare2 } from 'react-icons/fi';
import { useNoteStore } from '../../store/noteStore';
import { useAuthStore } from '../../store/authStore';
import { useWebSocket } from '../../hooks/useWebSocket';
import { useNotes } from '../../hooks/useNotes';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import CollaborationPanel from './CollaborationPanel';

const md = new MarkdownIt();

interface NoteEditorProps {
  noteId?: string;
}

export default function NoteEditor({ noteId }: NoteEditorProps) {
  const router = useRouter();
  const { user } = useAuthStore();
  const { socket } = useWebSocket();
  const { currentNote, setCurrentNote, isLoading } = useNoteStore();
  const { createNote, updateNote, fetchNoteById, shareNote } = useNotes();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [preview, setPreview] = useState('');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [collaborators, setCollaborators] = useState<string[]>([]);
  const [newCollaborator, setNewCollaborator] = useState('');
  const [isEditingCollaboratively, setIsEditingCollaboratively] = useState(false);
  const [activeUsers, setActiveUsers] = useState<string[]>([]);

  // Load note data when noteId changes
  useEffect(() => {
    const loadNote = async () => {
      if (noteId && noteId !== 'new') {
        const note = await fetchNoteById(noteId);
        if (note) {
          setCurrentNote(note);
        } else {
          router.push('/notes');
        }
      } else {
        setCurrentNote(null);
        setTitle('');
        setContent('');
        setCollaborators([]);
      }
    };
    
    loadNote();
  // }, [noteId, fetchNoteById, setCurrentNote, router]);
  }, []);

  // Update form when current note changes
  useEffect(() => {
    if (currentNote) {
      setTitle(currentNote.title);
      setContent(currentNote.content);
      setCollaborators(currentNote.collaborators || []);
      updatePreview(currentNote.content);
    }
  // }, [currentNote]);
  },[currentNote]);

  // Update preview when content changes
  const updatePreview = (text: string) => {
    setPreview(md.render(text));
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    updatePreview(newContent);
    
    // Send real-time updates if editing an existing note
    if (currentNote?._id && socket) {
      socket.emit('note:editing', {
        noteId: currentNote._id,
        content: newContent,
        user: user?.id,
      });
    }
  };

  const handleSave = async () => {
  if (!user) return;

  setIsSaving(true);

  try {
    if (currentNote?._id) {
      await updateNote(currentNote._id, {
        ...currentNote,
        title,
        content
      });
      router.push(`/notes`);
    } else {
      const newNote = await createNote({
        ...currentNote,
        title,
        content,
        collaborators,
        isShared: collaborators.length > 0
      });
      if (newNote) {
        router.push(`/notes`);
      }
    }
  } finally {
    setIsSaving(false);
  }
};


  const handleShareNote = async () => {
    if (!currentNote?._id) return;
    
    await shareNote(currentNote._id, collaborators);
    setIsShareModalOpen(false);
  };

  const handleAddCollaborator = () => {
    if (newCollaborator && !collaborators.includes(newCollaborator)) {
      setCollaborators([...collaborators, newCollaborator]);
      setNewCollaborator('');
    }
  };

  const handleRemoveCollaborator = (email: string) => {
    setCollaborators(collaborators.filter((c) => c !== email));
  };

  // Handle real-time collaboration
  useEffect(() => {
    if (!socket || !noteId || noteId === 'new') return;

    socket.emit('join:note', { noteId });

    socket.on('note:editing', (data: { user: string, content: string }) => {
      if (data.user !== user?.id) {
        setContent(data.content);
        updatePreview(data.content);
        setIsEditingCollaboratively(true);
        setTimeout(() => setIsEditingCollaboratively(false), 3000);
      }
    });

    socket.on('note:users', (users: string[]) => {
      setActiveUsers(users.filter(id => id !== user?.id));
    });

    return () => {
      socket.emit('leave:note', { noteId });
      socket.off('note:editing');
      socket.off('note:users');
    };
  }, [socket, noteId, user?.id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          value={ title || currentNote?.title }
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title"
          className="text-2xl text-black font-bold border-none focus:outline-none focus:ring-0 w-full"
        />
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
          >
            {isPreviewMode ? (
              <>
                <FiEdit className="mr-1" /> Edit
              </>
            ) : (
              <>
                <FiEye className="mr-1" /> Preview
              </>
            )}
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
          >
            <FiSave className="mr-1" /> {isSaving ? 'Saving...' : 'Save'}
          </Button>
          {currentNote?._id && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsShareModalOpen(true)}
            >
              <FiShare2 className="mr-1" /> Share
            </Button>
          )}
        </div>
      </div>

      {isEditingCollaboratively && (
        <div className="mb-4 p-2 bg-blue-50 text-blue-700 text-sm rounded-md">
          Someone is editing this note right now...
        </div>
      )}

      {activeUsers.length > 0 && (
        <div className="mb-4 flex items-center">
          <span className="text-sm text-gray-500 mr-2">Active users:</span>
          <div className="flex -space-x-2">
            {activeUsers.map((userId, index) => (
              <div
                key={userId}
                className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs border-2 border-white"
                title={`User ${userId}`}
              >
                {index + 1}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="border rounded-md overflow-hidden">
        {isPreviewMode ? (
          <div 
            className="p-4 min-h-[300px] prose max-w-none text-black"
            dangerouslySetInnerHTML={{ __html: preview }}
          />
        ) : (
          <textarea
            value={ content ||  currentNote?.content }
            onChange={handleContentChange}
            placeholder="Write your note here (Markdown supported)"
            className="w-full text-black min-h-[300px] p-4 border-0 focus:ring-0 font-mono text-sm"
          />
        )}
      </div>

      <Modal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        title="Share Note"
      >
        <CollaborationPanel
          collaborators={collaborators}
          newCollaborator={newCollaborator}
          setNewCollaborator={setNewCollaborator}
          onAddCollaborator={handleAddCollaborator}
          onRemoveCollaborator={handleRemoveCollaborator}
          onSave={handleShareNote}
        />
      </Modal>
    </div>
  );
}
