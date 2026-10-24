import { Router } from 'express';
import * as ctrl from '../controllers/notes.controller.js';

const router = Router({ mergeParams: true });

// /api/chapters/:chapterId/notes
router.get('/', ctrl.listNotes);
router.post('/', ctrl.validateCreate, ctrl.createNote);

// /api/notes/:noteId
router.patch('/:noteId', ctrl.validateUpdate, ctrl.updateNote);
router.delete('/:noteId', ctrl.deleteNote);

export default router;
