import { Router } from 'express';
import {
  register,
  login,
  me,
  validateRegister,
  validateLogin,
} from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/me', requireAuth, me);

export default router;
