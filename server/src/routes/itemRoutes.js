import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { body } from 'express-validator';
import {
  createItem,
  deleteItem,
  findMatches,
  getItems,
  getMyItems,
  updateItem
} from '../controllers/itemController.js';
import { auth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();
const storage = multer.diskStorage({
  destination: 'src/uploads',
  filename: (req, file, cb) => cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`)
});
const upload = multer({ storage });

const itemValidators = [
  body('title').notEmpty(),
  body('description').notEmpty(),
  body('category').isIn(['electronics', 'documents', 'pets', 'accessories', 'other']),
  body('status').isIn(['lost', 'found', 'claimed']),
  body('latitude').isFloat(),
  body('longitude').isFloat()
];

router.get('/', getItems);
router.get('/mine', auth, getMyItems);
router.get('/:id/matches', auth, findMatches);
router.post('/', auth, upload.single('image'), itemValidators, validate, createItem);
router.put('/:id', auth, upload.single('image'), updateItem);
router.delete('/:id', auth, deleteItem);

export default router;
