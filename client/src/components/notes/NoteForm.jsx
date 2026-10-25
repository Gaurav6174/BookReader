import { useState, useRef, useEffect } from 'react';

/**
 * NoteForm — inline editor for creating or editing a note.
 */
export default function NoteForm({ editNote, onSubmit, onCancel, loading }) {
  const [content, setContent] = useState(editNote?.content ?? '');
  const [pageNumber, setPageNumber] = useState(editNote?.pageNumber ?? '');
  const [errors, setErrors] = useState({});
  const textareaRef = useRef(null);

  useEffect(() => { textareaRef.current?.focus(); }, []);

  function validate() {
    const errs = {};
    if (!content.trim()) errs.content = 'Note content is required';
    if (content.trim().length > 5000) errs.content = 'Note must be ≤ 5000 characters';
    if (pageNumber !== '' && (isNaN(Number(pageNumber)) || Number(pageNumber) < 1 || !Number.isInteger(Number(pageNumber)))) {
      errs.pageNumber = 'Page number must be a whole number ≥ 1';
    }
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const ok = await onSubmit({
      content: content.trim(),
      pageNumber: pageNumber !== '' ? Number(pageNumber) : null,
    });

    if (ok && !editNote) {
      setContent('');
      setPageNumber('');
      setErrors({});
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="sketch-card animate-fade-in mb-4"
      aria-label={editNote ? 'Edit note' : 'Write a note'}
      style={{ borderLeft: '3px solid rgba(255,255,255,0.35)' }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg" style={{ fontFamily: "'Gaegu', cursive", fontWeight: 700 }}>
          {editNote ? '✏️ Edit Note' : '📝 Write a Note'}
        </h3>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="sketch-btn sketch-btn-secondary sketch-btn-sm"
            aria-label="Collapse note form"
            title="Collapse note form"
          >
            ▲ Collapse
          </button>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="note-content" className="block text-sm mb-1 font-medium">
          Note <span aria-hidden="true" className="text-red-500">*</span>
        </label>
        <textarea
          id="note-content"
          ref={textareaRef}
          value={content}
          onChange={(e) => { setContent(e.target.value); setErrors((p) => ({ ...p, content: '' })); }}
          className="sketch-input"
          rows={4}
          placeholder="Write an important sentence or thought from the book…"
          aria-required="true"
          aria-describedby={errors.content ? 'note-content-err' : undefined}
          maxLength={5000}
        />
        {errors.content && <p id="note-content-err" className="error-msg" role="alert">{errors.content}</p>}
      </div>

      <div className="mb-4 max-w-[180px]">
        <label htmlFor="note-page" className="block text-sm mb-1">
          Page number <span className="muted">(optional)</span>
        </label>
        <input
          id="note-page"
          type="number"
          value={pageNumber}
          onChange={(e) => { setPageNumber(e.target.value); setErrors((p) => ({ ...p, pageNumber: '' })); }}
          className="sketch-input"
          placeholder="e.g. 42"
          min={1}
          step={1}
          aria-describedby={errors.pageNumber ? 'note-page-err' : undefined}
        />
        {errors.pageNumber && <p id="note-page-err" className="error-msg" role="alert">{errors.pageNumber}</p>}
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="sketch-btn sketch-btn-primary">
          {loading ? '⏳ Saving…' : editNote ? '💾 Save Changes' : '💾 Save Note'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="sketch-btn sketch-btn-secondary">
            {editNote ? 'Cancel' : '▲ Collapse'}
          </button>
        )}
      </div>
    </form>
  );
}
