import { Controller, Post, Body, Route, Tags, SuccessResponse, Get, Query } from "tsoa";
import { FundService } from "../services/fund.service";
import { Transaction } from "../entities/Transaction";

@Route("paypal")
@Tags("Payments")
export class FundController extends Controller {
  @Post("/create")
  @SuccessResponse("200", "Order created")
  public async createOrder(@Body() body: { amount: number }): Promise<any> {
    const fundService = new FundService();
    return await fundService.createOrder(body.amount);
  }

  @Post("/capture")
  @SuccessResponse("200", "Order captured")
  public async captureOrder(
    @Body() body: { orderId: string; userId: number }
  ): Promise<{ success: boolean; newBalance: number }> {
    const fundService = new FundService();
    return await fundService.captureOrder(body.orderId, body.userId);
  }

  @Post("/transfer")
  @SuccessResponse("200", "Transfer successful")
  public async transferFunds(
    @Body() body: { senderId: number; recipientEmail: string; amount: number }
  ): Promise<{
    success: boolean;
    message: string;
    senderBalance: number;
    recipientBalance: number;
  }> {
    const fundService = new FundService();

    try {
      return await fundService.transferFunds(body.senderId, body.recipientEmail, body.amount);
    } catch (error: any) {
      this.setStatus(400); // Bad Request
      return {
        success: false,
        message: error.message,
        senderBalance: 0,
        recipientBalance: 0,
      };
    }
  }

  @Get("/transactions")
  @SuccessResponse("200", "Transactions fetched")
  public async getTransactions(@Query() userId: number): Promise<Transaction[]> {
    const fundService = new FundService();
    return await fundService.getTransactions(userId);
  }
}
