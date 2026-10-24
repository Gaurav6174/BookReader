import Book from '../models/Book.js';
import Chapter from '../models/Chapter.js';
import Word from '../models/Word.js';
import Note from '../models/Note.js';
import { notFoundError, assertValidId } from '../middleware/validate.js';

export async function getAllBooks(userId) {
  const query = userId ? { userId } : {};
  const books = await Book.find(query).sort({ createdAt: -1 });

  // Attach counts
  const enriched = await Promise.all(
    books.map(async (book) => {
      const [chapterCount, wordCount, noteCount] = await Promise.all([
        Chapter.countDocuments({ bookId: book._id }),
        Word.countDocuments({ bookId: book._id }),
        Note.countDocuments({ bookId: book._id }),
      ]);
      return { ...book.toObject(), chapterCount, wordCount, noteCount };
    })
  );

  return enriched;
}

export async function getBook(bookId, userId) {
  assertValidId(bookId, 'bookId');
  const query = { _id: bookId };
  if (userId) query.userId = userId;
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
