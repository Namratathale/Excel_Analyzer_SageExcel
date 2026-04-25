import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js'; // <-- Import loginUser

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser); // <-- Add this line for the login route

export default router;
