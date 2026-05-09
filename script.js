/* ─── Navigasyon Scrolled Durumu ─── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ─── Mobil Menü (Hamburger) ─── */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('active');
  document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
    document.body.style.overflow = '';
  });
});

/* ─── Scroll Reveal Animasyonları ─── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (!entry.isIntersecting) return;
    entry.target.style.transitionDelay = `${i * 0.05}s`;
    entry.target.classList.add('visible');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ─── Dinamik Fotoğraf Galerisi (Kart İçi Geçişler) ─── */
setInterval(() => {
  document.querySelectorAll('.gallery-thumb').forEach(thumb => {
    const imgs = thumb.querySelectorAll('img');
    if (imgs.length < 2) return; 

    let activeIdx = Array.from(imgs).findIndex(img => img.classList.contains('active'));
    imgs[activeIdx].classList.remove('active'); 
    
    let nextIdx = (activeIdx + 1) % imgs.length; 
    imgs[nextIdx].classList.add('active'); 
  });
}, 3000);

/* ─── Lightbox Modülü ─── */
const lightbox  = document.getElementById('lightbox');
const lbImg     = document.getElementById('lb-img');
const lbClose   = document.getElementById('lb-close');
const lbPrev    = document.getElementById('lb-prev');
const lbNext    = document.getElementById('lb-next');

const lbTitle = document.getElementById('lb-title');
const lbRole  = document.getElementById('lb-role');
const lbStory = document.getElementById('lb-story');
const lbTools = document.getElementById('lb-tools');

let currentItems = []; 
let currentIndex = 0;

document.querySelectorAll('.gallery-card').forEach(card => {
  card.addEventListener('click', () => {
    currentItems = Array.from(card.querySelectorAll('.gallery-thumb img'));
    currentIndex = currentItems.findIndex(img => img.classList.contains('active')); 
    if(currentIndex === -1) currentIndex = 0;
    openLightbox();
  });
});

function openLightbox() {
  const item = currentItems[currentIndex];
  lbImg.src = item.src;
  lbImg.alt = item.alt;
  
  lbTitle.textContent = item.dataset.title || 'Proje Detayı';
  lbRole.textContent = item.dataset.role || 'Görüntü Yönetmeni';
  lbStory.textContent = item.dataset.story || 'Proje detayları ve hikayesi...';
  
  lbTools.innerHTML = '';
  const toolsData = item.dataset.tools;
  if (toolsData) {
    toolsData.split(',').forEach(tool => {
      const span = document.createElement('span');
      span.textContent = tool.trim();
      lbTools.appendChild(span);
    });
  }

  lbImg.classList.remove('zoomed'); 
  lbImg.style.transformOrigin = 'center center';
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => lbImg.src = '', 300);
}

function showPrev() {
  currentIndex = (currentIndex - 1 + currentItems.length) % currentItems.length;
  openLightbox();
}

function showNext() {
  currentIndex = (currentIndex + 1) % currentItems.length;
  openLightbox();
}

lbClose.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });
lbNext.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox || e.target === document.getElementById('lb-img-container')) {
    closeLightbox();
  }
});

/* ─── Gelişmiş Zoom & Pan İşlemi ─── */
const imgContainer = document.getElementById('lb-img-container');

lbImg.addEventListener('click', function(e) {
  e.stopPropagation();
  this.classList.toggle('zoomed');
  
  if (this.classList.contains('zoomed')) {
    updatePanPosition(e);
  } else {
    this.style.transformOrigin = 'center center';
  }
});

imgContainer.addEventListener('mousemove', function(e) {
  if (lbImg.classList.contains('zoomed')) {
    updatePanPosition(e);
  }
});

imgContainer.addEventListener('mouseleave', function() {
  if (lbImg.classList.contains('zoomed')) {
    lbImg.classList.remove('zoomed');
    lbImg.style.transformOrigin = 'center center';
  }
});

function updatePanPosition(e) {
  const rect = imgContainer.getBoundingClientRect();
  let x = ((e.clientX - rect.left) / rect.width) * 100;
  let y = ((e.clientY - rect.top) / rect.height) * 100;

  x = Math.max(0, Math.min(100, x));
  y = Math.max(0, Math.min(100, y));

  lbImg.style.transformOrigin = `${x}% ${y}%`;
}

/* ─── Video Lightbox Modülü ─── */
/* ─── Gelişmiş Video Lightbox Modülü ─── */
const vlbElements = {
  lightbox: document.getElementById('video-lightbox'),
  frame: document.getElementById('vlb-frame'),
  title: document.getElementById('vlb-title'),
  role: document.getElementById('vlb-role'),
  story: document.getElementById('vlb-story'),
  tools: document.getElementById('vlb-tools'),
  close: document.getElementById('vlb-close')
};

