import { useState } from 'react';
import ConfirmDialog from '../ConfirmDialog.jsx';
import LookupButton from './LookupButton.jsx';
import { openGoogleLookup } from '../../lib/lookup.js';

/**
 * WordRow — a clean, distraction-free word entry without table borders or heavy boxes.
 */
export default function WordRow({ word, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [editWord, setEditWord] = useState(word.word);
  const [editMeaning, setEditMeaning] = useState(word.meaning);
  const [editExample, setEditExample] = useState(word.exampleSentence || '');
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  async function handleSave(e) {
    e.preventDefault();
    const errs = {};
    if (!editWord.trim()) errs.word = 'Word is required';
    if (!editMeaning.trim()) errs.meaning = 'Meaning is required';
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSaving(true);
    const ok = await onUpdate(word._id, {
      word: editWord.trim(),
      meaning: editMeaning.trim(),
      exampleSentence: editExample.trim(),
    });
    setSaving(false);
    if (ok) setEditing(false);
  }

  if (editing) {
    return (
      <div className="py-3 border-b border-white/10 animate-fade-in">
        <form onSubmit={handleSave} noValidate className="space-y-2.5 p-3 bg-white/[0.04] border border-white/15">
          <div className="flex gap-2 flex-wrap items-start">
            <div className="flex-1 min-w-[140px]">
              <input
                value={editWord}
                onChange={(e) => { setEditWord(e.target.value); setErrors((p) => ({ ...p, word: '' })); }}
                className="sketch-input text-sm py-1.5"
                placeholder="Word"
                aria-label="Edit word"
                maxLength={100}
              />
              {errors.word && <p className="error-msg">{errors.word}</p>}
            </div>
            <LookupButton word={editWord} />
          </div>
          <div>
            <textarea
              value={editMeaning}
              onChange={(e) => { setEditMeaning(e.target.value); setErrors((p) => ({ ...p, meaning: '' })); }}
              className="sketch-input text-sm py-1.5"
              rows={2}
              placeholder="Meaning"
              aria-label="Edit meaning"
              maxLength={1000}
            />
            {errors.meaning && <p className="error-msg">{errors.meaning}</p>}
          </div>
          <input
            value={editExample}
            onChange={(e) => setEditExample(e.target.value)}
            className="sketch-input text-sm py-1.5"
            placeholder="Example sentence (optional)"
            aria-label="Edit example sentence"
            maxLength={500}
          />
          <div className="flex gap-2 pt-1">
            <button type="submit" disabled={saving} className="sketch-btn sketch-btn-primary sketch-btn-sm">
              {saving ? '⏳' : '💾 Save'}
            </button>
            <button type="button" onClick={() => setEditing(false)} className="sketch-btn sketch-btn-secondary sketch-btn-sm">
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <>
      <div className="group py-2.5 px-3 -mx-3 rounded-lg border-b border-white/[0.08] hover:bg-white/[0.06] hover:border-white/20 transition-all duration-200">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-3 flex-wrap">
              <span
                className="text-lg font-bold text-white tracking-wide group-hover:text-white transition-colors"
                style={{ fontFamily: "'Gaegu', cursive" }}
              >
                {word.word}
              </span>
              <span
                className="text-sm text-white/80"
                style={{ fontFamily: "'Patrick Hand', cursive" }}
              >
                {word.meaning}
              </span>
            </div>
            {word.exampleSentence && (
              <p
                className="text-xs text-white/45 italic mt-1"
                style={{ fontFamily: "'Patrick Hand', cursive" }}
              >
                "{word.exampleSentence}"
              </p>
            )}
          </div>

          {/* Subtle actions revealed on hover so reader is not distracted */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity shrink-0">
            <button
              onClick={() => openGoogleLookup(word.word)}
              className="p-1.5 text-white/40 hover:text-white rounded-md hover:bg-white/15 hover:scale-110 active:scale-95 transition-all text-xs"
              title={`Look up "${word.word}" on Google`}
              aria-label={`Look up "${word.word}"`}
            >
              🔍
            </button>
            <button
              onClick={() => setEditing(true)}
              className="p-1.5 text-white/40 hover:text-white rounded-md hover:bg-white/15 hover:scale-110 active:scale-95 transition-all text-xs"
              title="Edit word"
              aria-label={`Edit word: ${word.word}`}
            >
              ✏️
            </button>
            <button
              onClick={() => setConfirmOpen(true)}
              className="p-1.5 text-white/40 hover:text-red-400 rounded-md hover:bg-red-500/20 hover:scale-110 active:scale-95 transition-all text-xs"
              title="Delete word"
              aria-label={`Delete word: ${word.word}`}
            >
              🗑️
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete Word?"
        message={`Delete the word "${word.word}" and its meaning?`}
        confirmLabel="Delete"
        onConfirm={() => { setConfirmOpen(false); onDelete(word._id); }}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
