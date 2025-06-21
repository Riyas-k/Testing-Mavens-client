import { useEffect } from 'react';
import { useNoteStore } from '../store/noteStore';
import { useAuthStore } from '../store/authStore';
import { api } from '../lib/api';
import { useWebSocket } from './useWebSocket';
import { Note, NoteFormData } from '../types/notes';

export function useNotes() {
  const { 
    notes, 
    setNotes, 
    addNote, 
    updateNote, 
    deleteNote: removeNote, 
    setLoading, 
    setError 
  } = useNoteStore();
  const { token } = useAuthStore();
  const { socket } = useWebSocket();
  
  const fetchNotes = async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const response = await api.get('/api/notes');
      setNotes(response.data);
    } catch (error) {
      setError('Failed to fetch notes');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNoteById = async (id: string) => {
    console.log(id,'idddiiid');
    
    if (!token) return null;
    
    setLoading(true);
    try {
      const response = await api.get(`/api/notes/${id}`);
      return response.data;
    } catch (error) {
      setError('Failed to fetch note');
      console.error(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createNote = async (noteData: NoteFormData) => {
    if (!token) return null;
    
    setLoading(true);
    try {
      const response = await api.post('/api/notes', noteData);
      const newNote = response.data;
      addNote(newNote);
      return newNote;
    } catch (error) {
      setError('Failed to create note');
      console.error(error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateNoteById = async (id: string, noteData: Partial<NoteFormData>) => {
    if (!token) return;
    
    // Optimistic update
    updateNote(id, { 
      ...noteData, 
      lastEdited: new Date().toISOString() 
    } as Partial<Note>);
    
    try {
      await api.put(`/api/notes/${id}`, noteData);
    } catch (error) {
      setError('Failed to update note');
      console.error(error);
      // Revert optimistic update by re-fetching
      fetchNotes();
    }
  };

  const deleteNote = async (id: string) => {
    console.log(id,'id is here')
    if (!token) return;
    
    // Optimistic delete
    removeNote(id);
    
    try {
      await api.delete(`/api/notes/${id}`);
    } catch (error) {
      setError('Failed to delete note');
      console.error(error);
      // Revert optimistic delete by re-fetching
      fetchNotes();
    }
  };

  const shareNote = async (id: string, collaboratorEmails: string[]) => {
    if (!token) return;
    
    try {
      const response = await api.post(`/api/notes/${id}/share`, { collaborators: collaboratorEmails });
      updateNote(id, { 
        collaborators: response.data.collaborators, 
        isShared: true 
      } as Partial<Note>);
      return response.data;
    } catch (error) {
      setError('Failed to share note');
      console.error(error);
      return null;
    }
  };

  // Handle real-time updates
  useEffect(() => {
    if (!socket) return;

    socket.on('note:created', (note: Note) => {
      addNote(note);
    });

    socket.on('note:updated', (updatedNote: Note) => {
      updateNote(updatedNote._id, updatedNote);
    });

    socket.on('note:deleted', (id: string) => {
      removeNote(id);
    });

    return () => {
      socket.off('note:created');
      socket.off('note:updated');
      socket.off('note:deleted');
    };
  }, [socket, addNote, updateNote, removeNote]);

  // Initial fetch
  useEffect(() => {
    if (token) {
      fetchNotes();
    }
  }, [token]);

  return {
    notes,
    fetchNoteById,
    createNote,
    updateNote: updateNoteById,
    deleteNote,
    shareNote,
    fetchNotes,
  };
}
