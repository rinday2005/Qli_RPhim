import express from 'express';
import { register, login, superAdminTest, userTest } from '../controllers/auth.js';
import { protect, admin } from '../middlewares/auth.js';

const router = express.Router();

// Routes auth
router.post('/register', register);
router.post('/login', login);

// Test phân quyền
router.get('/superadmin-test', protect, admin, superAdminTest);
router.get('/user-test', protect, userTest);

export default router;
