import express from 'express';
import logIn from '../../../controllers/features/auth/loginController.js';
import signUp from '../../../controllers/features/auth/signUpController.js';
import verifyToken from '../../../controllers/features/auth/verifyTokenController.js';
import logout from '../../../controllers/features/auth/logoutController.js';

const authRouter = express.Router();

// GET API endpoints for authentication
authRouter.get('/verify', verifyToken);
authRouter.get('/logout', logout)


//POST API endpoints for authentication
authRouter.post('/login', logIn);
authRouter.post('/register', signUp);

export default authRouter;