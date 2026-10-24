import { useState, useEffect, useRef } from 'react';

export default function ChapterForm({ editChapter, onSubmit, onCancel, loading }) {
  const [title, setTitle] = useState(editChapter?.title ?? '');
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) { setError('Chapter title is required'); return; }
    if (title.trim().length > 200) { setError('Title must be ≤ 200 characters'); return; }
    onSubmit({ title: title.trim() });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="sketch-card animate-fade-in"
      aria-label={editChapter ? 'Edit chapter' : 'Add new chapter'}
      noValidate
    >
      <h3 className="text-lg mb-3" style={{ fontFamily: "'Gaegu', cursive", fontWeight: 700 }}>
        {editChapter ? '✏️ Edit Chapter' : '📄 Add Chapter'}
      </h3>
      <div className="mb-4">
        <label htmlFor="chapter-title" className="block text-sm mb-1 font-medium">
          Chapter Title <span aria-hidden="true" className="text-red-500">*</span>
        </label>
        <input
          id="chapter-title"
          ref={inputRef}
          type="text"
          value={title}
          onChange={(e) => { setTitle(e.target.value); setError(''); }}
          className="sketch-input"
          placeholder="e.g. Chapter 1 — The Journey Begins"
          aria-required="true"
          aria-describedby={error ? 'chapter-title-err' : undefined}
          maxLength={200}
        />
        {error && <p id="chapter-title-err" className="error-msg" role="alert">{error}</p>}
      </div>
      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="sketch-btn sketch-btn-primary">
          {loading ? '⏳ Saving…' : editChapter ? '💾 Save' : '➕ Add Chapter'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="sketch-btn sketch-btn-secondary">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
