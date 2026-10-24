import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { chaptersApi } from '../api/chapters.js';
import { wordsApi } from '../api/words.js';
import { notesApi } from '../api/notes.js';
import Breadcrumbs from '../components/Breadcrumbs.jsx';
import WordForm from '../components/words/WordForm.jsx';
import WordList from '../components/words/WordList.jsx';
import NoteList from '../components/notes/NoteList.jsx';
import ThemeToggle from '../components/ThemeToggle.jsx';
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
      setWords((prev) => [word, ...prev]);
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
      setNotes((prev) => [note, ...prev]);
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
        <span className="text-4xl animate-bounce" aria-hidden="true">📝</span>
        <span className="ml-3 text-lg muted">Loading chapter…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="notebook-bg min-h-screen p-8">
        <div className="max-w-3xl mx-auto sketch-card" style={{ borderLeft: '6px solid #ef4444' }}>
          <p className="text-red-700 mb-4">❌ {error}</p>
          <button onClick={fetchData} className="sketch-btn sketch-btn-secondary">🔄 Retry</button>
        </div>
      </div>
    );
  }

  const bookId = chapter?.bookId || chapter?.book?._id;
  const bookTitle = chapter?.book?.title || 'Book';

  return (
    <div className="notebook-bg min-h-screen">
      {/* Header */}
      <header
        className="sticky top-0 z-20 px-6 py-4 border-b-2 border-charcoal"
        style={{ background: 'var(--color-green)', fontFamily: "'Gaegu', cursive" }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div>
            <Breadcrumbs
              crumbs={[
                { label: 'Books', to: '/' },
                { label: bookTitle, to: `/books/${bookId}` },
                { label: chapter?.title || '…' },
              ]}
            />
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              <h1 className="text-2xl font-bold leading-tight">{chapter?.title}</h1>
              <div className="flex gap-2">
                <span
                  className="sketch-badge text-xs"
                  style={{ background: 'var(--color-yellow)' }}
                >
                  🔤 {words.length} words
                </span>
                <span
                  className="sketch-badge text-xs"
                  style={{ background: 'var(--color-pink)' }}
                >
                  📝 {notes.length} notes
                </span>
              </div>
            </div>
          </div>

          {/* Actions: Theme toggle + View mode toggle */}
          <div className="flex items-center gap-3 flex-wrap">
            <ThemeToggle />
            <div className="flex items-center gap-1 bg-white/70 dark:bg-black/40 p-1 border-2 border-charcoal shadow-[2px_2px_0_var(--color-charcoal)]">
              <button
                onClick={() => setViewFilter('both')}
                className={`px-3 py-1 text-sm rounded-none border border-transparent transition-all ${
                  viewFilter === 'both'
                    ? 'bg-yellow-200 dark:bg-yellow-800 dark:text-yellow-100 border-charcoal font-bold shadow-[1px_1px_0_var(--color-charcoal)]'
                    : 'hover:bg-black/5 dark:hover:bg-white/10 text-charcoal'
                }`}
                style={{ fontFamily: "'Patrick Hand', cursive" }}
              >
                📖 Split View
              </button>
              <button
                onClick={() => setViewFilter('words')}
                className={`px-3 py-1 text-sm rounded-none border border-transparent transition-all ${
                  viewFilter === 'words'
                    ? 'bg-yellow-200 dark:bg-yellow-800 dark:text-yellow-100 border-charcoal font-bold shadow-[1px_1px_0_var(--color-charcoal)]'
                    : 'hover:bg-black/5 dark:hover:bg-white/10 text-charcoal'
                }`}
                style={{ fontFamily: "'Patrick Hand', cursive" }}
              >
                🔤 Words
              </button>
              <button
                onClick={() => setViewFilter('notes')}
                className={`px-3 py-1 text-sm rounded-none border border-transparent transition-all ${
                  viewFilter === 'notes'
                    ? 'bg-pink-200 dark:bg-pink-800 dark:text-pink-100 border-charcoal font-bold shadow-[1px_1px_0_var(--color-charcoal)]'
                    : 'hover:bg-black/5 dark:hover:bg-white/10 text-charcoal'
                }`}
                style={{ fontFamily: "'Patrick Hand', cursive" }}
              >
                📝 Notes
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area: Both Words & Notes in the same space */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div
          className={`grid gap-8 items-start ${
            viewFilter === 'both' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'
          }`}
        >
          {/* ─── WORDS SECTION ─────────────────────────────── */}
          {(viewFilter === 'both' || viewFilter === 'words') && (
            <section
              className="space-y-4"
              aria-label="Words and Vocabulary section"
            >
              {/* Words Section Header */}
              <div
                className="flex items-center justify-between p-3.5 sketch-card border-l-[6px]"
                style={{
                  borderLeftColor: 'var(--color-yellow)',
                  background: 'var(--color-paper)',
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl" aria-hidden="true">🔤</span>
                  <h2
                    className="text-xl font-bold leading-tight"
                    style={{ fontFamily: "'Gaegu', cursive" }}
                  >
                    Words & Vocabulary
                  </h2>
                  <span
                    className="sketch-badge text-xs"
                    style={{ background: 'var(--color-yellow)' }}
                  >
                    {words.length}
                  </span>
                </div>

                <button
                  onClick={() => setShowWordForm((prev) => !prev)}
                  className={`sketch-btn sketch-btn-sm ${
                    showWordForm ? 'sketch-btn-secondary' : 'sketch-btn-primary'
                  }`}
                  aria-expanded={showWordForm}
                  aria-label={showWordForm ? 'Collapse save word panel' : 'Add new word'}
                >
                  {showWordForm ? '▲ Collapse' : '➕ Add Word'}
                </button>
              </div>

              {/* Collapsible Word Form */}
              {showWordForm && (
                <WordForm
                  onSubmit={async (data) => {
                    const ok = await handleCreateWord(data);
                    if (ok) setShowWordForm(false);
                    return ok;
                  }}
                  loading={wordSaving}
                  onCollapse={() => setShowWordForm(false)}
                />
              )}

              {/* Words Table & Filter */}
              <WordList
                words={words}
                onUpdate={handleUpdateWord}
                onDelete={handleDeleteWord}
                onAddWord={() => setShowWordForm(true)}
                isAddingWord={showWordForm}
              />
            </section>
          )}

          {/* ─── NOTES SECTION ─────────────────────────────── */}
          {(viewFilter === 'both' || viewFilter === 'notes') && (
            <section
              className="space-y-4"
              aria-label="Notes and Quotes section"
            >
              {/* Notes Section Header */}
              <div
                className="flex items-center justify-between p-3.5 sketch-card border-l-[6px]"
                style={{
                  borderLeftColor: 'var(--color-pink)',
                  background: 'var(--color-paper)',
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl" aria-hidden="true">📝</span>
                  <h2
                    className="text-xl font-bold leading-tight"
                    style={{ fontFamily: "'Gaegu', cursive" }}
                  >
                    Notes & Quotes
                  </h2>
                  <span
                    className="sketch-badge text-xs"
                    style={{ background: 'var(--color-pink)' }}
                  >
                    {notes.length}
                  </span>
                </div>

                <button
                  onClick={() => setCreatingNote((prev) => !prev)}
                  className={`sketch-btn sketch-btn-sm ${
                    creatingNote ? 'sketch-btn-secondary' : 'sketch-btn-primary'
                  }`}
                  style={{
                    background: creatingNote ? undefined : 'var(--color-pink)',
                  }}
                  aria-expanded={creatingNote}
                  aria-label={creatingNote ? 'Collapse note panel' : 'Write new note'}
                >
                  {creatingNote ? '▲ Collapse' : '📝 Write Note'}
                </button>
              </div>

              {/* Collapsible Notes Form & List */}
              <NoteList
                notes={notes}
                onCreate={handleCreateNote}
                onUpdate={handleUpdateNote}
                onDelete={handleDeleteNote}
                creating={creatingNote}
                setCreating={setCreatingNote}
                hideTrigger={true}
              />
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
