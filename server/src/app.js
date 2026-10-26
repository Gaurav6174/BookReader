import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import booksRouter from './routes/books.routes.js';
import chaptersRouter from './routes/chapters.routes.js';
import wordsRouter from './routes/words.routes.js';
import notesRouter from './routes/notes.routes.js';
import authRouter from './routes/auth.routes.js';
import productivityRouter from './routes/productivity.routes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';
import { optionalAuth } from './middleware/auth.js';

export function createApp({ clientOrigin }) {
  const app = express();

  // Security & logging
  app.use(helmet());
  app.use(morgan('dev'));
  app.use(cors({ origin: clientOrigin, optionsSuccessStatus: 200 }));
  app.use(express.json());

  // Health check
  app.get('/api/health', (req, res) => res.json({ status: 'ok', ts: new Date().toISOString() }));

  // Authentication routes
  app.use('/api/auth', authRouter);

  // Attach user if token is present
  app.use(optionalAuth);

  // Routes
  app.use('/api/books', booksRouter);

  // Chapters: nested under books AND standalone for PATCH/DELETE
  app.use('/api/books/:bookId/chapters', chaptersRouter);
  app.use('/api/chapters', chaptersRouter);

  // Words: nested under chapters AND standalone
  app.use('/api/chapters/:chapterId/words', wordsRouter);
  app.use('/api/words', wordsRouter);

  // Notes: nested under chapters AND standalone
  app.use('/api/chapters/:chapterId/notes', notesRouter);
  app.use('/api/notes', notesRouter);

  // Productivity stats
  app.use('/api/productivity', productivityRouter);

  // 404 and error handlers (must be last)
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
