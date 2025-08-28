// api/cek-garansi.js
import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

// Konfigurasi Firebase (isi dari Firebase Console)
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { invoice, tanggal } = req.body;
    if (!invoice || !tanggal) {
      return res.status(400).json({ status: "error", message: "Invoice dan tanggal harus diisi!" });
    }

    // Query Firestore
    const q = query(collection(db, "orders"), where("invoice", "==", invoice), where("tanggal", "==", tanggal));
    const snap = await getDocs(q);

    if (snap.empty) {
      return res.json({ status: "notfound", message: "Data tidak ditemukan!" });
    }

    const order = snap.docs[0].data();

    // Hitung garansi (10 hari)
    const tanggalOrder = new Date(order.tanggal);
    const garansiHabis = new Date(tanggalOrder);
    garansiHabis.setDate(garansiHabis.getDate() + 10);

    const today = new Date();

    if (today <= garansiHabis) {
      return res.json({ status: "active", order, garansiHabis: garansiHabis.toISOString() });
    } else {
      return res.json({
        status: "expired",
        order,
        garansiHabis: garansiHabis.toISOString(),
        message: "Garansi sudah habis."
      });
    }

  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: "error", message: "Terjadi kesalahan server", error: err.message });
  }
}
