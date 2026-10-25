import { useState } from 'react';
import ConfirmDialog from '../ConfirmDialog.jsx';
import NoteForm from './NoteForm.jsx';

/**
 * NoteCard — clean, distraction-free note entry without boxy borders or shadows.
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
      <div className="py-3 border-b border-white/10 animate-fade-in">
        <NoteForm
          editNote={note}
          onSubmit={handleUpdate}
          onCancel={() => setEditing(false)}
          loading={saving}
        />
      </div>
    );
  }

  return (
    <>
      <div className="group py-2.5 px-3 -mx-3 rounded-lg border-b border-white/[0.08] hover:bg-white/[0.06] hover:border-white/20 transition-all duration-200 animate-fade-in" role="article" aria-label="Note">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Note Text */}
            <p
              className="text-base leading-relaxed whitespace-pre-wrap text-white/90 group-hover:text-white transition-colors"
              style={{ fontFamily: "'Patrick Hand', cursive" }}
            >
              {note.content}
            </p>

            {/* Subtle metadata: page & date */}
            <div className="flex items-center gap-2 mt-2 text-xs text-white/40" style={{ fontFamily: "'Patrick Hand', cursive" }}>
              {note.pageNumber && (
                <span>page {note.pageNumber}</span>
              )}
              {note.pageNumber && <span>•</span>}
              <span>{dateStr}</span>
            </div>
          </div>

          {/* Discreet hover actions so reader is not distracted */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity shrink-0">
            <button
              onClick={() => setEditing(true)}
              className="p-1.5 text-white/40 hover:text-white rounded-md hover:bg-white/15 hover:scale-110 active:scale-95 transition-all text-xs"
              aria-label="Edit note"
              title="Edit note"
            >
              ✏️
            </button>
            <button
              onClick={() => setConfirmOpen(true)}
              className="p-1.5 text-white/40 hover:text-red-400 rounded-md hover:bg-red-500/20 hover:scale-110 active:scale-95 transition-all text-xs"
              aria-label="Delete note"
              title="Delete note"
            >
              🗑️
            </button>
          </div>
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
