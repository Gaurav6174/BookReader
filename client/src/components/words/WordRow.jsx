import { useState } from 'react';
import ConfirmDialog from '../ConfirmDialog.jsx';
import LookupButton from './LookupButton.jsx';

/**
 * WordRow — a single row in the word table. Supports inline editing.
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
      <tr>
        <td colSpan={4} className="p-3">
          <form onSubmit={handleSave} noValidate className="space-y-2">
            <div className="flex gap-2 flex-wrap items-start">
              <div className="flex-1 min-w-[140px]">
                <input
                  value={editWord}
                  onChange={(e) => { setEditWord(e.target.value); setErrors((p) => ({ ...p, word: '' })); }}
                  className="sketch-input text-sm"
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
                className="sketch-input text-sm"
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
              className="sketch-input text-sm"
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
        </td>
      </tr>
    );
  }

  return (
    <>
      <tr className="group">
        <td className="font-bold" style={{ fontFamily: "'Gaegu', cursive" }}>{word.word}</td>
        <td>{word.meaning}</td>
        <td className="muted text-xs italic">{word.exampleSentence || '—'}</td>
        <td>
          <div className="flex gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setEditing(true)}
              className="sketch-btn sketch-btn-secondary sketch-btn-sm"
              aria-label={`Edit word: ${word.word}`}
            >
              ✏️
            </button>
            <button
              onClick={() => setConfirmOpen(true)}
              className="sketch-btn sketch-btn-danger sketch-btn-sm"
              aria-label={`Delete word: ${word.word}`}
            >
              🗑️
            </button>
          </div>
        </td>
      </tr>

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
