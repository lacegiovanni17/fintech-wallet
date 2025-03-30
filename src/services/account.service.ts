// import User from "../models/user";
// import { NotFoundException } from "../utils/exceptions/not_found.exception";
// import { IGenericResponseModel } from "../utils/interfaces/generic_response.interface";
// import UtilService from "../utils/services/utils.service";

// class AccountService {
//   private utilService = new UtilService();


//   public async getBalance(userId: string): Promise<IGenericResponseModel<number>> {
//     try {
//       const user = await User.findByPk(userId, { attributes: ["balance"] });

//       if (!user) {
//         throw new NotFoundException("User not found.");
//       }

//       return this.utilService.buildApiResponse({
//         data: user.balance ?? 0,
//         message: "Account balance retrieved successfully.",
//         statusCode: 200,
//       });
//     } catch (error:any) {
//       throw error;
//     }
//   }

//   // /**
//   //  * Update user balance.
//   //  * @param userId - The user's unique identifier.
//   //  * @param amount - The amount to credit or debit.
//   //  * @param isCredit - A boolean indicating if the operation is a credit or debit.
//   //  */
//   // public async updateBalance(
//   //   userId: string,
//   //   amount: number,
//   //   isCredit: boolean
//   // ): Promise<IGenericResponseModel<IUserModel>> {
//   //   try {
//   //     const user = await User.findByPk(userId);

//   //     if (!user) {
//   //       throw new NotFoundException("User not found.");
//   //     }

//   //     if (!isCredit && user.balance < amount) {
//   //       throw new BadRequestsException("Insufficient funds.");
//   //     }

//   //     // Update balance
//   //     const newBalance = isCredit ? user.balance + amount : user.balance - amount;
//   //     await user.update({ balance: newBalance });

//   //     return this.utilService.buildApiResponse({
//   //       data: user,
//   //       message: `Account balance successfully ${isCredit ? "credited" : "debited"}.`,
//   //       statusCode: 200,
//   //     });
//   //   } catch (error:any) {
//   //     throw error;
//   //   }
//   // }

//   // /**
//   //  * Transfer funds between users.
//   //  * @param senderId - The ID of the sender.
//   //  * @param receiverId - The ID of the receiver.
//   //  * @param amount - The amount to transfer.
//   //  */
//   // public async transferFunds(
//   //   senderId: string,
//   //   receiverId: string,
//   //   amount: number
//   // ): Promise<IGenericResponseModel<{ sender: IUserModel; receiver: IUserModel }>> {
//   //   try {
//   //     const sender = await User.findByPk(senderId);
//   //     const receiver = await User.findByPk(receiverId);

//   //     if (!sender || !receiver) {
//   //       throw new NotFoundException("Sender or receiver not found.");
//   //     }

//   //     if (sender.balance < amount) {
//   //       throw new BadRequestsException("Insufficient funds.");
//   //     }

//   //     // Perform transaction
//   //     await sender.update({ balance: sender.balance - amount });
//   //     await receiver.update({ balance: receiver.balance + amount });

//   //     return this.utilService.buildApiResponse({
//   //       data: { sender, receiver },
//   //       message: "Transfer successful.",
//   //       statusCode: 200,
//   //     });
//   //   } catch (error:any) {
//   //     throw error;
//   //   }
//   // }
// }

// export const accountService = new AccountService();
