import { apiFetch } from "@/lib/api/fetcher";

export async function createCheckoutSessionAction() {
  return apiFetch<{ success: boolean; url: string; sessionId: string }>(
    "/api/payments/create-checkout-session",
    {
      method: "POST",
    }
  );
}

export async function verifyStripeSessionAction(sessionId: string) {
  return apiFetch<{
    success: boolean;
    message: string;
    payment: {
      planName: string;
      amount: number;
      currency: string;
      transactionId: string;
    };
  }>("/api/payments/verify-session", {
    method: "POST",
    body: JSON.stringify({ sessionId }),
  });
}
