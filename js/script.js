/*========== menu icon navbar ==========*/
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
};


/*========== scroll sections active link ==========*/
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');

window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if(top >= offset && top < offset + height) {
            navLinks.forEach(links => {
                links.classList.remove('active');
                document.querySelector('header nav a[href*=' + id + ']').classList.add('active');
            });
        };
    });


/*========== sticky navbar ==========*/
let header = document.querySelector('.header');

header.classList.toggle('sticky', window.scrollY > 100);


/*========== remove menu icon navbar when click navbar link (scroll) ==========*/
menuIcon.classList.remove('bx-x');
navbar.classList.remove('active');

};


/*========== swiper ==========*/
var swiper = new Swiper(".mySwiper", {
    slidesPerView: 1,
    spaceBetween: 50,
    loop: true,
    grabCursor: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
});


/*========== dark light mode ==========*/
let darkModeIcon = document.querySelector('#darkMode-icon');

darkModeIcon.onclick = () => {
    darkModeIcon.classList.toggle('bx-sun');
    document.body.classList.toggle('dark-mode');
};


/*========== scroll reveal ==========*/
ScrollReveal({
    // reset: true,
    distance: '80px',
    duration: 2000,
    delay: 200
});

ScrollReveal().reveal('.home-content, .heading', { origin: 'top' });
ScrollReveal().reveal('.home-img img, .services-container, .portfolio-box, .testimonial-wrapper, .contact form', { origin: 'bottom' });
ScrollReveal().reveal('.home-content h1, .about-img img', { origin: 'left' });
ScrollReveal().reveal('.home-content h3, .home-content p, .about-content', { origin: 'right' });

  const audio = document.getElementById("bg-music");
  const toggleBtn = document.getElementById("music-toggle");

  let isPlaying = false;

  // Ganti ikon sesuai status
  function updateIcon() {
    toggleBtn.className = isPlaying ? "bx bx-volume-full" : "bx bx-volume-mute";
  }

  // Toggle musik saat diklik
  function toggleAudio() {
  const audio = document.getElementById("musik");
  const icon = document.getElementById("music-icon");

  if (audio.paused) {
    audio.play();
    icon.className = "bx bx-music";
  } else {
    audio.pause();
    icon.className = "bx bx-pause";
  }
}

// Update jam digital (jam & menit)
  function updateDigitalClock() {
    const now = new Date();
    document.getElementById('hourBlock').textContent = now.getHours().toString().padStart(2,'0');
    document.getElementById('minuteBlock').textContent = now.getMinutes().toString().padStart(2,'0');
  }
  updateDigitalClock();
  setInterval(updateDigitalClock, 1000);

  // Update tanggal & lokasi (IP geolocation via ipapi.co)
  function updateTanggalLokasi(city, country){
    const hariList = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
    const bulanList = ['Januari','Februari','Maret','April','Mei','Juni',
      'Juli','Agustus','September','Oktober','November','Desember'];
    const now = new Date();
    const hari = hariList[now.getDay()];
    const tanggal = now.getDate();
    const bulan = bulanList[now.getMonth()];
    const tahun = now.getFullYear();
    document.getElementById('tanggalLokasi').textContent =
      `${city}, ${country}, ${hari}, ${tanggal} ${bulan} ${tahun}`;
  }

  // Panggil API ipapi.co untuk dapatkan lokasi dari IP
  fetch('https://ipapi.co/json/')
    .then(res => res.json())
    .then(data => {
      updateTanggalLokasi(data.city || 'Kota', data.country_name || 'Negara');
    })
    .catch(err => {
      console.error('Gagal ambil lokasi:', err);
      updateTanggalLokasi('Lokasi tidak tersedia', '');
    });
