// ==================== CEK GARANSI ====================
const cekGaransiForm = document.getElementById('cekGaransiForm');
const formKlaimSection = document.getElementById('formKlaimSection');
const hasilGaransi = document.getElementById('hasilGaransi');
const formKlaim = document.getElementById('formKlaim');
const catatanHangus = document.getElementById('catatanHangus');

let lastHasilGaransiHTML = '';
let isVerified = false;
let currentCaptcha = '';

// cegah Enter memicu submit default
cekGaransiForm.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') e.preventDefault();
});

// ==================== CAPTCHA ====================
function generateCaptcha() {
  currentCaptcha = Math.random().toString(36).substring(2, 8).toUpperCase();
  const canvas = document.getElementById('captchaCanvas');
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = '30px Arial';
  ctx.fillStyle = '#333';
  ctx.fillText(currentCaptcha, 20, 35);

  document.getElementById('captchaInput').value = '';
  document.getElementById('captchaMsg').textContent = '';
  isVerified = false;
}

document.getElementById('captchaInput').addEventListener('input', function() {
  if(this.value.toUpperCase() === currentCaptcha){
    isVerified = true;
    document.getElementById('captchaMsg').textContent = '✅ CAPTCHA benar';
    document.getElementById('captchaMsg').style.color = 'green';
  } else {
    isVerified = false;
    document.getElementById('captchaMsg').textContent = '❌ CAPTCHA salah';
    document.getElementById('captchaMsg').style.color = 'red';
  }
});

document.getElementById('refreshCaptcha').addEventListener('click', generateCaptcha);
generateCaptcha();

// ==================== CEK GARANSI ====================
cekGaransiForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const inv = document.getElementById('invoice').value.trim().toUpperCase();
  const tgl = document.getElementById('tanggalOrder').value;

  formKlaimSection.classList.add('hidden');

  hasilGaransi.className = "mt-6 p-5 rounded-xl border border-gray-400 bg-gray-50 text-gray-700";
  hasilGaransi.innerHTML = "Memeriksa garansi...";
  hasilGaransi.classList.remove('hidden');

  // ===== Validasi Nomor Invoice =====
  const invPattern = /^INV\d{3}-PS$/;
  if(!invPattern.test(inv)){
    hasilGaransi.className = "mt-6 p-5 rounded-xl border border-red-400 bg-red-50 text-red-700";
    hasilGaransi.innerHTML = "<strong>Data tidak ditemukan!</strong>";
    return;
  }

  // ===== Validasi Tanggal =====
  const today = new Date();
  const tglOrder = new Date(tgl);
  if(tglOrder > today){
    hasilGaransi.className = "mt-6 p-5 rounded-xl border border-red-400 bg-red-50 text-red-700";
    hasilGaransi.innerHTML = "<strong>Silakan cek kembali tanggal Anda!</strong>";
    return;
  }

  // ===== Hitung sisa garansi =====
  const garansiHabis = new Date(tglOrder);
  garansiHabis.setDate(garansiHabis.getDate() + 10);
  const sisaHari = Math.ceil((garansiHabis - today) / (1000*60*60*24));

  let btnHTML = '';
  if(sisaHari >= 0){
    // Garansi masih berlaku → tombol Klaim
    hasilGaransi.className = "mt-6 p-5 rounded-xl border border-green-400 bg-green-50 text-green-700";
    btnHTML = `<button type="button" id="btnAction" class="mt-4 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">Klaim Garansi</button>`;
  } else {
    // Garansi habis → tombol Kembali
    hasilGaransi.className = "mt-6 p-5 rounded-xl border border-yellow-400 bg-yellow-50 text-yellow-800";
    btnHTML = `<button type="button" id="btnAction" class="mt-4 px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700">Kembali</button>`;
  }

  hasilGaransi.innerHTML = `
    <p class="font-semibold">${sisaHari >=0 ? 'Garansi masih berlaku hingga ' + garansiHabis.toLocaleDateString('id-ID') : 'Garansi sudah habis sejak ' + Math.abs(sisaHari) + ' hari lalu'}</p>
    <div class="mt-2 text-gray-800">
      <p><strong>Nomor Invoice:</strong> ${inv}</p>
      <p><strong>Tanggal Order:</strong> ${tgl}</p>
    </div>
    ${btnHTML}
  `;

  lastHasilGaransiHTML = hasilGaransi.innerHTML;

  // Event tombol
  const btnAction = document.getElementById('btnAction');
  btnAction.addEventListener('click', () => {
    if(sisaHari >= 0){
      // Klaim
      document.getElementById('tglForm').value = tgl;
      document.getElementById('namaOrder').value = "";
      formKlaimSection.classList.remove('hidden');
      generateCaptcha();
      hasilGaransi.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      // Kembali ke beranda
      window.location.href = "index.html"; // ganti dengan link beranda
    }
  });
});

// ==================== FORM KLAIM ====================
formKlaim.addEventListener('submit', async (e) => {
  e.preventDefault();

  if(!isVerified){
    alert("Silakan selesaikan CAPTCHA terlebih dahulu!");
    return;
  }

  const dataKlaim = {
    nama: document.getElementById('nama').value,
    email: document.getElementById('email').value,
    telp: document.getElementById('telp').value,
    invoice: document.getElementById('invoice').value,
    tglOrder: document.getElementById('tglForm').value,
    namaOrder: document.getElementById('namaOrder').value,
    metode: document.getElementById('metode').value,
    alasan: document.getElementById('alasan').value
  };

  // Kirim via EmailJS
  try{
    emailjs.init("ruGEfqQ8sHty_bvx_"); // public key
    await emailjs.send('service_wyuak48','template_f4babnq',dataKlaim);
    alert("Klaim garansi berhasil dikirim ✅");
    formKlaim.reset();
    generateCaptcha();
    hasilGaransi.innerHTML = lastHasilGaransiHTML;
    hasilGaransi.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch(err){
    console.error(err);
    alert("Terjadi kesalahan saat mengirim klaim!");
  }
});
