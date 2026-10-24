import { openGoogleLookup } from '../../lib/lookup.js';

/**
 * LookupButton — isolated per spec Section 8.
 * Only calls openGoogleLookup. No other lookup knowledge here.
 */
export default function LookupButton({ word, onLookupDone }) {
  const trimmed = word.trim();
  const disabled = !trimmed;

  function handleClick() {
    const opened = openGoogleLookup(trimmed);
    if (opened && onLookupDone) onLookupDone();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className="sketch-btn sketch-btn-lookup whitespace-nowrap"
      aria-label={disabled ? 'Type a word first to look it up' : `Look up "${trimmed}" on Google`}
      title={disabled ? 'Type a word first' : `Search Google: define ${trimmed}`}
    >
      🔍 Look up on Google
    </button>
  );
}
