import express from "express";
import crypto from "crypto";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const {
  PORT = 3000,
  MERCHANT_ID,
  SALT_KEY,
  SALT_INDEX,
  FRONTEND_URL,
  APP_URL,
} = process.env;

const PHONEPE_BASE = "https://api-preprod.phonepe.com/apis/pg-sandbox";

app.post("/api/payment/initiate", async (req, res) => {
  const { amount, userId, phone, name } = req.body;
  const merchantTransactionId = `TXN_${Date.now()}`;

  const payload = {
    merchantId: MERCHANT_ID,
    merchantTransactionId,
    merchantUserId: `MUID_${userId}`,
    name,
    amount: amount * 100,
    redirectUrl: `${APP_URL}/api/payment/status/${merchantTransactionId}`,
    redirectMode: "POST",
    mobileNumber: phone,
    paymentInstrument: { type: "PAY_PAGE" },
  };

  const base64Payload = Buffer.from(JSON.stringify(payload)).toString("base64");
  const hash = crypto
    .createHash("sha256")
    .update(base64Payload + "/pg/v1/pay" + SALT_KEY)
    .digest("hex");
  const checksum = `${hash}###${SALT_INDEX}`;

  try {
    const response = await axios.post(
      `${PHONEPE_BASE}/pg/v1/pay`,
      { request: base64Payload },
      {
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": checksum,
        },
      },
    );

    const redirectUrl =
      response.data?.data?.instrumentResponse?.redirectInfo?.url ||
      response.data?.data?.redirectInfo?.url ||
      response.data?.data?.paymentUrl;

    if (!redirectUrl) {
      console.error("PhonePe initiate response missing redirect URL:", {
        status: response.status,
        data: response.data,
      });

      return res.status(502).json({
        success: false,
        error: "Payment provider did not return a redirect URL.",
        providerResponse: response.data,
      });
    }

    return res.json({ success: true, redirectUrl });
  } catch (error) {
    console.error("PhonePe initiate error:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });

    return res.status(500).json({
      success: false,
      error:
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to initiate payment",
      providerStatus: error.response?.status || null,
      providerResponse: error.response?.data || null,
    });
  }
});

app.post("/api/payment/status/:txnId", async (req, res) => {
  const { txnId } = req.params;

  const hash = crypto
    .createHash("sha256")
    .update(`/pg/v1/status/${MERCHANT_ID}/${txnId}` + SALT_KEY)
    .digest("hex");
  const checksum = `${hash}###${SALT_INDEX}`;

  try {
    const response = await axios.get(
      `${PHONEPE_BASE}/pg/v1/status/${MERCHANT_ID}/${txnId}`,
      {
        headers: {
          "X-VERIFY": checksum,
          "X-MERCHANT-ID": MERCHANT_ID,
        },
      },
    );

    if (response.data?.success) {
      return res.redirect(`${FRONTEND_URL}/payment-success?txn=${txnId}`);
    }

    return res.redirect(`${FRONTEND_URL}/payment-failed?txn=${txnId}`);
  } catch (error) {
    return res.redirect(`${FRONTEND_URL}/payment-failed`);
  }
});

app.listen(PORT, () => {
  console.log(`Payment server running on http://localhost:${PORT}`);
});
