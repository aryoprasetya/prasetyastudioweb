<?php
// Jika form dikirimkan
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Ambil data dari form
    $nama = $_POST['nama'];
    $email = $_POST['email'];
    $nomor_telepon = $_POST['nomor_telepon'];
    $subjek = $_POST['subjek'];
    $pesan = $_POST['pesan'];

    // Email tujuan
    $to = "prasetyastudio@zohomail.com"; // Ganti dengan email tujuan Anda
    $subject = $subjek;
    $message = "Nama: $nama\nEmail: $email\nTelepon: $nomor_telepon\nPesan:\n$pesan";
    $headers = "From: $email";

    // Kirim email
    if (mail($to, $subject, $message, $headers)) {
        echo "Pesan berhasil terkirim!";
    } else {
        echo "Terjadi kesalahan, pesan gagal terkirim.";
    }
}
?>
