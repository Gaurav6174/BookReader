import { useState, useEffect, useCallback } from 'react';
import { booksApi } from '../api/books.js';
import BookCard from '../components/books/BookCard.jsx';
import BookForm from '../components/books/BookForm.jsx';
import UserMenu from '../components/UserMenu.jsx';
import { useToast } from '../hooks/useToast.jsx';

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editBook, setEditBook] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const toast = useToast();

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

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  async function handleCreate(bookData) {
    setFormLoading(true);
    try {
      const created = await booksApi.create(bookData);
      setBooks((prev) => [created, ...prev]);
      setShowForm(false);
      toast({ message: `"${created.title}" added to your library!`, type: 'success' });
    } catch (err) {
      toast({ message: err.message || 'Could not add book', type: 'error' });
    } finally {
      setFormLoading(false);
    }
  }

  async function handleUpdate(bookData) {
    if (!editBook) return;
    setFormLoading(true);
    try {
      const updated = await booksApi.update(editBook._id, bookData);
      setBooks((prev) => prev.map((b) => (b._id === editBook._id ? updated : b)));
      setEditBook(null);
      toast({ message: `"${updated.title}" updated!`, type: 'success' });
    } catch (err) {
      toast({ message: err.message || 'Could not update book', type: 'error' });
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDelete(bookId) {
    try {
      await booksApi.delete(bookId);
      setBooks((prev) => prev.filter((b) => b._id !== bookId));
      toast({ message: 'Book deleted.', type: 'info' });
    } catch (err) {
      toast({ message: err.message || 'Could not delete book', type: 'error' });
    }
  }

  return (
    <div className="notebook-bg min-h-screen">
      {/* Streamlined Header: Purely Title & User Menu */}
      <header
        className="sticky top-0 z-20 px-6 py-3 border-b border-white/10"
        style={{
          background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl" aria-hidden="true">📚</span>
            <div>
              <h1
                className="text-xl font-bold leading-tight text-white"
                style={{ fontFamily: "'Gaegu', cursive" }}
              >
                Book Reading Companion
              </h1>
              <p className="text-xs text-white/40" style={{ fontFamily: "'Patrick Hand', cursive" }}>
                Your personal vocabulary & notes tracker
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <UserMenu />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
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
          <div className="sketch-card text-center py-10" style={{ borderColor: 'rgba(220,38,38,0.5)' }}>
            <p className="text-red-300 mb-4">❌ {error}</p>
            <button onClick={fetchBooks} className="sketch-btn sketch-btn-secondary">
              🔄 Retry
            </button>
          </div>
        )}

        {/* Empty state if 0 books and not adding */}
        {!loading && !error && books.length === 0 && !showForm && !editBook && (
          <div className="py-8 text-white/40 text-sm" style={{ fontFamily: "'Patrick Hand', cursive" }}>
            No books in your library yet. Click the <span className="text-white/70 font-bold">+</span> below to add your first book.
          </div>
        )}

        {/* Books grid */}
        {!loading && !error && books.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
              <BookCard
                key={book._id}
                book={book}
                onEdit={(b) => { setEditBook(b); setShowForm(false); }}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* Small "+" button below the books, exactly like Add Word */}
        {!loading && !error && (
          <div className="mt-6">
            {!showForm && !editBook ? (
              <button
                onClick={() => { setShowForm(true); setEditBook(null); }}
                className="inline-flex items-center gap-2.5 text-sm text-white/60 hover:text-white py-1.5 px-3 rounded-lg hover:bg-white/[0.08] active:scale-95 transition-all duration-200 group border border-transparent hover:border-white/15"
                style={{ fontFamily: "'Patrick Hand', cursive" }}
                aria-label="Add a new book"
              >
                <span className="w-5 h-5 rounded-full border border-white/25 flex items-center justify-center text-xs text-white/70 group-hover:border-white group-hover:bg-white group-hover:text-black group-hover:scale-110 group-hover:rotate-90 transition-all duration-300">
                  +
                </span>
                <span className="group-hover:translate-x-0.5 transition-transform duration-200">Add Book</span>
              </button>
            ) : (
              <div className="max-w-xl">
                <BookForm
                  editBook={editBook}
                  onSubmit={editBook ? handleUpdate : handleCreate}
                  onCancel={() => { setShowForm(false); setEditBook(null); }}
                  loading={formLoading}
                />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
