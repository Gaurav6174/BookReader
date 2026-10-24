import { useState } from 'react';
import NoteCard from './NoteCard.jsx';
import NoteForm from './NoteForm.jsx';
import EmptyState from '../EmptyState.jsx';

/**
 * NoteList — list of notes with "Write a note" button.
 */
export default function NoteList({ notes, onCreate, onUpdate, onDelete, creating, setCreating, hideTrigger = false }) {
  return (
    <div>
      {/* Add note trigger */}
      {!creating && !hideTrigger && (
        <button
          onClick={() => setCreating(true)}
          className="sketch-btn sketch-btn-primary mb-5"
          aria-label="Write a new note"
        >
          📝 Write a Note
        </button>
      )}

      {/* Inline create form */}
      {creating && (
        <NoteForm
          onSubmit={async (data) => {
            const ok = await onCreate(data);
            if (ok) setCreating(false);
            return ok;
          }}
          onCancel={() => setCreating(false)}
        />
      )}

      {/* Notes */}
      {notes.length === 0 && !creating ? (
        <EmptyState
          icon="🗒️"
          title="No notes yet"
          message="Write down an important sentence or thought from the book."
          action={
            <button onClick={() => setCreating(true)} className="sketch-btn sketch-btn-primary">
              📝 Write First Note
            </button>
          }
        />
      ) : (
        <div className="flex flex-col gap-4">
          {notes.map((note) => (
            <NoteCard key={note._id} note={note} onUpdate={onUpdate} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
