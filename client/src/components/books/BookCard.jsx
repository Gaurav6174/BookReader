import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmDialog from '../ConfirmDialog.jsx';

/**
 * BookCard — shows a single book with counts, edit, delete, and click-to-open.
 */
export default function BookCard({ book, onEdit, onDelete }) {
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
      <div
        className="sketch-card animate-fade-in cursor-pointer flex flex-col justify-between h-full transition-all duration-300"
        style={{
          borderLeft: '3px solid rgba(255,255,255,0.4)',
        }}
        onClick={() => navigate(`/books/${book._id}`)}
        tabIndex={0}
        role="article"
        aria-label={`Book: ${book.title}`}
        onKeyDown={(e) => e.key === 'Enter' && navigate(`/books/${book._id}`)}
      >
        <div>
          {/* Title & Author */}
          <div className="mb-3">
            <h2
              className="text-2xl leading-tight"
              style={{ fontFamily: "'Gaegu', cursive", fontWeight: 700 }}
            >
              {book.title}
            </h2>
            {book.author && (
              <p className="text-sm muted mt-0.5" style={{ fontFamily: "'Patrick Hand', cursive" }}>
                by {book.author}
              </p>
            )}
          </div>

          {/* Counts */}
          <div className="flex gap-2 flex-wrap mb-4">
            <Chip label={`📖 ${book.chapterCount ?? 0} chapters`} />
            <Chip label={`🔤 ${book.wordCount ?? 0} words`} />
            <Chip label={`📝 ${book.noteCount ?? 0} notes`} />
          </div>
        </div>

        {/* Actions */}
        <div
          className="flex gap-2 pt-3 border-t border-white/10 mt-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => onEdit(book)}
            className="sketch-btn sketch-btn-secondary sketch-btn-sm"
            aria-label={`Edit book: ${book.title}`}
          >
            ✏️ Edit
          </button>
          <button
            onClick={() => setConfirmOpen(true)}
            className="sketch-btn sketch-btn-danger sketch-btn-sm"
            aria-label={`Delete book: ${book.title}`}
          >
            🗑️ Delete
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete Book?"
        message={`Deleting "${book.title}" will permanently remove all its chapters, words, and notes. This cannot be undone.`}
        confirmLabel="Yes, Delete"
        onConfirm={() => { setConfirmOpen(false); onDelete(book._id); }}
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
