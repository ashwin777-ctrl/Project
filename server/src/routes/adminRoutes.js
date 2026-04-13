import { Router } from 'express';
import { deleteUser, getAllItemsAdmin, getUsers } from '../controllers/adminController.js';
import { adminOnly, auth } from '../middleware/auth.js';

const router = Router();

router.use(auth, adminOnly);
router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);
router.get('/items', getAllItemsAdmin);

export default router;
