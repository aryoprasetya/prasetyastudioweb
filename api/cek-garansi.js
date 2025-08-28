// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD1AkEsEKa4UGbxNiU3HGsD86fNZ5HoX-M",
  authDomain: "garansi-prasetya.firebaseapp.com",
  projectId: "garansi-prasetya",
  storageBucket: "garansi-prasetya.firebasestorage.app",
  messagingSenderId: "251914402966",
  appId: "1:251914402966:web:e41190698f670050d116b7",
  measurementId: "G-SNCGS0Q73Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

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
