import { handleResponse } from "@/utils/handle-response";

export const createPaymentUrl = async (
  accessToken: string,
  paymentData: { amount: number, txnRef: string, orderInfo: string, returnUrl: string }
) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payment/create-payment-url`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`
    },
    body: JSON.stringify(paymentData)
  });

  return handleResponse(response);
};