import express, { Request, Response, NextFunction } from 'express';
const router = express.Router();
import { userRoutes } from './users'
import { auth } from './auth'
import { project} from "./projects"
import bugRoutes from './bugs';
/* GET home page. */
router.get('/', function(_req: Request, res: Response, _next: NextFunction) {
  res.render('index', { title: 'Chat App' });
});

router.use('/api/v1', userRoutes)
router.use('/api/v1', auth);
router.use('/api/v1', project)
router.use('/api/v1', bugRoutes)

export { router as routes };
