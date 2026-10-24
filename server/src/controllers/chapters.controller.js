import * as chaptersService from '../services/chapters.service.js';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';

const createSchema = z.object({
  title: z.string().trim().min(1).max(200),
});

const updateSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
});

export const validateCreate = validate(createSchema);
export const validateUpdate = validate(updateSchema);

export async function listChapters(req, res, next) {
  try {
    const chapters = await chaptersService.getChapters(req.params.bookId);
    res.json({ data: chapters });
  } catch (err) {
    next(err);
  }
}

export async function getChapter(req, res, next) {
  try {
    const chapter = await chaptersService.getChapter(req.params.chapterId);
    res.json({ data: chapter });
  } catch (err) {
    next(err);
  }
}

export async function createChapter(req, res, next) {
  try {
    const chapter = await chaptersService.createChapter(req.params.bookId, req.body);
    res.status(201).json({ data: chapter });
  } catch (err) {
    next(err);
  }
}

export async function updateChapter(req, res, next) {
  try {
    const chapter = await chaptersService.updateChapter(req.params.chapterId, req.body);
    res.json({ data: chapter });
  } catch (err) {
    next(err);
  }
}

export async function deleteChapter(req, res, next) {
  try {
    await chaptersService.deleteChapter(req.params.chapterId);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
