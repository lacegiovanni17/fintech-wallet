export interface PayPalCaptureResponse {
  purchase_units: {
    payments: {
      captures: {
        amount: {
          value: string;
        };
      }[];
    };
  }[];
}
