// api/callback.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const { merchantOrderId, resultCode } = req.body;

  // Simpan status pembayaran ke variabel global sementara
  global.payments = global.payments || {};
  global.payments[merchantOrderId] = resultCode === "00" ? "Lunas" : "Pending";

  console.log(`Callback diterima: ${merchantOrderId} - ${global.payments[merchantOrderId]}`);

  res.status(200).send("OK");
}
