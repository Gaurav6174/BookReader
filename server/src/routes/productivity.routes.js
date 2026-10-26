import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import Book from '../models/Book.js';
import Chapter from '../models/Chapter.js';
import Word from '../models/Word.js';
import Note from '../models/Note.js';

const router = Router();

router.get('/stats', requireAuth, async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Find all book IDs belonging to this user
    const books = await Book.find({ userId }).select('_id title').lean();
    const bookIds = books.map((b) => b._id);

    if (bookIds.length === 0) {
      return res.json({
        data: {
          booksCount: 0,
          chaptersCount: 0,
          wordsCount: 0,
          notesCount: 0,
          recentWords: [],
          recentNotes: [],
        },
      });
    }

    const [chaptersCount, wordsCount, notesCount, recentWords, recentNotes] =
      await Promise.all([
        Chapter.countDocuments({ bookId: { $in: bookIds } }),
        Word.countDocuments({ bookId: { $in: bookIds } }),
        Note.countDocuments({ bookId: { $in: bookIds } }),
        Word.find({ bookId: { $in: bookIds } })
          .sort({ createdAt: -1 })
          .limit(6)
          .select('word meaning createdAt bookId')
          .lean(),
        Note.find({ bookId: { $in: bookIds } })
          .sort({ createdAt: -1 })
          .limit(6)
          .select('content pageNumber createdAt bookId')
          .lean(),
      ]);

    res.json({
      data: {
        booksCount: books.length,
        chaptersCount,
        wordsCount,
        notesCount,
        recentWords,
        recentNotes,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
