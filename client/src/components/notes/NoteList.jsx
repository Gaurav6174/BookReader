import NoteCard from './NoteCard.jsx';

/**
 * NoteList — clean, distraction-free list of notes without boxy borders or headers.
 */
export default function NoteList({ notes, onUpdate, onDelete, creating = false }) {
  if (notes.length === 0) {
    if (creating) return null;
    return (
      <div className="py-6 text-white/40 text-sm" style={{ fontFamily: "'Patrick Hand', cursive" }}>
        No notes saved yet. Click the <span className="text-white/70 font-bold">+</span> below to add your first note.
      </div>
    );
  }

  return (
    <div className="animate-fade-in divide-y divide-white/5">
      {notes.map((note) => (
        <NoteCard key={note._id} note={note} onUpdate={onUpdate} onDelete={onDelete} />
      ))}
    </div>
  );
}
