// api/duitku.js
import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { orderId, amount, nama, email, produk } = req.body;

  const merchantCode = process.env.DUITKU_MERCHANT_CODE;
  const apiKey = process.env.DUITKU_API_KEY;

  if (!merchantCode || !apiKey) {
    return res.status(500).json({ message: "Missing Duitku environment variables" });
  }

  const signature = crypto
    .createHash("sha256")
    .update(merchantCode + orderId + amount + apiKey)
    .digest("hex");

  const payload = {
    merchantCode: merchantCode,
    paymentAmount: amount,
    paymentMethod: "SP", // QRIS
    merchantOrderId: orderId,
    productDetails: produk,
    customerVaName: nama,
    email: email,
    callbackUrl: "https://prasetya-studio.vercel.app/api/callback",
    returnUrl: "https://prasetya-studio.vercel.app/success.html",
    signature: signature,
    expiryPeriod: 60
  };

  try {
    const response = await fetch(
      "https://passport.duitku.com/webapi/api/merchant/v2/inquiry", // ✅ PRODUCTION
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }
    );

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal menghubungi Duitku" });
  }
}
