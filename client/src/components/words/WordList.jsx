import { useState } from 'react';
import WordRow from './WordRow.jsx';

/**
 * WordList — clean, distraction-free list of saved words without table borders.
 */
export default function WordList({ words, onUpdate, onDelete, isAddingWord = false }) {
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
      <div className="py-6 text-white/40 text-sm" style={{ fontFamily: "'Patrick Hand', cursive" }}>
        No words saved yet. Click the <span className="text-white/70 font-bold">+</span> below to add your first word.
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Optional quiet filter only if there are several words */}
      {words.length > 5 && (
        <div className="mb-2">
          <input
            type="search"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full bg-transparent border-b border-white/10 text-xs py-1 px-0 text-white placeholder-white/30 outline-none focus:border-white/30 transition-colors"
            placeholder="Filter words…"
            aria-label="Filter saved words"
            style={{ fontFamily: "'Patrick Hand', cursive" }}
          />
        </div>
      )}

      {filtered.length === 0 && (
        <p className="text-center text-white/40 py-6 text-sm" style={{ fontFamily: "'Patrick Hand', cursive" }}>
          No words match "<strong>{filter}</strong>"
        </p>
      )}

      {filtered.length > 0 && (
        <div className="divide-y divide-white/5">
          {filtered.map((w) => (
            <WordRow key={w._id} word={w} onUpdate={onUpdate} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
