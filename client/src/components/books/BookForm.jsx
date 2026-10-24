import { useState, useEffect, useRef } from 'react';

/**
 * BookForm — inline form for creating or editing a book.
 * When editBook is provided, it's in edit mode.
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
      className="sketch-card animate-fade-in"
      aria-label={editBook ? 'Edit book' : 'Add new book'}
      noValidate
    >
      <h3 className="text-xl mb-4" style={{ fontFamily: "'Gaegu', cursive", fontWeight: 700 }}>
        {editBook ? '✏️ Edit Book' : '📚 Add New Book'}
      </h3>

      <div className="mb-3">
        <label htmlFor="book-title" className="block text-sm mb-1 font-medium">
          Book Title <span aria-hidden="true" className="text-red-500">*</span>
        </label>
        <input
          id="book-title"
          ref={titleRef}
          type="text"
          value={title}
          onChange={(e) => { setTitle(e.target.value); setErrors((p) => ({ ...p, title: '' })); }}
          className="sketch-input"
          placeholder="e.g. The Alchemist"
          aria-required="true"
          aria-describedby={errors.title ? 'book-title-err' : undefined}
          maxLength={200}
        />
        {errors.title && <p id="book-title-err" className="error-msg" role="alert">{errors.title}</p>}
      </div>

      <div className="mb-5">
        <label htmlFor="book-author" className="block text-sm mb-1">
          Author <span className="muted">(optional)</span>
        </label>
        <input
          id="book-author"
          type="text"
          value={author}
          onChange={(e) => { setAuthor(e.target.value); setErrors((p) => ({ ...p, author: '' })); }}
          className="sketch-input"
          placeholder="e.g. Paulo Coelho"
          maxLength={150}
          aria-describedby={errors.author ? 'book-author-err' : undefined}
        />
        {errors.author && <p id="book-author-err" className="error-msg" role="alert">{errors.author}</p>}
      </div>

      <div className="flex gap-3 flex-wrap">
        <button type="submit" disabled={loading} className="sketch-btn sketch-btn-primary">
          {loading ? '⏳ Saving…' : editBook ? '💾 Save Changes' : '➕ Add Book'}
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
