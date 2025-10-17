import { Router, Request, Response } from 'express';
import { authController } from './auth.controller';
import { registerSchema } from './dto/auth.dto';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router()

const authcontroller = new authController()

router.post('/auth/register', (req: Request<{}, {}, registerSchema>, res: Response) => authcontroller.signUp(req, res))
router.post('/auth/login', (req: Request<{}, {}, registerSchema>, res: Response) => authcontroller.signIn(req, res))

router.get('/users', authMiddleware, (req: Request, res: Response) => authcontroller.getAll(req, res))
router.get('/users/:id', authMiddleware, (req: Request, res: Response) => authcontroller.getById(req, res))

router.put('/users/:id', authMiddleware, (req: Request, res: Response) => authcontroller.upDate(req, res))
router.delete('/remove/:id', authMiddleware, (req: Request, res: Response) => authcontroller.remove(req, res))

export default router