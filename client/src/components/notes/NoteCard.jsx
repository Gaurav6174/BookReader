import { useState } from 'react';
import ConfirmDialog from '../ConfirmDialog.jsx';
import NoteForm from './NoteForm.jsx';

/**
 * NoteCard — displays a single note with edit and delete.
 */
export default function NoteCard({ note, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleUpdate(data) {
    setSaving(true);
    const ok = await onUpdate(note._id, data);
    setSaving(false);
    if (ok) setEditing(false);
    return ok;
  }

  const dateStr = new Date(note.createdAt).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
  });

  if (editing) {
    return (
      <NoteForm
        editNote={note}
        onSubmit={handleUpdate}
        onCancel={() => setEditing(false)}
        loading={saving}
      />
    );
  }

  return (
    <>
      <div className="note-card animate-fade-in" role="article" aria-label="Note">
        {/* Header: date + page */}
        <div className="flex items-center justify-between mb-2 flex-wrap gap-1">
          <span className="text-xs muted">{dateStr}</span>
          {note.pageNumber && (
            <span className="sketch-badge" style={{ background: '#bfdbfe' }}>
              p. {note.pageNumber}
            </span>
          )}
        </div>

        {/* Content — preserve line breaks */}
        <p
          className="text-sm leading-relaxed whitespace-pre-wrap mb-3"
          style={{ fontFamily: "'Patrick Hand', cursive" }}
        >
          {note.content}
        </p>

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t border-dashed border-gray-200">
          <button
            onClick={() => setEditing(true)}
            className="sketch-btn sketch-btn-secondary sketch-btn-sm"
            aria-label="Edit note"
          >
            ✏️ Edit
          </button>
          <button
            onClick={() => setConfirmOpen(true)}
            className="sketch-btn sketch-btn-danger sketch-btn-sm"
            aria-label="Delete note"
          >
            🗑️ Delete
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete Note?"
        message="This note will be permanently deleted."
        confirmLabel="Delete"
        onConfirm={() => { setConfirmOpen(false); onDelete(note._id); }}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
