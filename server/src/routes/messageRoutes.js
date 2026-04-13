import { Router } from 'express';
import { body } from 'express-validator';
import { getMyMessages, sendMessage } from '../controllers/messageController.js';
import { auth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

router.get('/', auth, getMyMessages);
router.post('/', auth, [body('itemId').notEmpty(), body('content').isLength({ min: 3 })], validate, sendMessage);

export default router;
