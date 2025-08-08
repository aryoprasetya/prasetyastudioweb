export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Metode tidak diizinkan" });
  }

  try {
    const {
      merchantOrderId, // orderId kita
      resultCode,      // kode hasil pembayaran
      signature        // tanda tangan dari Duitku
    } = req.body;

    // Pastikan semua data ada
    if (!merchantOrderId || !resultCode) {
      return res.status(400).json({ error: "Data callback tidak lengkap" });
    }

    // === Validasi Signature ===
    const merchantCode = process.env.DUITKU_MERCHANT_CODE;
    const apiKey = process.env.DUITKU_API_KEY;

    // Duitku biasanya mengirim signature SHA256(merchantCode + orderId + resultCode + apiKey)
    const crypto = await import("crypto");
    const expectedSignature = crypto
      .createHash("sha256")
      .update(merchantCode + merchantOrderId + resultCode + apiKey)
      .digest("hex");

    if (expectedSignature !== signature) {
      console.warn("⚠️ Signature tidak valid");
      return res.status(403).json({ error: "Signature tidak valid" });
    }

    // === Update status di memori server ===
    global.payments = global.payments || {};

    if (resultCode === "00") {
      // 00 = sukses dibayar
      global.payments[merchantOrderId] = "Lunas";
      console.log(`✅ Order ${merchantOrderId} sudah LUNAS`);
    } else {
      global.payments[merchantOrderId] = "Gagal / Pending";
      console.log(`ℹ️ Order ${merchantOrderId} status: ${resultCode}`);
    }

    // Balas ke Duitku
    res.status(200).json({ message: "Callback diterima" });
  } catch (error) {
    console.error("❌ Error callback:", error);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
}
