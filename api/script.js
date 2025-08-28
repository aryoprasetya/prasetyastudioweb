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

  const inv = document.getElementById('invoice').value.trim();
  const tgl = document.getElementById('tanggalOrder').value;

  // sembunyikan form klaim & catatan hangus
  formKlaimSection.classList.add('hidden');
  catatanHangus.classList.add('hidden');

  hasilGaransi.className = "mt-6 p-5 rounded-xl border border-gray-400 bg-gray-50 text-gray-700";
  hasilGaransi.innerHTML = "Memeriksa garansi...";
  hasilGaransi.classList.remove('hidden');

  try {
    const res = await fetch('/api/cek-garansi', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ invoice: inv, tanggal: tgl })
});

    const data = await res.json();
    let garansiDate = data.garansiHabis ? new Date(data.garansiHabis).toLocaleDateString('id-ID') : '-';

    let btnClass = 'bg-blue-600 text-white hover:bg-blue-700';
    let btnAction = '';
    let html = '';

    if(data.status === 'active'){
      btnAction = 'id="btnKlaim"';
      html = `
        <p class="font-semibold">
          Garansi Anda masih berlaku hingga <b>${garansiDate}</b>.
        </p>
        <div class="mt-2 text-gray-800">
          <p><strong>Nomor Invoice:</strong> ${data.order.invoice}</p>
          <p><strong>Tanggal Order:</strong> ${data.order.tanggal}</p>
          <p><strong>Orderan:</strong> ${data.order.orderan}</p>
        </div>
        <button type="button" 
                class="mt-4 px-4 py-2 rounded-lg ${btnClass}"
                ${btnAction}>
          Klaim Garansi
        </button>
      `;
      hasilGaransi.className = "mt-6 p-5 rounded-xl border border-green-400 bg-green-50 text-green-700";
    } else if(data.status === 'expired'){
  btnAction = 'id="btnKlaim"';
  html = `
    <p class="font-semibold text-yellow-700">
      ⚠️ Garansi Anda sudah habis sejak <b>${garansiDate}</b>.
    </p>
    <div class="mt-2 text-gray-800">
      <p><strong>Nomor Invoice:</strong> ${data.order.invoice}</p>
      <p><strong>Tanggal Order:</strong> ${data.order.tanggal}</p>
      <p><strong>Orderan:</strong> ${data.order.orderan}</p>
    </div>
    <button type="button" 
            class="mt-4 px-4 py-2 rounded-lg ${btnClass}"
            ${btnAction}>
      Klaim Garansi
    </button>
  `;
  hasilGaransi.className = "mt-6 p-5 rounded-xl border border-yellow-400 bg-yellow-50 text-yellow-800";
  catatanHangus.classList.remove('hidden');

  // otomatis hilang setelah 20 detik
  setTimeout(() => {
    hasilGaransi.classList.add('hidden');
    catatanHangus.classList.add('hidden');
  }, 20000);
}
 else {
      html = `<strong>${data.message || 'Garansi tidak ditemukan.'}</strong>`;
      hasilGaransi.className = "mt-6 p-5 rounded-xl border border-red-400 bg-red-50 text-red-700";
    }

    hasilGaransi.innerHTML = html;
    lastHasilGaransiHTML = html;

    if(data.status === 'active' || data.status === 'expired'){
      const btnKlaim = document.getElementById('btnKlaim');
      btnKlaim.addEventListener('click', () => {
        document.getElementById('tglForm').value = data.order.tanggal;
        document.getElementById('namaOrder').value = data.order.orderan;
        formKlaimSection.classList.remove('hidden');
        generateCaptcha();
        hasilGaransi.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }

  } catch (err) {
    hasilGaransi.className = "mt-6 p-5 rounded-xl border border-red-400 bg-red-50 text-red-700";
    hasilGaransi.innerHTML = `<strong>Terjadi kesalahan server!</strong>`;
    console.error(err);
  }
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
