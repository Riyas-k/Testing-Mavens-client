import React from 'react';
import { FiPlus, FiX } from 'react-icons/fi';
import Button from '../ui/Button';

interface CollaborationPanelProps {
  collaborators: string[];
  newCollaborator: string;
  setNewCollaborator: (value: string) => void;
  onAddCollaborator: () => void;
  onRemoveCollaborator: (email: string) => void;
  onSave: () => void;
}

export default function CollaborationPanel({
  collaborators,
  newCollaborator,
  setNewCollaborator,
  onAddCollaborator,
  onRemoveCollaborator,
  onSave,
}: CollaborationPanelProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCollaborator();
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        Share this note with others by adding their email addresses below.
      </p>

      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <input
          type="email"
          value={newCollaborator}
          onChange={(e) => setNewCollaborator(e.target.value)}
          placeholder="Add collaborator by email"
          className="flex-grow px-3 py-2 text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        <Button type="submit" variant="success" size="sm">
          <FiPlus />
        </Button>
      </form>

      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Collaborators:</h4>
        {collaborators.length === 0 ? (
          <p className="text-sm text-gray-500">No collaborators yet</p>
        ) : (
          <div className="space-y-2">
            {collaborators?.map((email) => (
              <div key={email} className="flex items-center text-black justify-between px-3 py-2 bg-gray-50 rounded-md">
                <span className="text-sm">{email}</span>
                <button
                  onClick={() => onRemoveCollaborator(email)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <FiX />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-gray-200 flex justify-end">
        <Button onClick={onSave} variant="primary">
          Save Changes
        </Button>
      </div>
    </div>
  );
}
