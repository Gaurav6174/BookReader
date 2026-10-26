import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { booksApi } from '../api/books.js';
import { chaptersApi } from '../api/chapters.js';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import ChapterItem from '../components/chapters/ChapterItem.jsx';
import ChapterForm from '../components/chapters/ChapterForm.jsx';
import UserMenu from '../components/UserMenu.jsx';
import MusicButton from '../components/music/MusicButton.jsx';
import ProductivityNavButton from '../components/productivity/ProductivityNavButton.jsx';
import InstallAppButton from '../components/pwa/InstallAppButton.jsx';
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

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleCreateChapter(chapterData) {
    setFormLoading(true);
    try {
      const created = await chaptersApi.create(bookId, chapterData);
      setChapters((prev) => [...prev, created]);
      setShowChapterForm(false);
      toast({ message: `"${created.title}" added!`, type: 'success' });
    } catch (err) {
      toast({ message: err.message || 'Could not add chapter', type: 'error' });
    } finally {
      setFormLoading(false);
    }
  }

  async function handleEditChapter(chapterId, chapterData) {
    try {
      const updated = await chaptersApi.update(chapterId, chapterData);
      setChapters((prev) => prev.map((c) => (c._id === chapterId ? updated : c)));
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
        <span className="text-4xl animate-bounce" aria-hidden="true">📖</span>
        <span className="ml-3 text-lg muted" style={{ fontFamily: "'Patrick Hand', cursive" }}>
          Loading book…
        </span>
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
      {/* Streamlined Header: Back Link, Title & User Menu */}
      <header
        className="sticky top-0 z-20 px-6 py-3 border-b border-white/10"
        style={{
          background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <Link
              to="/"
              className="text-white/50 hover:text-white text-sm flex items-center gap-1.5 shrink-0 hover:-translate-x-1 transition-all duration-200"
              style={{ fontFamily: "'Patrick Hand', cursive" }}
              title="Back to Books"
            >
              <span>←</span>
              <span>Books</span>
            </Link>
            <span className="text-white/20 text-xs">/</span>
            <div className="min-w-0">
              <h1
                className="text-xl font-bold truncate text-white"
                style={{ fontFamily: "'Gaegu', cursive" }}
              >
                {book?.title}
              </h1>
              {book?.author && (
                <p className="text-xs text-white/40 truncate" style={{ fontFamily: "'Patrick Hand', cursive" }}>
                  by {book.author}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <InstallAppButton />
            <ProductivityNavButton />
            <MusicButton />
            <UserMenu />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Empty state if 0 chapters and not adding */}
        {chapters.length === 0 && !showChapterForm && (
          <div className="py-8 text-white/40 text-sm" style={{ fontFamily: "'Patrick Hand', cursive" }}>
            No chapters yet. Click the <span className="text-white/70 font-bold">+</span> below to add your first chapter.
          </div>
        )}

        {/* Chapters list */}
        {chapters.length > 0 && (
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

        {/* Small "+" button below the chapters, exactly like Add Word */}
        <div className="mt-4">
          {!showChapterForm ? (
            <button
              onClick={() => setShowChapterForm(true)}
              className="inline-flex items-center gap-2.5 text-sm text-white/60 hover:text-white py-1.5 px-3 rounded-lg hover:bg-white/[0.08] active:scale-95 transition-all duration-200 group border border-transparent hover:border-white/15"
              style={{ fontFamily: "'Patrick Hand', cursive" }}
              aria-label="Add a new chapter"
            >
              <span className="w-5 h-5 rounded-full border border-white/25 flex items-center justify-center text-xs text-white/70 group-hover:border-white group-hover:bg-white group-hover:text-black group-hover:scale-110 group-hover:rotate-90 transition-all duration-300">
                +
              </span>
              <span className="group-hover:translate-x-0.5 transition-transform duration-200">Add Chapter</span>
            </button>
          ) : (
            <div className="max-w-xl">
              <ChapterForm
                onSubmit={handleCreateChapter}
                onCancel={() => setShowChapterForm(false)}
                loading={formLoading}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
