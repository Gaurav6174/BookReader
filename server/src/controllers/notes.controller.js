import * as notesService from '../services/notes.service.js';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';

const createSchema = z.object({
  content: z.string().trim().min(1).max(5000),
  pageNumber: z.number().int().min(1).nullable().optional(),
});

const updateSchema = z.object({
  content: z.string().trim().min(1).max(5000).optional(),
  pageNumber: z.number().int().min(1).nullable().optional(),
});

export const validateCreate = validate(createSchema);
export const validateUpdate = validate(updateSchema);

export async function listNotes(req, res, next) {
  try {
    const notes = await notesService.getNotes(req.params.chapterId);
    res.json({ data: notes });
  } catch (err) {
    next(err);
  }
}

export async function createNote(req, res, next) {
  try {
    const note = await notesService.createNote(req.params.chapterId, null, req.body);
    res.status(201).json({ data: note });
  } catch (err) {
    next(err);
  }
}

export async function updateNote(req, res, next) {
  try {
    const note = await notesService.updateNote(req.params.noteId, req.body);
    res.json({ data: note });
  } catch (err) {
    next(err);
  }
}

export async function deleteNote(req, res, next) {
  try {
    await notesService.deleteNote(req.params.noteId);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
