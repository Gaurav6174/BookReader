import * as wordsService from '../services/words.service.js';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';

const createSchema = z.object({
  word: z.string().trim().min(1).max(100),
  meaning: z.string().trim().min(1).max(1000),
  exampleSentence: z.string().trim().max(500).optional().default(''),
});

const updateSchema = z.object({
  word: z.string().trim().min(1).max(100).optional(),
  meaning: z.string().trim().min(1).max(1000).optional(),
  exampleSentence: z.string().trim().max(500).optional(),
});

export const validateCreate = validate(createSchema);
export const validateUpdate = validate(updateSchema);

export async function listWords(req, res, next) {
  try {
    const words = await wordsService.getWords(req.params.chapterId);
    res.json({ data: words });
  } catch (err) {
    next(err);
  }
}

export async function createWord(req, res, next) {
  try {
    // bookId comes from the chapter (looked up inside service), but we need to pass it.
    // We look up the chapter in the service; bookId is fetched there.
    // NOTE: bookId is set server-side from the chapter's bookId — not from the request body.
    const word = await wordsService.createWord(req.params.chapterId, req.chapter?.bookId, req.body);
    res.status(201).json({ data: word });
  } catch (err) {
    next(err);
  }
}

export async function updateWord(req, res, next) {
  try {
    const word = await wordsService.updateWord(req.params.wordId, req.body);
    res.json({ data: word });
  } catch (err) {
    next(err);
  }
}

export async function deleteWord(req, res, next) {
  try {
    await wordsService.deleteWord(req.params.wordId);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
