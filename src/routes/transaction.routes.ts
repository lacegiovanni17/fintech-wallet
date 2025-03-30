import express from 'express';
import { deleteTransaction, deleteUserTransaction, getAllTransactions, getTransactionById, getUserTransactionHistory, processTransaction, transferFunds, updateTransactionStatus } from '../controllers/transaction.controller';
import { authenticateUser } from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/', authenticateUser, getAllTransactions)
router.get("/:id", authenticateUser, getTransactionById)
router.get('/history/:userId', authenticateUser, getUserTransactionHistory)
router.post("/transfer", authenticateUser, transferFunds)
router.post("/process", authenticateUser, processTransaction)
router.patch("/:id/status", authenticateUser, updateTransactionStatus)
router.delete("/:userId", authenticateUser, deleteUserTransaction)
router.delete("/:id", authenticateUser, deleteTransaction)


export default router;