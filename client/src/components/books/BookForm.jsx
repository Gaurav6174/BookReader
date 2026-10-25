import { useState, useEffect, useRef } from 'react';

/**
 * BookForm — inline form for creating or editing a book below the books list.
 */
export default function BookForm({ editBook, onSubmit, onCancel, loading }) {
  const [title, setTitle] = useState(editBook?.title ?? '');
  const [author, setAuthor] = useState(editBook?.author ?? '');
  const [errors, setErrors] = useState({});
  const titleRef = useRef(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  function validate() {
    const errs = {};
    if (!title.trim()) errs.title = 'Title is required';
    if (title.trim().length > 200) errs.title = 'Title must be ≤ 200 characters';
    if (author.trim().length > 150) errs.author = 'Author must be ≤ 150 characters';
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSubmit({ title: title.trim(), author: author.trim() });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-5 border border-white/15 bg-white/[0.04] backdrop-blur-md rounded-xl animate-fade-in"
      aria-label={editBook ? 'Edit book' : 'Add new book'}
      noValidate
    >
      <div className="mb-3">
        <label
          htmlFor="book-title"
          className="block text-xs uppercase tracking-wider text-white/50 mb-1"
          style={{ fontFamily: "'Gaegu', cursive" }}
        >
          Book Title <span aria-hidden="true" className="text-red-400">*</span>
        </label>
        <input
          id="book-title"
          ref={titleRef}
          type="text"
          value={title}
          onChange={(e) => { setTitle(e.target.value); setErrors((p) => ({ ...p, title: '' })); }}
          className="sketch-input py-1.5 text-sm"
          placeholder="e.g. The Alchemist"
          aria-required="true"
          aria-describedby={errors.title ? 'book-title-err' : undefined}
          maxLength={200}
        />
        {errors.title && <p id="book-title-err" className="error-msg" role="alert">{errors.title}</p>}
      </div>

      <div className="mb-4">
        <label
          htmlFor="book-author"
          className="block text-xs uppercase tracking-wider text-white/50 mb-1"
          style={{ fontFamily: "'Gaegu', cursive" }}
        >
          Author <span className="normal-case text-white/30 text-[11px]">(optional)</span>
        </label>
        <input
          id="book-author"
          type="text"
          value={author}
          onChange={(e) => { setAuthor(e.target.value); setErrors((p) => ({ ...p, author: '' })); }}
          className="sketch-input py-1.5 text-sm"
          placeholder="e.g. Paulo Coelho"
          maxLength={150}
          aria-describedby={errors.author ? 'book-author-err' : undefined}
        />
        {errors.author && <p id="book-author-err" className="error-msg" role="alert">{errors.author}</p>}
      </div>

      <div className="flex items-center gap-2">
        <button type="submit" disabled={loading} className="sketch-btn sketch-btn-primary sketch-btn-sm">
          {loading ? '⏳' : editBook ? 'Save Changes' : 'Save Book'}
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
