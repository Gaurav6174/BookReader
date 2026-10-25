import { useState, useEffect, useRef } from 'react';

/**
 * ChapterForm — inline form for creating or editing a chapter below the chapter list.
 */
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
      className="p-5 border border-white/15 bg-white/[0.04] backdrop-blur-md rounded-xl animate-fade-in"
      aria-label={editChapter ? 'Edit chapter' : 'Add new chapter'}
      noValidate
    >
      <div className="mb-4">
        <label
          htmlFor="chapter-title"
          className="block text-xs uppercase tracking-wider text-white/50 mb-1"
          style={{ fontFamily: "'Gaegu', cursive" }}
        >
          Chapter Title <span aria-hidden="true" className="text-red-400">*</span>
        </label>
        <input
          id="chapter-title"
          ref={inputRef}
          type="text"
          value={title}
          onChange={(e) => { setTitle(e.target.value); setError(''); }}
          className="sketch-input py-1.5 text-sm"
          placeholder="e.g. Chapter 1 — The Journey Begins"
          aria-required="true"
          aria-describedby={error ? 'chapter-title-err' : undefined}
          maxLength={200}
        />
        {error && <p id="chapter-title-err" className="error-msg" role="alert">{error}</p>}
      </div>

      <div className="flex items-center gap-2">
        <button type="submit" disabled={loading} className="sketch-btn sketch-btn-primary sketch-btn-sm">
          {loading ? '⏳' : editChapter ? 'Save Changes' : 'Save Chapter'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="sketch-btn sketch-btn-secondary sketch-btn-sm">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
