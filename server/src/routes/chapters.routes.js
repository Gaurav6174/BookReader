import { Router } from 'express';
import * as ctrl from '../controllers/chapters.controller.js';

const router = Router({ mergeParams: true });

// /api/books/:bookId/chapters
router.get('/', ctrl.listChapters);
router.post('/', ctrl.validateCreate, ctrl.createChapter);

// /api/chapters/:chapterId
router.get('/:chapterId', ctrl.getChapter);
router.patch('/:chapterId', ctrl.validateUpdate, ctrl.updateChapter);
router.delete('/:chapterId', ctrl.deleteChapter);

export default router;
