import * as booksService from '../services/books.service.js';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';

const createSchema = z.object({
  title: z.string().trim().min(1).max(200),
  author: z.string().trim().max(150).optional().default(''),
});

const updateSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  author: z.string().trim().max(150).optional(),
});

export const validateCreate = validate(createSchema);
export const validateUpdate = validate(updateSchema);

export async function listBooks(req, res, next) {
  try {
    const books = await booksService.getAllBooks();
    res.json({ data: books });
  } catch (err) {
    next(err);
  }
}

export async function getBook(req, res, next) {
  try {
    const book = await booksService.getBook(req.params.bookId);
    res.json({ data: book });
  } catch (err) {
    next(err);
  }
}

export async function createBook(req, res, next) {
  try {
    const book = await booksService.createBook(req.body);
    res.status(201).json({ data: book });
  } catch (err) {
    next(err);
  }
}

export async function updateBook(req, res, next) {
  try {
    const book = await booksService.updateBook(req.params.bookId, req.body);
    res.json({ data: book });
  } catch (err) {
    next(err);
  }
}

export async function deleteBook(req, res, next) {
  try {
    await booksService.deleteBook(req.params.bookId);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
