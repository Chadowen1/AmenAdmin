import express from 'express';
import clientRoutes from './client.js';
import employeRoutes from './employe.js';
import agenceRoutes from './agence.js';
import authRouter from './authRouter.js';
import requireAuth from '../middleware/authMiddleware.js';

const router = express.Router();

router.use('/client', requireAuth, clientRoutes);
router.use('/employe', employeRoutes);
router.use('/agence', requireAuth ,agenceRoutes);
router.use('/', authRouter);

export default router;
