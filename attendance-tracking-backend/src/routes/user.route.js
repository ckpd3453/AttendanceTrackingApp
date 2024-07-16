import * as userController from '../controllers/user.controller'
import { Router } from 'express';

const router = Router();

router.post('/register', userController.createUser);

router.post('/login', userController.login);

/**
 * Bangalore Office - 12.914730049005604, 77.63863333929582
 * Mumbai Office - 19.050698767226656, 72.91586264394981
 */

export default router;
