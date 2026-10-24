import { useState, useRef, useEffect } from 'react';
import LookupButton from './LookupButton.jsx';
import { openGoogleLookup } from '../../lib/lookup.js';

/**
 * WordForm — add-word area with Word, Lookup, Meaning, Example fields.
 * After successful save: clears fields and focuses Word input.
 */
export default function WordForm({ onSubmit, loading, onCollapse }) {
  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');
  const [example, setExample] = useState('');
  const [errors, setErrors] = useState({});
  const wordRef = useRef(null);
  const meaningRef = useRef(null);

  // Focus word input on mount
  useEffect(() => { wordRef.current?.focus(); }, []);

  // When user comes back to this tab/window with meaning empty, focus it
  useEffect(() => {
    function handleFocus() {
      if (word.trim() && !meaning.trim()) {
        setTimeout(() => meaningRef.current?.focus(), 100);
      }
    }
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [word, meaning]);

  function validate() {
    const errs = {};
    if (!word.trim()) errs.word = 'Word is required';
    if (word.trim().length > 100) errs.word = 'Word must be ≤ 100 characters';
    if (!meaning.trim()) errs.meaning = 'Meaning is required';
    if (meaning.trim().length > 1000) errs.meaning = 'Meaning must be ≤ 1000 characters';
    if (example.trim().length > 500) errs.example = 'Example sentence must be ≤ 500 characters';
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const ok = await onSubmit({ word: word.trim(), meaning: meaning.trim(), exampleSentence: example.trim() });
    if (ok) {
      setWord('');
      setMeaning('');
      setExample('');
      setErrors({});
      if (onCollapse) {
        onCollapse();
      } else {
        wordRef.current?.focus();
      }
    }
  }

  // Enter in word input triggers lookup if word is non-empty per Section 7.3
  function handleWordKeyDown(e) {
    if (e.key === 'Enter' && word.trim()) {
      e.preventDefault();
      openGoogleLookup(word.trim());
      meaningRef.current?.focus();
    }
  }

  // Ctrl/Cmd+Enter in meaning saves
  function handleMeaningKeyDown(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label="Add a new word"
      className="sketch-card mb-6 animate-fade-in"
      style={{ borderLeft: '6px solid var(--color-yellow)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg" style={{ fontFamily: "'Gaegu', cursive", fontWeight: 700 }}>
          ✍️ Save a Word
        </h3>
        {onCollapse && (
          <button
            type="button"
            onClick={onCollapse}
            className="sketch-btn sketch-btn-secondary sketch-btn-sm"
            aria-label="Collapse save word panel"
            title="Collapse panel"
          >
            ▲ Collapse
          </button>
        )}
      </div>

      {/* Word + Lookup row */}
      <div className="mb-3">
        <label htmlFor="word-input" className="block text-sm mb-1 font-medium">
          Word <span aria-hidden="true" className="text-red-500">*</span>
        </label>
        <div className="flex gap-2 flex-wrap">
          <input
            id="word-input"
            ref={wordRef}
            type="text"
            value={word}
            onChange={(e) => { setWord(e.target.value); setErrors((p) => ({ ...p, word: '' })); }}
            onKeyDown={handleWordKeyDown}
            className="sketch-input flex-1"
            placeholder="e.g. ephemeral"
            aria-required="true"
            aria-describedby={errors.word ? 'word-err' : undefined}
            maxLength={100}
            autoComplete="off"
          />
          <LookupButton word={word} />
        </div>
        {errors.word && <p id="word-err" className="error-msg" role="alert">{errors.word}</p>}
      </div>

      {/* Meaning */}
      <div className="mb-3">
        <label htmlFor="meaning-input" className="block text-sm mb-1 font-medium">
          Meaning <span aria-hidden="true" className="text-red-500">*</span>
          <span className="muted text-xs ml-2">(Ctrl+Enter to save)</span>
        </label>
        <textarea
          id="meaning-input"
          ref={meaningRef}
          value={meaning}
          onChange={(e) => { setMeaning(e.target.value); setErrors((p) => ({ ...p, meaning: '' })); }}
          onKeyDown={handleMeaningKeyDown}
          className="sketch-input"
          placeholder="Paste or type the meaning here…"
          rows={3}
          aria-required="true"
          aria-describedby={errors.meaning ? 'meaning-err' : undefined}
          maxLength={1000}
        />
        {errors.meaning && <p id="meaning-err" className="error-msg" role="alert">{errors.meaning}</p>}
      </div>

      {/* Example sentence */}
      <div className="mb-4">
        <label htmlFor="example-input" className="block text-sm mb-1">
          Example sentence from the book <span className="muted">(optional)</span>
        </label>
        <input
          id="example-input"
          type="text"
          value={example}
          onChange={(e) => { setExample(e.target.value); setErrors((p) => ({ ...p, example: '' })); }}
          className="sketch-input"
          placeholder="The sentence where you found the word…"
          maxLength={500}
          aria-describedby={errors.example ? 'example-err' : undefined}
        />
        {errors.example && <p id="example-err" className="error-msg" role="alert">{errors.example}</p>}
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={loading} className="sketch-btn sketch-btn-primary">
          {loading ? '⏳ Saving…' : '💾 Save Word'}
        </button>
        {onCollapse && (
          <button
            type="button"
            onClick={onCollapse}
            className="sketch-btn sketch-btn-secondary"
            aria-label="Collapse save word panel"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
