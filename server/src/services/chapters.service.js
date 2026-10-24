import Chapter from '../models/Chapter.js';
import Word from '../models/Word.js';
import Note from '../models/Note.js';
import Book from '../models/Book.js';
import { notFoundError, assertValidId } from '../middleware/validate.js';

export async function getChapters(bookId) {
  assertValidId(bookId, 'bookId');
  const chapters = await Chapter.find({ bookId }).sort({ order: 1 }).lean();
  if (chapters.length === 0) return [];

  const chapterIds = chapters.map((c) => c._id);

  // Single parallel batch aggregation for all chapters of this book
  const [wordCounts, noteCounts] = await Promise.all([
    Word.aggregate([
      { $match: { chapterId: { $in: chapterIds } } },
      { $group: { _id: '$chapterId', count: { $sum: 1 } } },
    ]),
    Note.aggregate([
      { $match: { chapterId: { $in: chapterIds } } },
      { $group: { _id: '$chapterId', count: { $sum: 1 } } },
    ]),
  ]);

  const wordMap = new Map(wordCounts.map((w) => [w._id.toString(), w.count]));
  const noteMap = new Map(noteCounts.map((n) => [n._id.toString(), n.count]));

  return chapters.map((ch) => ({
    ...ch,
    wordCount: wordMap.get(ch._id.toString()) || 0,
    noteCount: noteMap.get(ch._id.toString()) || 0,
  }));
}

export async function getChapter(chapterId) {
  assertValidId(chapterId, 'chapterId');
  const chapter = await Chapter.findById(chapterId);
  if (!chapter) throw notFoundError(`Chapter not found: ${chapterId}`);

  const book = await Book.findById(chapter.bookId).select('_id title').lean();
  return { ...chapter.toObject(), book };
}

export async function createChapter(bookId, { title }) {
  assertValidId(bookId, 'bookId');
  const bookExists = await Book.findById(bookId);
  if (!bookExists) throw notFoundError(`Book not found: ${bookId}`);

  // Auto-assign order = max existing order + 1
  const last = await Chapter.findOne({ bookId }).sort({ order: -1 });
  const order = last ? last.order + 1 : 1;

  const chapter = await Chapter.create({ bookId, title, order });
  return chapter;
}

export async function updateChapter(chapterId, { title }) {
  assertValidId(chapterId, 'chapterId');
  const chapter = await Chapter.findByIdAndUpdate(
    chapterId,
    { title },
    { new: true, runValidators: true }
  );
  if (!chapter) throw notFoundError(`Chapter not found: ${chapterId}`);
  return chapter;
}

export async function deleteChapter(chapterId) {
  assertValidId(chapterId, 'chapterId');
  const chapter = await Chapter.findByIdAndDelete(chapterId);
  if (!chapter) throw notFoundError(`Chapter not found: ${chapterId}`);

  // Cascade: delete words and notes in this chapter
  await Promise.all([
    Word.deleteMany({ chapterId }),
    Note.deleteMany({ chapterId }),
  ]);

  return chapter;
}
