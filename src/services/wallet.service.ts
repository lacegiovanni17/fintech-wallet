import sequelize from "../config/db";
import { Wallet } from "../models/wallet";

export interface FundWalletInput {
    userId: string;
    amount: number;
}

export interface WithdrawFundsInput {
    userId: string;
    amount: number;
}

export const walletService = {
    async fundWallet({ userId, amount }: FundWalletInput): Promise<Wallet> {
        const transaction = await sequelize.transaction();
        try {
            let wallet = await Wallet.findOne({ where: { userId }, transaction });
            if (!wallet) {
                wallet = await Wallet.create({ userId, balance: amount }, { transaction });
            } else {
                await wallet.update({ balance: wallet.balance + amount }, { transaction });
            }
            await transaction.commit();
            return wallet;
        } catch (error) {
            await transaction.rollback();
            throw new Error(`❌ Failed to fund wallet: ${error}`);
        }
    },

    async withdrawFunds({ userId, amount }: WithdrawFundsInput): Promise<Wallet> {
        const transaction = await sequelize.transaction();
        try {
            const wallet = await Wallet.findOne({ where: { userId }, transaction });
            if (!wallet || wallet.balance < amount) {
                throw new Error("❌ Insufficient funds or wallet not found");
            }
            await wallet.update({ balance: wallet.balance - amount }, { transaction });
            await transaction.commit();
            return wallet;
        } catch (error) {
            await transaction.rollback();
            throw new Error(`❌ Failed to withdraw funds: ${error}`);
        }
    },

    async findWalletByUserId(userId: string): Promise<Wallet | null> {
        return await Wallet.findOne({ where: { userId } });
    },

    async createWallet(userId: string, initialBalance: number = 0): Promise<Wallet> {
        const transaction = await sequelize.transaction();
        try {
            const wallet = await Wallet.create({ userId, balance: initialBalance }, { transaction });
            await transaction.commit();
            return wallet;
        } catch (error) {
            await transaction.rollback();
            throw new Error(`❌ Failed to create wallet: ${error}`);
        }
    },

    async updateWalletBalance(userId: string, newBalance: number): Promise<Wallet> {
        const transaction = await sequelize.transaction();
        try {
            const wallet = await Wallet.findOne({ where: { userId }, transaction });
            if (!wallet) throw new Error("❌ Wallet not found");
            await wallet.update({ balance: newBalance }, { transaction });
            await transaction.commit();
            return wallet;
        } catch (error) {
            await transaction.rollback();
            throw new Error(`❌ Failed to update wallet balance: ${error}`);
        }
    },

    async getAllWallets(): Promise<Wallet[]> {
        return await Wallet.findAll();
    },

    async deleteWallet(walletId: string): Promise<void> {
        const transaction = await sequelize.transaction();
        try {
            const wallet = await Wallet.findByPk(walletId, { transaction });
            if (!wallet) throw new Error("Wallet not found");
            await wallet.destroy({ transaction });
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw new Error(`❌ Failed to delete wallet: ${error}`);
        }
    },

    async getWalletById(id: string): Promise<Wallet | null> {
        return await Wallet.findByPk(id);
    }
};