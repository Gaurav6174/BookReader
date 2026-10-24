import Word from '../models/Word.js';
import Chapter from '../models/Chapter.js';
import { notFoundError, conflictError, assertValidId } from '../middleware/validate.js';

export async function getWords(chapterId) {
  assertValidId(chapterId, 'chapterId');
  return Word.find({ chapterId }).sort({ createdAt: -1 });
}

export async function createWord(chapterId, _unusedBookId, { word, meaning, exampleSentence }) {
  assertValidId(chapterId, 'chapterId');

  const chapter = await Chapter.findById(chapterId);
  if (!chapter) throw notFoundError(`Chapter not found: ${chapterId}`);

  // bookId is always taken from the chapter — never from the request body
  const bookId = chapter.bookId;

  // Duplicate check (case-insensitive)
  const wordLower = word.trim().toLowerCase();
  const existing = await Word.findOne({ chapterId, wordLower });
  if (existing) throw conflictError('This word is already saved in this chapter.');

  const newWord = await Word.create({ chapterId, bookId, word, meaning, exampleSentence, wordLower });
  return newWord;
}

export async function updateWord(wordId, { word, meaning, exampleSentence }) {
  assertValidId(wordId, 'wordId');
  const existing = await Word.findById(wordId);
  if (!existing) throw notFoundError(`Word not found: ${wordId}`);

  // Duplicate check if word is being changed
  if (word) {
    const wordLower = word.trim().toLowerCase();
    if (wordLower !== existing.wordLower) {
      const dup = await Word.findOne({ chapterId: existing.chapterId, wordLower });
      if (dup) throw conflictError('This word is already saved in this chapter.');
    }
  }

  const updated = await Word.findByIdAndUpdate(
    wordId,
    { word, meaning, exampleSentence },
    { new: true, runValidators: true }
  );
  return updated;
}

export async function deleteWord(wordId) {
  assertValidId(wordId, 'wordId');
  const word = await Word.findByIdAndDelete(wordId);
  if (!word) throw notFoundError(`Word not found: ${wordId}`);
  return word;
}
