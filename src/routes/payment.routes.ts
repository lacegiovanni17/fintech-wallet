import express from 'express';
import { addFunds, confirmPayment, getAllPayments, getPaymentById } from '../controllers/payment.controller';
import { authenticateUser } from '../middlewares/auth.middleware';

const router = express.Router();

router.get("/", authenticateUser, getAllPayments)
router.get("/:id", authenticateUser, getPaymentById)
router.post("/addfunds", authenticateUser, addFunds)
router.post("/confirm", authenticateUser, confirmPayment)

export default router;