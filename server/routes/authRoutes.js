import express from 'express';
import { register, login, logout, sendVerifyOtp, verifyEmail, isAuthenticated, sendResetOtp, resetPassword } from '../controllers/authController.js';
import userAuth from '../middleware/userAuth.js';

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);  // Fixed the typo ('login' instead of 'login')
authRouter.post('/logout', logout);  // Fixed the typo ('logout' instead of 'logout')
authRouter.post('/send-verify-otp',userAuth,sendVerifyOtp);
authRouter.post('/verify-account',userAuth,verifyEmail);
authRouter.get('/is-auth',userAuth,isAuthenticated)
authRouter.post('/send-reset-otp',sendResetOtp);
authRouter.post('/reset-password',resetPassword);

// Export the router
export default authRouter
