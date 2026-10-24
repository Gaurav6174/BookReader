import { Router } from 'express';
import * as ctrl from '../controllers/books.controller.js';

const router = Router();

router.get('/', ctrl.listBooks);
router.post('/', ctrl.validateCreate, ctrl.createBook);
router.get('/:bookId', ctrl.getBook);
router.patch('/:bookId', ctrl.validateUpdate, ctrl.updateBook);
router.delete('/:bookId', ctrl.deleteBook);

export default router;
