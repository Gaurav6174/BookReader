/**
 * lookup.js — Google define lookup logic isolated here.
 * v2+ can swap in a dictionary API by changing only this file and LookupButton.
 */

export function buildGoogleDefineUrl(word) {
  const w = word.trim();
  if (!w) return null;
  return `https://www.google.com/search?q=define+${encodeURIComponent(w)}`;
}

export function openGoogleLookup(word) {
  const url = buildGoogleDefineUrl(word);
  if (!url) return false;
  window.open(url, '_blank', 'noopener,noreferrer');
  return true;
}
