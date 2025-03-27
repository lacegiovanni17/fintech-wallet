import Account from "../models/account.model";

class AccountService {
  static async getBalance(userId: string) {
    const account = await Account.findOne({ where: { userId } });
    return account ? account.balance : 0;
  }
}

export default AccountService;
