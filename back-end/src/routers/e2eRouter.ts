import { Router } from 'express';

import { resetDatabase, seedDatabase } from '../controllers/e2eControlller.js';

const e2eRouter = Router();

e2eRouter.post('/tests/reset', resetDatabase);
e2eRouter.post('/tests/seed', seedDatabase);

export default e2eRouter;
