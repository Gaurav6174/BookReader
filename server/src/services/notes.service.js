import Note from '../models/Note.js';
import Chapter from '../models/Chapter.js';
import { notFoundError, assertValidId } from '../middleware/validate.js';

export async function getNotes(chapterId) {
  assertValidId(chapterId, 'chapterId');
  return Note.find({ chapterId }).sort({ createdAt: 1 });
}

export async function createNote(chapterId, _unusedBookId, { content, pageNumber }) {
  assertValidId(chapterId, 'chapterId');
  const chapter = await Chapter.findById(chapterId);
  if (!chapter) throw notFoundError(`Chapter not found: ${chapterId}`);

  const bookId = chapter.bookId;
  const note = await Note.create({ chapterId, bookId, content, pageNumber: pageNumber || null });
  return note;
}

export async function updateNote(noteId, { content, pageNumber }) {
  assertValidId(noteId, 'noteId');
  const note = await Note.findByIdAndUpdate(
    noteId,
    { content, pageNumber: pageNumber || null },
    { new: true, runValidators: true }
  );
  if (!note) throw notFoundError(`Note not found: ${noteId}`);
  return note;
}

export async function deleteNote(noteId) {
  assertValidId(noteId, 'noteId');
  const note = await Note.findByIdAndDelete(noteId);
  if (!note) throw notFoundError(`Note not found: ${noteId}`);
  return note;
}
