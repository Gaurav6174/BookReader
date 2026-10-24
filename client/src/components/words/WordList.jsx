import { useState } from 'react';
import WordRow from './WordRow.jsx';
import EmptyState from '../EmptyState.jsx';

/**
 * WordList — table of saved words with search filter.
 */
export default function WordList({ words, onUpdate, onDelete, onAddWord, isAddingWord = false }) {
  const [filter, setFilter] = useState('');

  const filtered = filter.trim()
    ? words.filter(
        (w) =>
          w.word.toLowerCase().includes(filter.toLowerCase()) ||
          w.meaning.toLowerCase().includes(filter.toLowerCase())
      )
    : words;

  if (words.length === 0) {
    if (isAddingWord) {
      return null;
    }
    return (
      <EmptyState
        icon="📖"
        title="No words yet"
        message="Type a word to start building your vocabulary list."
        action={
          onAddWord ? (
            <button onClick={onAddWord} className="sketch-btn sketch-btn-primary">
              ➕ Add First Word
            </button>
          ) : null
        }
      />
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Search filter */}
      <div className="mb-3">
        <label htmlFor="word-filter" className="sr-only">Filter words</label>
        <input
          id="word-filter"
          type="search"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="sketch-input"
          placeholder="🔎 Filter words…"
          aria-label="Filter saved words"
        />
      </div>

      {filtered.length === 0 && (
        <p className="text-center muted py-8" style={{ fontFamily: "'Patrick Hand', cursive" }}>
          No words match "<strong>{filter}</strong>"
        </p>
      )}

      {filtered.length > 0 && (
        <div className="overflow-x-auto">
          <table className="word-table" aria-label="Saved words">
            <thead>
              <tr>
                <th scope="col">Word</th>
                <th scope="col">Meaning</th>
                <th scope="col">Example Sentence</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((w) => (
                <WordRow key={w._id} word={w} onUpdate={onUpdate} onDelete={onDelete} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
