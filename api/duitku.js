export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Metode tidak diizinkan" });
  }

  const { orderId, amount, nama, email, produk } = req.body;

  if (!orderId || !amount) {
    return res.status(400).json({ error: "Data tidak lengkap" });
  }

  try {
    // === KONFIGURASI DUITKU ===
    const merchantCode = process.env.DUITKU_MERCHANT_CODE; // isi di Vercel ENV
    const apiKey = process.env.DUITKU_API_KEY; // isi di Vercel ENV
    const paymentAmount = amount;
    const datetime = new Date().toISOString();
    const signature = CryptoJS.MD5(merchantCode + orderId + paymentAmount + apiKey).toString();

    // Request QRIS ke Duitku
    const response = await fetch("https://sandbox.duitku.com/webapi/api/merchant/v2/inquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        merchantCode: merchantCode,
        paymentAmount: paymentAmount,
        paymentMethod: "QRIS",
        merchantOrderId: orderId,
        productDetails: produk || "Produk",
        customerVaName: nama || "Customer",
        email: email || "",
        phoneNumber: "",
        callbackUrl: `${process.env.BASE_URL}/api/callback`,
        returnUrl: `${process.env.BASE_URL}/success.html`,
        signature: signature,
        expiryPeriod: 10
      })
    });

    const data = await response.json();

    if (data.paymentUrl) {
      // Simpan status awal Pending
      global.payments = global.payments || {};
      global.payments[orderId] = "Pending";

      // Kirim balik QRIS string
      return res.status(200).json({
        qrString: data.qrImage || null
      });
    } else {
      return res.status(500).json({ error: "Gagal membuat QRIS", detail: data });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Terjadi kesalahan server" });
  }
}
