import Book from '../models/Book.js';
import Chapter from '../models/Chapter.js';
import Word from '../models/Word.js';
import Note from '../models/Note.js';
import { notFoundError, assertValidId } from '../middleware/validate.js';

export async function getAllBooks(userId) {
  if (!userId) return [];
  const query = { userId };
  const books = await Book.find(query).sort({ createdAt: -1 }).lean();
  if (books.length === 0) return [];

  const bookIds = books.map((b) => b._id);

  // Single parallel batch aggregation for all books at once
  const [chapterCounts, wordCounts, noteCounts] = await Promise.all([
    Chapter.aggregate([
      { $match: { bookId: { $in: bookIds } } },
      { $group: { _id: '$bookId', count: { $sum: 1 } } },
    ]),
    Word.aggregate([
      { $match: { bookId: { $in: bookIds } } },
      { $group: { _id: '$bookId', count: { $sum: 1 } } },
    ]),
    Note.aggregate([
      { $match: { bookId: { $in: bookIds } } },
      { $group: { _id: '$bookId', count: { $sum: 1 } } },
    ]),
  ]);

  const chMap = new Map(chapterCounts.map((c) => [c._id.toString(), c.count]));
  const wordMap = new Map(wordCounts.map((w) => [w._id.toString(), w.count]));
  const noteMap = new Map(noteCounts.map((n) => [n._id.toString(), n.count]));

  return books.map((b) => ({
    ...b,
    chapterCount: chMap.get(b._id.toString()) || 0,
    wordCount: wordMap.get(b._id.toString()) || 0,
    noteCount: noteMap.get(b._id.toString()) || 0,
  }));
}

export async function getBook(bookId, userId) {
  assertValidId(bookId, 'bookId');
  if (!userId) throw notFoundError(`Book not found: ${bookId}`);
  const query = { _id: bookId, userId };
  const book = await Book.findOne(query);
  if (!book) throw notFoundError(`Book not found: ${bookId}`);
  return book;
}

export async function createBook({ title, author, userId }) {
  const book = await Book.create({ title, author, userId });
  return book;
}

export async function updateBook(bookId, { title, author }, userId) {
  assertValidId(bookId, 'bookId');
  const query = { _id: bookId };
  if (userId) query.userId = userId;
  const book = await Book.findOneAndUpdate(
    query,
    { title, author },
    { new: true, runValidators: true }
  );
  if (!book) throw notFoundError(`Book not found: ${bookId}`);
  return book;
}

export async function deleteBook(bookId, userId) {
  assertValidId(bookId, 'bookId');
  const query = { _id: bookId };
  if (userId) query.userId = userId;
  const book = await Book.findOneAndDelete(query);
  if (!book) throw notFoundError(`Book not found: ${bookId}`);

  // Cascade: delete all chapters, words, notes belonging to this book
  const chapters = await Chapter.find({ bookId });
  await Chapter.deleteMany({ bookId });
  await Word.deleteMany({ bookId });
  await Note.deleteMany({ bookId });

  return { deletedChapters: chapters.length };
}
