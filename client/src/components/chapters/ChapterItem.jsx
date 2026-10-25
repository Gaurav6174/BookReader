import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from '../ConfirmDialog.jsx';
import ChapterForm from './ChapterForm.jsx';

/**
 * ChapterItem — one chapter in the list on BookPage.
 */
export default function ChapterItem({ chapter, onEdit, onDelete }) {
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <ChapterForm
        editChapter={chapter}
        onSubmit={(data) => { onEdit(chapter._id, data); setEditing(false); }}
        onCancel={() => setEditing(false)}
      />
    );
  }

  return (
    <>
      <div
        className="flex items-center gap-3 p-4 sketch-card cursor-pointer hover:bg-white/[0.09] transition-all"
        style={{ borderLeft: '3px solid rgba(255,255,255,0.35)' }}
        onClick={() => navigate(`/chapters/${chapter._id}`)}
        tabIndex={0}
        role="button"
        aria-label={`Open chapter: ${chapter.title}`}
        onKeyDown={(e) => e.key === 'Enter' && navigate(`/chapters/${chapter._id}`)}
      >
        <span
          className="text-2xl shrink-0"
          style={{
            fontFamily: "'Gaegu', cursive",
            color: 'rgba(255,255,255,0.5)',
            minWidth: '2rem',
            textAlign: 'center',
          }}
          aria-hidden="true"
        >
          {chapter.order}
        </span>
        <div className="flex-1 min-w-0">
          <h3
            className="text-lg leading-tight truncate text-white"
            style={{ fontFamily: "'Gaegu', cursive", fontWeight: 700 }}
          >
            {chapter.title}
          </h3>
          <div className="flex gap-2 mt-1 flex-wrap">
            <Chip label={`🔤 ${chapter.wordCount ?? 0} words`} />
            <Chip label={`📝 ${chapter.noteCount ?? 0} notes`} />
          </div>
        </div>
        <div className="flex gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setEditing(true)}
            className="sketch-btn sketch-btn-secondary sketch-btn-sm"
            aria-label={`Edit chapter: ${chapter.title}`}
          >
            ✏️
          </button>
          <button
            onClick={() => setConfirmOpen(true)}
            className="sketch-btn sketch-btn-danger sketch-btn-sm"
            aria-label={`Delete chapter: ${chapter.title}`}
          >
            🗑️
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete Chapter?"
        message={`Deleting "${chapter.title}" will permanently remove all its words and notes.`}
        confirmLabel="Yes, Delete"
        onConfirm={() => { setConfirmOpen(false); onDelete(chapter._id); }}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}

function Chip({ label }) {
  return (
    <span
      className="sketch-badge text-xs"
      style={{
        background: 'rgba(255,255,255,0.08)',
        borderColor: 'rgba(255,255,255,0.18)',
        color: 'rgba(255,255,255,0.85)',
        fontFamily: "'Patrick Hand', cursive"
      }}
    >
      {label}
    </span>
  );
}
