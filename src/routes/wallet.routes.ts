import express from "express";
import { 
    fundWallet, 
    withdrawFunds, 
    findWalletByUserId, 
    createWallet, 
    updateWalletBalance, 
    getAllWallets, 
    getWalletById
} from "../controllers/wallet.controller";
import { authenticateUser } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/", authenticateUser, getAllWallets);
router.get("/:id", authenticateUser, getWalletById);
router.get("/:userId", authenticateUser, findWalletByUserId);
router.post("/fund", authenticateUser, fundWallet);
router.post("/withdraw", authenticateUser, withdrawFunds);
router.post("/create", authenticateUser, createWallet);
router.put("/update/balance", authenticateUser, updateWalletBalance);

export default router;