import { useState, useEffect, useCallback } from 'react';
import { booksApi } from '../api/books.js';
import BookCard from '../components/books/BookCard.jsx';
import BookForm from '../components/books/BookForm.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ThemeToggle from '../components/ThemeToggle.jsx';
import UserMenu from '../components/UserMenu.jsx';
import { useToast } from '../hooks/useToast.jsx';
import { useAuth } from '../hooks/useAuth.jsx';

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editBook, setEditBook] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const toast = useToast();
  const { token } = useAuth();

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await booksApi.list();
      setBooks(data);
    } catch (err) {
      setError(err.message || 'Failed to load books');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBooks(); }, [fetchBooks, token]);

  async function handleCreate(data) {
    setFormLoading(true);
    try {
      const book = await booksApi.create(data);
      setBooks((prev) => [{ ...book, chapterCount: 0, wordCount: 0, noteCount: 0 }, ...prev]);
      setShowForm(false);
      toast({ message: `"${book.title}" added!`, type: 'success' });
    } catch (err) {
      toast({ message: err.message || 'Could not create book', type: 'error' });
    } finally {
      setFormLoading(false);
    }
  }

  async function handleUpdate(data) {
    setFormLoading(true);
    try {
      const updated = await booksApi.update(editBook._id, data);
      setBooks((prev) =>
        prev.map((b) => (b._id === updated._id ? { ...b, ...updated } : b))
      );
      setEditBook(null);
      toast({ message: 'Book updated!', type: 'success' });
    } catch (err) {
      toast({ message: err.message || 'Could not update book', type: 'error' });
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDelete(id) {
    try {
      await booksApi.delete(id);
      setBooks((prev) => prev.filter((b) => b._id !== id));
      toast({ message: 'Book deleted.', type: 'info' });
    } catch (err) {
      toast({ message: err.message || 'Could not delete book', type: 'error' });
    }
  }

  return (
    <div className="notebook-bg min-h-screen">
      {/* Page Header */}
      <header
        className="sticky top-0 z-20 px-6 py-4 border-b-2 border-charcoal"
        style={{ background: 'var(--color-yellow)', fontFamily: "'Gaegu', cursive" }}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl" aria-hidden="true">📚</span>
            <div>
              <h1 className="text-2xl font-bold leading-tight">Book Reading Companion</h1>
              <p className="text-sm muted" style={{ fontFamily: "'Patrick Hand', cursive" }}>
                Your personal vocabulary & notes tracker
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <UserMenu />
            <ThemeToggle />
            <button
              onClick={() => { setShowForm(true); setEditBook(null); }}
              className="sketch-btn sketch-btn-secondary"
              aria-label="Add a new book"
            >
              ➕ Add Book
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Create / Edit Form */}
        {(showForm || editBook) && (
          <div className="mb-8">
            <BookForm
              editBook={editBook}
              onSubmit={editBook ? handleUpdate : handleCreate}
              onCancel={() => { setShowForm(false); setEditBook(null); }}
              loading={formLoading}
            />
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20" role="status" aria-label="Loading books">
            <span className="text-4xl animate-bounce" aria-hidden="true">📖</span>
            <span className="ml-3 text-lg muted" style={{ fontFamily: "'Patrick Hand', cursive" }}>
              Loading your books…
            </span>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="sketch-card text-center py-10" style={{ borderColor: '#ef4444', borderLeft: '6px solid #ef4444' }}>
            <p className="text-red-700 mb-4">❌ {error}</p>
            <button onClick={fetchBooks} className="sketch-btn sketch-btn-secondary">
              🔄 Retry
            </button>
          </div>
        )}

        {/* Books grid */}
        {!loading && !error && books.length === 0 && !showForm && (
          <EmptyState
            icon="📚"
            title="No books yet!"
            message="Start your reading journey by adding your first book."
            action={
              <button onClick={() => setShowForm(true)} className="sketch-btn sketch-btn-primary">
                ➕ Add First Book
              </button>
            }
          />
        )}

        {!loading && !error && books.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
              <BookCard
                key={book._id}
                book={book}
                onEdit={(b) => { setEditBook(b); setShowForm(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
