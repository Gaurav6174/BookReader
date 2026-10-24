import { Router } from 'express';
import * as ctrl from '../controllers/words.controller.js';

const router = Router({ mergeParams: true });

// /api/chapters/:chapterId/words
router.get('/', ctrl.listWords);
router.post('/', ctrl.validateCreate, ctrl.createWord);

// /api/words/:wordId
router.patch('/:wordId', ctrl.validateUpdate, ctrl.updateWord);
router.delete('/:wordId', ctrl.deleteWord);

export default router;
