import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { chaptersApi } from '../api/chapters.js';
import { wordsApi } from '../api/words.js';
import { notesApi } from '../api/notes.js';
import WordForm from '../components/words/WordForm.jsx';
import WordList from '../components/words/WordList.jsx';
import NoteList from '../components/notes/NoteList.jsx';
import NoteForm from '../components/notes/NoteForm.jsx';
import UserMenu from '../components/UserMenu.jsx';
import MusicButton from '../components/music/MusicButton.jsx';
import ProductivityNavButton from '../components/productivity/ProductivityNavButton.jsx';
import InstallAppButton from '../components/pwa/InstallAppButton.jsx';
import { useToast } from '../hooks/useToast.jsx';

export default function ChapterPage() {
  const { chapterId } = useParams();
  const [chapter, setChapter] = useState(null);
  const [words, setWords] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showWordForm, setShowWordForm] = useState(false);
  const [creatingNote, setCreatingNote] = useState(false);
  const [wordSaving, setWordSaving] = useState(false);
  const [noteSaving, setNoteSaving] = useState(false);
  const [viewFilter, setViewFilter] = useState('both'); // 'both' | 'words' | 'notes'
  const toast = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [chapterData, wordsData, notesData] = await Promise.all([
        chaptersApi.get(chapterId),
        wordsApi.list(chapterId),
        notesApi.list(chapterId),
      ]);
      setChapter(chapterData);
      setWords(wordsData);
      setNotes(notesData);
    } catch (err) {
      setError(err.message || 'Failed to load chapter');
    } finally {
      setLoading(false);
    }
  }, [chapterId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ─── Words ──────────────────────────────────────────────
  async function handleCreateWord(data) {
    setWordSaving(true);
    try {
      const word = await wordsApi.create(chapterId, data);
      setWords((prev) => [...prev, word]);
      toast({ message: `"${word.word}" saved!`, type: 'success' });
      return true;
    } catch (err) {
      if (err.status === 409) {
        toast({ message: 'This word is already saved in this chapter.', type: 'warning' });
      } else {
        toast({ message: err.message || 'Could not save word', type: 'error' });
      }
      return false;
    } finally {
      setWordSaving(false);
    }
  }

  async function handleUpdateWord(wordId, data) {
    try {
      const updated = await wordsApi.update(wordId, data);
      setWords((prev) => prev.map((w) => (w._id === wordId ? updated : w)));
      toast({ message: 'Word updated!', type: 'success' });
      return true;
    } catch (err) {
      if (err.status === 409) {
        toast({ message: 'This word is already saved in this chapter.', type: 'warning' });
      } else {
        toast({ message: err.message || 'Could not update word', type: 'error' });
      }
      return false;
    }
  }

  async function handleDeleteWord(wordId) {
    try {
      await wordsApi.delete(wordId);
      setWords((prev) => prev.filter((w) => w._id !== wordId));
      toast({ message: 'Word deleted.', type: 'info' });
    } catch (err) {
      toast({ message: err.message || 'Could not delete word', type: 'error' });
    }
  }

  // ─── Notes ──────────────────────────────────────────────
  async function handleCreateNote(data) {
    setNoteSaving(true);
    try {
      const note = await notesApi.create(chapterId, data);
      setNotes((prev) => [...prev, note]);
      toast({ message: 'Note saved!', type: 'success' });
      return true;
    } catch (err) {
      toast({ message: err.message || 'Could not save note', type: 'error' });
      return false;
    } finally {
      setNoteSaving(false);
    }
  }

  async function handleUpdateNote(noteId, data) {
    try {
      const updated = await notesApi.update(noteId, data);
      setNotes((prev) => prev.map((n) => (n._id === noteId ? updated : n)));
      toast({ message: 'Note updated!', type: 'success' });
      return true;
    } catch (err) {
      toast({ message: err.message || 'Could not update note', type: 'error' });
      return false;
    }
  }

  async function handleDeleteNote(noteId) {
    try {
      await notesApi.delete(noteId);
      setNotes((prev) => prev.filter((n) => n._id !== noteId));
      toast({ message: 'Note deleted.', type: 'info' });
    } catch (err) {
      toast({ message: err.message || 'Could not delete note', type: 'error' });
    }
  }

  // ─── Loading / Error ─────────────────────────────────────
  if (loading) {
    return (
      <div className="notebook-bg min-h-screen flex items-center justify-center">
        <span className="text-4xl animate-bounce" aria-hidden="true">📖</span>
        <span className="ml-3 text-lg muted" style={{ fontFamily: "'Patrick Hand', cursive" }}>
          Loading chapter…
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

  const bookId = chapter?.bookId || chapter?.book?._id;
  const bookTitle = chapter?.book?.title || 'Book';

  return (
    <div className="notebook-bg min-h-screen">
      {/* Streamlined, distraction-free nav panel */}
      <header
        className="sticky top-0 z-20 px-6 py-3 border-b border-white/10"
        style={{
          background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Breadcrumb + Chapter Title */}
          <div className="flex items-center gap-2.5 min-w-0">
            <Link
              to={`/books/${bookId}`}
              className="text-white/50 hover:text-white text-sm flex items-center gap-1.5 shrink-0 hover:-translate-x-1 transition-all duration-200"
              style={{ fontFamily: "'Patrick Hand', cursive" }}
              title={`Back to ${bookTitle}`}
            >
              <span>←</span>
              <span>{bookTitle}</span>
            </Link>
            <span className="text-white/20 text-xs">/</span>
            <h1
              className="text-xl font-bold truncate text-white"
              style={{ fontFamily: "'Gaegu', cursive" }}
            >
              {chapter?.title}
            </h1>
          </div>

          {/* Controls: Split/Words/Notes Switcher + User/Theme */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center text-xs rounded-lg border border-white/10 p-0.5 bg-white/[0.04]">
              <button
                onClick={() => setViewFilter('both')}
                className={`px-2.5 py-1 rounded transition-all duration-150 ${
                  viewFilter === 'both' ? 'bg-white text-black font-bold shadow-sm' : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
                style={{ fontFamily: "'Patrick Hand', cursive" }}
                title="View words and notes side by side"
              >
                Split
              </button>
              <button
                onClick={() => setViewFilter('words')}
                className={`px-2.5 py-1 rounded transition-all duration-150 ${
                  viewFilter === 'words' ? 'bg-white text-black font-bold shadow-sm' : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
                style={{ fontFamily: "'Patrick Hand', cursive" }}
                title="View words only"
              >
                Words
              </button>
              <button
                onClick={() => setViewFilter('notes')}
                className={`px-2.5 py-1 rounded transition-all duration-150 ${
                  viewFilter === 'notes' ? 'bg-white text-black font-bold shadow-sm' : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
                style={{ fontFamily: "'Patrick Hand', cursive" }}
                title="View notes only"
              >
                Notes
              </button>
            </div>

            <InstallAppButton />
            <ProductivityNavButton />
            <MusicButton />
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Main Reading Companion View: Clean, Open & Uncluttered */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div
          className={`grid gap-10 items-start ${
            viewFilter === 'both' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 max-w-2xl mx-auto'
          }`}
        >
          {/* ─── WORDS SECTION ─────────────────────────────── */}
          {(viewFilter === 'both' || viewFilter === 'words') && (
            <section aria-label="Words and Vocabulary">
              {/* Clean Section Header (No boxes) */}
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/10">
                <h2
                  className="text-xl font-bold tracking-wide text-white"
                  style={{ fontFamily: "'Gaegu', cursive" }}
                >
                  Words
                </h2>
                <span className="text-xs text-white/40" style={{ fontFamily: "'Patrick Hand', cursive" }}>
                  {words.length} saved
                </span>
              </div>

              {/* Clean Word List without table borders or boxed cells */}
              <WordList
                words={words}
                onUpdate={handleUpdateWord}
                onDelete={handleDeleteWord}
                isAddingWord={showWordForm}
              />

              {/* Small "+" button directly below words */}
              {!showWordForm ? (
                <button
                  onClick={() => setShowWordForm(true)}
                  className="mt-3 inline-flex items-center gap-2.5 text-sm text-white/60 hover:text-white py-1.5 px-3 rounded-lg hover:bg-white/[0.08] active:scale-95 transition-all duration-200 group border border-transparent hover:border-white/15"
                  style={{ fontFamily: "'Patrick Hand', cursive" }}
                  aria-label="Add a new word"
                >
                  <span className="w-5 h-5 rounded-full border border-white/25 flex items-center justify-center text-xs text-white/70 group-hover:border-white group-hover:bg-white group-hover:text-black group-hover:scale-110 group-hover:rotate-90 transition-all duration-300">
                    +
                  </span>
                  <span className="group-hover:translate-x-0.5 transition-transform duration-200">Add word</span>
                </button>
              ) : (
                <div className="mt-3">
                  <WordForm
                    onSubmit={async (data) => {
                      const ok = await handleCreateWord(data);
                      if (ok) setShowWordForm(false);
                      return ok;
                    }}
                    loading={wordSaving}
                    onCollapse={() => setShowWordForm(false)}
                  />
                </div>
              )}
            </section>
          )}

          {/* ─── NOTES SECTION ─────────────────────────────── */}
          {(viewFilter === 'both' || viewFilter === 'notes') && (
            <section aria-label="Notes and Quotes">
              {/* Clean Section Header (No boxes) */}
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/10">
                <h2
                  className="text-xl font-bold tracking-wide text-white"
                  style={{ fontFamily: "'Gaegu', cursive" }}
                >
                  Notes & Quotes
                </h2>
                <span className="text-xs text-white/40" style={{ fontFamily: "'Patrick Hand', cursive" }}>
                  {notes.length} saved
                </span>
              </div>

              {/* Clean Notes List without heavy card boxes */}
              <NoteList
                notes={notes}
                onUpdate={handleUpdateNote}
                onDelete={handleDeleteNote}
                creating={creatingNote}
              />

              {/* Small "+" button directly below notes */}
              {!creatingNote ? (
                <button
                  onClick={() => setCreatingNote(true)}
                  className="mt-3 inline-flex items-center gap-2.5 text-sm text-white/60 hover:text-white py-1.5 px-3 rounded-lg hover:bg-white/[0.08] active:scale-95 transition-all duration-200 group border border-transparent hover:border-white/15"
                  style={{ fontFamily: "'Patrick Hand', cursive" }}
                  aria-label="Write a new note"
                >
                  <span className="w-5 h-5 rounded-full border border-white/25 flex items-center justify-center text-xs text-white/70 group-hover:border-white group-hover:bg-white group-hover:text-black group-hover:scale-110 group-hover:rotate-90 transition-all duration-300">
                    +
                  </span>
                  <span className="group-hover:translate-x-0.5 transition-transform duration-200">Add note</span>
                </button>
              ) : (
                <div className="mt-3">
                  <NoteForm
                    onSubmit={async (data) => {
                      const ok = await handleCreateNote(data);
                      if (ok) setCreatingNote(false);
                      return ok;
                    }}
                    onCancel={() => setCreatingNote(false)}
                    loading={noteSaving}
                  />
                </div>
              )}
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
