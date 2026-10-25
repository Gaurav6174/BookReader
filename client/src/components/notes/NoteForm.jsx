import { useState, useRef, useEffect } from 'react';

/**
 * NoteForm — clean, compact inline form to add/edit notes directly below the note list.
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
      className="p-4 border border-white/15 bg-white/[0.04] backdrop-blur-md rounded-xl animate-fade-in"
      aria-label={editNote ? 'Edit note' : 'Write a note'}
    >
      <div className="mb-3">
        <label htmlFor="note-content" className="block text-xs uppercase tracking-wider text-white/50 mb-1" style={{ fontFamily: "'Gaegu', cursive" }}>
          Note / Quote
        </label>
        <textarea
          id="note-content"
          ref={textareaRef}
          value={content}
          onChange={(e) => { setContent(e.target.value); setErrors((p) => ({ ...p, content: '' })); }}
          className="sketch-input py-1.5 text-sm"
          rows={3}
          placeholder="Jot down a quote, insight, or summary…"
          aria-required="true"
          aria-describedby={errors.content ? 'note-content-err' : undefined}
          maxLength={5000}
        />
        {errors.content && <p id="note-content-err" className="error-msg" role="alert">{errors.content}</p>}
      </div>

      <div className="mb-4 max-w-[140px]">
        <label htmlFor="note-page" className="block text-xs uppercase tracking-wider text-white/50 mb-1" style={{ fontFamily: "'Gaegu', cursive" }}>
          Page <span className="normal-case text-white/30 text-[11px]">(optional)</span>
        </label>
        <input
          id="note-page"
          type="number"
          value={pageNumber}
          onChange={(e) => { setPageNumber(e.target.value); setErrors((p) => ({ ...p, pageNumber: '' })); }}
          className="sketch-input py-1.5 text-sm"
          placeholder="e.g. 42"
          min={1}
          step={1}
          aria-describedby={errors.pageNumber ? 'note-page-err' : undefined}
        />
        {errors.pageNumber && <p id="note-page-err" className="error-msg" role="alert">{errors.pageNumber}</p>}
      </div>

      <div className="flex items-center gap-2">
        <button type="submit" disabled={loading} className="sketch-btn sketch-btn-primary sketch-btn-sm">
          {loading ? '⏳' : editNote ? 'Save Changes' : 'Save Note'}
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