// Video kartlarına tıklama olayını dinle
document.querySelectorAll('.project-card[data-video]').forEach(card => {
  card.addEventListener('click', () => {
    // 1. Kart içindeki mevcut verileri değişkenlere ata
    const src = card.dataset.video;
    const title = card.querySelector('h3').innerText;
    const story = card.querySelector('.g-desc').innerText;
    const role = card.querySelector('.badge').innerText;
    const tools = Array.from(card.querySelectorAll('.tech-tags span')).map(s => s.innerText);

    // 2. Bilgilendirme panelindeki (sol taraf) alanları bu verilerle doldur
    vlbElements.title.innerText = title;
    vlbElements.story.innerText = story;
    vlbElements.role.innerText = role;
    
    // Teknik araçları (tags) temizle ve yeniden oluştur
    vlbElements.tools.innerHTML = tools.map(t => `<span>${t}</span>`).join('');
    
    // 3. Videoyu yükle ve paneli görünür yap
    const autoSrc = src.includes('?') ? src + '&autoplay=1' : src + '?autoplay=1';
    vlbElements.frame.src = autoSrc;
    vlbElements.lightbox.classList.add('open');
    
    // Sayfa kaydırmasını engelle[cite: 5]
    document.body.style.overflow = 'hidden';
  });
});

// Kapatma butonu işlevi[cite: 5]
vlbElements.close.addEventListener('click', () => {
  vlbElements.lightbox.classList.remove('open');
  vlbElements.frame.src = ''; // Videoyu durdurmak için kaynağı temizle[cite: 5]
  document.body.style.overflow = '';
});

// Panel dışına tıklandığında kapatma[cite: 5]
vlbElements.lightbox.addEventListener('click', (e) => {
  if (e.target === vlbElements.lightbox) {
    vlbElements.lightbox.classList.remove('open');
    vlbElements.frame.src = '';
    document.body.style.overflow = '';
  }
});

// Showreel ve diğer videolar için aynı tetikleyici
document.querySelectorAll('.project-card[data-video]').forEach(card => {
  card.addEventListener('click', () => {
    const src = card.dataset.video;
    //if (src) openVideoLightbox(src);
  });
});

//vlbClose.addEventListener('click', closeVideoLightbox);
videoLightbox.addEventListener('click', (e) => {
  if (e.target === videoLightbox) closeVideoLightbox();
});

/* ─── Klavye Kısayolları ─── */
document.addEventListener('keydown', (e) => {
  if (lightbox.classList.contains('open')) {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft')  showPrev();
    if (e.key === 'ArrowRight') showNext();
  }
  if (videoLightbox.classList.contains('open')) {
    if (e.key === 'Escape') closeVideoLightbox();
  }
});

/* ─── Profesyonel Slider Kontrolleri (İlerleme Çubuğu & Kör Buton Önleme) ─── */
function setupAdvancedSlider(sliderId, prevId, nextId, progressId) {
  const slider = document.getElementById(sliderId);
  const prevBtn = document.getElementById(prevId);
  const nextBtn = document.getElementById(nextId);
  const progressBar = document.getElementById(progressId);

  if (!slider || !prevBtn || !nextBtn || !progressBar) return;

  const updateSliderState = () => {
    const maxScroll = slider.scrollWidth - slider.clientWidth;
    const currentScroll = slider.scrollLeft;

    // Butonları pasifleştir/aktifleştir
    prevBtn.disabled = currentScroll <= 5;
    nextBtn.disabled = currentScroll >= maxScroll - 5;

    // İlerleme çubuğunu hesapla
    const scrollPercentage = maxScroll > 0 ? (currentScroll / maxScroll) * 100 : 0;
    progressBar.style.width = `${scrollPercentage}%`;
  };

  // Dinleme etkinlikleri
  slider.addEventListener('scroll', updateSliderState, { passive: true });
  window.addEventListener('resize', updateSliderState);

  // Başlangıç durumu
  setTimeout(updateSliderState, 100);

  // Buton tıklamaları
  const scrollAmount = () => window.innerWidth > 768 ? 600 : 320;

  prevBtn.addEventListener('click', () => {
    slider.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', () => {
    slider.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
  });
}

setupAdvancedSlider('video-slider', 'video-prev', 'video-next', 'video-progress');
setupAdvancedSlider('photo-slider', 'photo-prev', 'photo-next', 'photo-progress');
// Kodunun en altına veya uygun bir yere ekle
document.getElementById('nextBtn').addEventListener('click', function() {
    console.log("Sağ tuşa basıldı!"); // Çalışıp çalışmadığını konsoldan görmek için
    // Buraya sonraki fotoğrafa geçme kodun gelecek
});

document.getElementById('prevBtn').addEventListener('click', function() {
    console.log("Sol tuşa basıldı!");
    // Buraya önceki fotoğrafa geçme kodun gelecek
});