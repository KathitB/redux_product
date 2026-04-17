import axios from "axios";

const PAYMENT_API_BASE =
  import.meta.env.VITE_PAYMENT_API_BASE_URL || "/api/payment";

export async function initiateUpiPayment({
  amount,
  userId,
  phone,
  name,
  upiId,
}) {
  const response = await axios.post(`${PAYMENT_API_BASE}/initiate`, {
    amount,
    userId,
    phone,
    name,
    upiId,
  });

  if (!response.data?.success || !response.data?.redirectUrl) {
    throw new Error("Unable to start UPI payment right now.");
  }

  return response.data.redirectUrl;
}
