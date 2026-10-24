import Book from '../models/Book.js';
import Chapter from '../models/Chapter.js';
import Word from '../models/Word.js';
import Note from '../models/Note.js';
import { notFoundError, assertValidId } from '../middleware/validate.js';

export async function getAllBooks() {
  const books = await Book.find().sort({ createdAt: -1 });

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

export async function getBook(bookId) {
  assertValidId(bookId, 'bookId');
  const book = await Book.findById(bookId);
  if (!book) throw notFoundError(`Book not found: ${bookId}`);
  return book;
}

export async function createBook({ title, author }) {
  const book = await Book.create({ title, author });
  return book;
}

export async function updateBook(bookId, { title, author }) {
  assertValidId(bookId, 'bookId');
  const book = await Book.findByIdAndUpdate(
    bookId,
    { title, author },
    { new: true, runValidators: true }
  );
  if (!book) throw notFoundError(`Book not found: ${bookId}`);
  return book;
}

export async function deleteBook(bookId) {
  assertValidId(bookId, 'bookId');
  const book = await Book.findByIdAndDelete(bookId);
  if (!book) throw notFoundError(`Book not found: ${bookId}`);

  // Cascade: delete all chapters, words, notes belonging to this book
  const chapters = await Chapter.find({ bookId });
  await Chapter.deleteMany({ bookId });
  await Word.deleteMany({ bookId });
  await Note.deleteMany({ bookId });

  return { deletedChapters: chapters.length };
}
