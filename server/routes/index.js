import express from 'express';
import clientRoutes from './client.js';
import employeRoutes from './employe.js';
import agenceRoutes from './agence.js';
import authRouter from './authRouter.js';

const router = express.Router();

router.use('/client', clientRoutes);
router.use('/employe', employeRoutes);
router.use('/agence', agenceRoutes);
router.use('/login', authRouter);

export default router;
