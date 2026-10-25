import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { booksApi } from '../api/books.js';
import { chaptersApi } from '../api/chapters.js';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import ChapterItem from '../components/chapters/ChapterItem.jsx';
import ChapterForm from '../components/chapters/ChapterForm.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ThemeToggle from '../components/ThemeToggle.jsx';
import UserMenu from '../components/UserMenu.jsx';
import { useToast } from '../hooks/useToast.jsx';

export default function BookPage() {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showChapterForm, setShowChapterForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const toast = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [bookData, chaptersData] = await Promise.all([
        booksApi.get(bookId),
        chaptersApi.list(bookId),
      ]);
      setBook(bookData);
      setChapters(chaptersData);
    } catch (err) {
      setError(err.message || 'Failed to load book');
    } finally {
      setLoading(false);
    }
  }, [bookId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function handleCreateChapter(data) {
    setFormLoading(true);
    try {
      const chapter = await chaptersApi.create(bookId, data);
      setChapters((prev) => [...prev, { ...chapter, wordCount: 0, noteCount: 0 }]);
      setShowChapterForm(false);
      toast({ message: `Chapter "${chapter.title}" added!`, type: 'success' });
    } catch (err) {
      toast({ message: err.message || 'Could not create chapter', type: 'error' });
    } finally {
      setFormLoading(false);
    }
  }

  async function handleEditChapter(chapterId, data) {
    try {
      const updated = await chaptersApi.update(chapterId, data);
      setChapters((prev) => prev.map((c) => (c._id === chapterId ? { ...c, ...updated } : c)));
      toast({ message: 'Chapter updated!', type: 'success' });
    } catch (err) {
      toast({ message: err.message || 'Could not update chapter', type: 'error' });
    }
  }

  async function handleDeleteChapter(chapterId) {
    try {
      await chaptersApi.delete(chapterId);
      setChapters((prev) => prev.filter((c) => c._id !== chapterId));
      toast({ message: 'Chapter deleted.', type: 'info' });
    } catch (err) {
      toast({ message: err.message || 'Could not delete chapter', type: 'error' });
    }
  }

  if (loading) {
    return (
      <div className="notebook-bg min-h-screen flex items-center justify-center">
        <span className="text-4xl animate-bounce" aria-hidden="true">📄</span>
        <span className="ml-3 text-lg muted">Loading…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="notebook-bg min-h-screen p-8">
        <div className="max-w-2xl mx-auto sketch-card" style={{ borderColor: 'rgba(220,38,38,0.5)' }}>
          <p className="text-red-300 mb-4">❌ {error}</p>
          <button onClick={fetchData} className="sketch-btn sketch-btn-secondary">🔄 Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="notebook-bg min-h-screen">
      {/* Header */}
      <header
        className="sticky top-0 z-20 px-6 py-4"
        style={{
          background: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(255,255,255,0.12)',
          fontFamily: "'Gaegu', cursive"
        }}
      >
        <div className="max-w-4xl mx-auto">
          <Breadcrumbs crumbs={[{ label: 'Books', to: '/' }, { label: book?.title || '…' }]} />
          <div className="flex items-start justify-between gap-4 mt-1 flex-wrap">
            <div>
              <h1 className="text-2xl font-bold leading-tight">{book?.title}</h1>
              {book?.author && (
                <p className="text-sm muted mt-0.5" style={{ fontFamily: "'Patrick Hand', cursive" }}>
                  by {book.author}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <UserMenu />
              <ThemeToggle />
              <button
                onClick={() => setShowChapterForm((v) => !v)}
                className="sketch-btn sketch-btn-primary"
                aria-label="Add new chapter"
              >
                {showChapterForm ? '✕ Cancel' : '➕ Add Chapter'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Chapter form */}
        {showChapterForm && (
          <div className="mb-6">
            <ChapterForm
              onSubmit={handleCreateChapter}
              onCancel={() => setShowChapterForm(false)}
              loading={formLoading}
            />
          </div>
        )}

        {/* Chapters list */}
        {chapters.length === 0 && !showChapterForm ? (
          <EmptyState
            icon="📄"
            title="No chapters yet"
            message="Add your first chapter to start saving words and notes."
            action={
              <button onClick={() => setShowChapterForm(true)} className="sketch-btn sketch-btn-primary">
                ➕ Add First Chapter
              </button>
            }
          />
        ) : (
          <div className="flex flex-col gap-3">
            {chapters.map((chapter) => (
              <ChapterItem
                key={chapter._id}
                chapter={chapter}
                onEdit={handleEditChapter}
                onDelete={handleDeleteChapter}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
