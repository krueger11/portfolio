/* ─── 1. Navigasyon ve Mobil Menü ─── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('active');
  document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
});

/* ─── 2. Scroll Reveal ─── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (!entry.isIntersecting) return;
    entry.target.style.transitionDelay = `${i * 0.05}s`;
    entry.target.classList.add('visible');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ─── 3. Lightbox (Fotoğraf) Modülü ─── */
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
  lbStory.textContent = item.dataset.story || 'Detaylar...';
  
  lbTools.innerHTML = '';
  if (item.dataset.tools) {
    item.dataset.tools.split(',').forEach(tool => {
      const span = document.createElement('span');
      span.textContent = tool.trim();
      lbTools.appendChild(span);
    });
  }
  lbImg.classList.remove('zoomed'); 
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

// Butonlara Görev Atama
lbClose.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });
lbNext.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });

/* ─── 4. Video Lightbox Modülü ─── */
const vlbElements = {
  lightbox: document.getElementById('video-lightbox'),
  frame: document.getElementById('vlb-frame'),
  title: document.getElementById('vlb-title'),
  role: document.getElementById('vlb-role'),
  story: document.getElementById('vlb-story'),
  tools: document.getElementById('vlb-tools'),
  close: document.getElementById('vlb-close')
};

document.querySelectorAll('.project-card[data-video]').forEach(card => {
  card.addEventListener('click', () => {
    const src = card.dataset.video;
    const title = card.querySelector('h3').innerText;
    const story = card.querySelector('.g-desc').innerText;
    const role = card.querySelector('.badge').innerText;
    const tools = Array.from(card.querySelectorAll('.tech-tags span')).map(s => s.innerText);

    vlbElements.title.innerText = title;
    vlbElements.story.innerText = story;
    vlbElements.role.innerText = role;
    vlbElements.tools.innerHTML = tools.map(t => `<span>${t}</span>`).join('');
    
    const autoSrc = src.includes('?') ? src + '&autoplay=1' : src + '?autoplay=1';
    vlbElements.frame.src = autoSrc;
    vlbElements.lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

vlbElements.close.addEventListener('click', () => {
  vlbElements.lightbox.classList.remove('open');
  vlbElements.frame.src = ''; 
  document.body.style.overflow = '';
});

/* ─── 5. Klavye Kısayolları ─── */
document.addEventListener('keydown', (e) => {
  if (lightbox.classList.contains('open')) {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft')  showPrev();
    if (e.key === 'ArrowRight') showNext();
  }
});

/* ─── 6. Slider Kontrolleri ─── */
function setupSlider(sliderId, prevId, nextId, progressId) {
  const slider = document.getElementById(sliderId);
  const prevBtn = document.getElementById(prevId);
  const nextBtn = document.getElementById(nextId);
  const progressBar = document.getElementById(progressId);

  if (!slider) return;

  const update = () => {
    const max = slider.scrollWidth - slider.clientWidth;
    prevBtn.disabled = slider.scrollLeft <= 5;
    nextBtn.disabled = slider.scrollLeft >= max - 5;
    progressBar.style.width = `${(slider.scrollLeft / max) * 100}%`;
  };

  slider.addEventListener('scroll', update);
  prevBtn.addEventListener('click', () => slider.scrollBy({ left: -320, behavior: 'smooth' }));
  nextBtn.addEventListener('click', () => slider.scrollBy({ left: 320, behavior: 'smooth' }));
  update();
}

setupSlider('video-slider', 'video-prev', 'video-next', 'video-progress');
setupSlider('photo-slider', 'photo-prev', 'photo-next', 'photo-progress');