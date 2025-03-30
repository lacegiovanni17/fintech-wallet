import express from 'express';
import authRoutes from './auth.routes';
// import paymentRoutes from './payment.routes';
// import transactionRoutes from './transaction.routes';
// import walletRoutes from './wallet.routes';

const router = express.Router();

router.use('/users', authRoutes);
// router.use('/payments', paymentRoutes);
// router.use('/transactions', transactionRoutes);
// router.use('/wallets', walletRoutes)

export default router;