// api/status.js
export default async function handler(req, res) {
  const { orderId } = req.query;

  global.payments = global.payments || {};
  const status = global.payments[orderId] || "Pending";

  res.status(200).json({ status });
}
