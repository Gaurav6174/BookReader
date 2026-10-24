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
        className="flex items-center gap-3 p-4 sketch-card cursor-pointer hover:bg-yellow-50 transition-colors"
        style={{ borderLeft: '6px solid #d8c7ff' }}
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
            color: 'var(--color-muted)',
            minWidth: '2rem',
            textAlign: 'center',
          }}
          aria-hidden="true"
        >
          {chapter.order}
        </span>
        <div className="flex-1 min-w-0">
          <h3
            className="text-lg leading-tight truncate"
            style={{ fontFamily: "'Gaegu', cursive", fontWeight: 700 }}
          >
            {chapter.title}
          </h3>
          <div className="flex gap-2 mt-1 flex-wrap">
            <Chip label={`${chapter.wordCount ?? 0} words`} color="#bbf7d0" />
            <Chip label={`${chapter.noteCount ?? 0} notes`} color="#fbcfe8" />
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

function Chip({ label, color }) {
  return (
    <span
      className="sketch-badge text-xs"
      style={{ background: color, fontFamily: "'Patrick Hand', cursive" }}
    >
      {label}
    </span>
  );
}
