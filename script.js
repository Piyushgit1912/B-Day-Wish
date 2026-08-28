/* ============================================================
   LEGENDARY CINEMATIC ROMANTIC BIRTHDAY WEBSITE — LIGHT THEME
   script.js — All Interactions, Animations & Three.js Galaxy
   ============================================================ */

'use strict';

const State = {
  musicPlaying: false,
  galleryImages: [
    'images/photo1.jpg',  'images/photo2.jpg',  'images/photo3.jpg',
    'images/photo4.jpg',  'images/photo5.jpg',  'images/photo6.jpg',
    'images/photo7.jpg',  'images/photo8.jpg',  'images/photo9.jpg',
    'images/photo10.jpg', 'images/photo11.jpg', 'images/photo12.jpg',
    'images/photo13.jpg', 'images/photo14.jpg', 'images/photo15.jpg',
  ],
  galleryIndex: 0,
  introComplete: false,
  touchStartX: 0,
};

/* ============================================================
   1. CINEMATIC INTRO
   ============================================================ */
function runCinematicIntro() {
  const intro   = document.getElementById('cinematic-intro');
  const logo    = document.getElementById('intro-logo');
  const wrapper = document.getElementById('site-wrapper');

  if (!intro) return;

  // Spawn intro petals
  spawnIntroPetals();

  setTimeout(() => intro.classList.add('open-bars'), 400);
  setTimeout(() => logo && logo.classList.add('reveal'), 700);

  setTimeout(() => {
    intro.classList.add('fade-out');
    wrapper && wrapper.classList.add('visible');
    State.introComplete = true;
  }, 3400);

  setTimeout(() => { intro.style.display = 'none'; }, 4800);
}

function spawnIntroPetals() {
  const container = document.querySelector('.intro-petals');
  if (!container) return;
  const petals = ['🌸','🌺','🌹','🌷','✿','❀','🌼'];
  for (let i = 0; i < 20; i++) {
    const el = document.createElement('div');
    el.className = 'intro-petal';
    el.textContent = petals[Math.floor(Math.random() * petals.length)];
    el.style.left             = Math.random() * 100 + 'vw';
    el.style.fontSize         = (0.8 + Math.random() * 1.2) + 'rem';
    el.style.animationDuration = (5 + Math.random() * 6) + 's';
    el.style.animationDelay   = Math.random() * 4 + 's';
    container.appendChild(el);
  }
}

/* ============================================================
   2. THREE.JS LIGHT GALAXY — SOFT WARM PARTICLES
   ============================================================ */
function initGalaxy() {
  const canvas = document.getElementById('galaxy-canvas');
  if (!canvas || typeof THREE === 'undefined') { initCanvasParticles(); return; }

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 4;

  const starCount = 3000;
  const positions = new Float32Array(starCount * 3);
  const colors    = new Float32Array(starCount * 3);
  const sizes     = new Float32Array(starCount);

  // Warm light palette for particles
  const palette = [
    new THREE.Color('#e8557a'),  // rose
    new THREE.Color('#f4836a'),  // peach
    new THREE.Color('#e8a230'),  // gold
    new THREE.Color('#b07fd4'),  // lavender
    new THREE.Color('#f7c5d0'),  // blush
    new THREE.Color('#faa48e'),  // soft peach
  ];

  for (let i = 0; i < starCount; i++) {
    const r     = 6 + Math.random() * 18;
    const theta = Math.random() * Math.PI * 2;
    const phi   = Math.acos((Math.random() * 2) - 1);

    positions[i*3]   = r * Math.sin(phi) * Math.cos(theta);
    positions[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i*3+2] = r * Math.cos(phi);

    const col = palette[Math.floor(Math.random() * palette.length)];
    colors[i*3]   = col.r;
    colors[i*3+1] = col.g;
    colors[i*3+2] = col.b;

    sizes[i] = Math.random() * 2 + 0.4;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    size: 0.045,
    vertexColors: true,
    transparent: true,
    opacity: 0.5,
    sizeAttenuation: true,
  });

  const stars = new THREE.Points(geo, mat);
  scene.add(stars);

  let mx = 0, my = 0;
  document.addEventListener('mousemove', e => {
    mx = (e.clientX / window.innerWidth  - 0.5) * 0.25;
    my = (e.clientY / window.innerHeight - 0.5) * 0.25;
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  let t = 0;
  (function animate() {
    requestAnimationFrame(animate);
    t += 0.0004;
    stars.rotation.y = t + mx;
    stars.rotation.x = t * 0.3 + my;
    mat.opacity = 0.35 + Math.sin(t * 4) * 0.08;
    renderer.render(scene, camera);
  })();
}

/* ── Fallback Canvas Particles (no Three.js) ── */
function initCanvasParticles() {
  const canvas = document.getElementById('galaxy-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;
  window.addEventListener('resize', () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });
  const cols = ['#e8557a','#f4836a','#e8a230','#b07fd4','#f7c5d0','#faa48e'];
  const dots = Array.from({ length: 200 }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    r: Math.random() * 2 + 0.5,
    speed: Math.random() * 0.2 + 0.05,
    color: cols[Math.floor(Math.random() * cols.length)],
    opacity: Math.random() * 0.4 + 0.1,
  }));
  (function draw() {
    ctx.clearRect(0, 0, W, H);
    dots.forEach(d => {
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = d.color;
      ctx.globalAlpha = d.opacity * (0.6 + Math.abs(Math.sin(Date.now() * 0.001 + d.x)) * 0.4);
      ctx.fill();
      d.y -= d.speed;
      if (d.y < 0) { d.y = H; d.x = Math.random() * W; }
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  })();
}

/* ============================================================
   3. FLOATING HEARTS
   ============================================================ */
function spawnHearts() {
  const container = document.getElementById('hearts-container');
  if (!container) return;
  const symbols = ['❤️','💕','💖','💗','🌸','🌺','✨','💫','🌹','🌷'];

  function createHeart() {
    const el = document.createElement('div');
    el.className = 'floating-heart';
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    el.style.left             = Math.random() * 100 + 'vw';
    el.style.fontSize         = (0.7 + Math.random() * 1.2) + 'rem';
    el.style.animationDuration = (9 + Math.random() * 12) + 's';
    el.style.animationDelay   = Math.random() * 4 + 's';
    container.appendChild(el);
    setTimeout(() => el.remove(), 24000);
  }

  setInterval(createHeart, 1200);
  for (let i = 0; i < 8; i++) setTimeout(createHeart, i * 300);
}

/* ============================================================
   4. BACKGROUND MUSIC
   ============================================================ */
function initMusic() {
  const btn   = document.getElementById('music-btn');
  const eq    = document.querySelector('.music-eq');
  const audio = document.getElementById('bg-audio');
  if (!btn || !audio) return;

  btn.addEventListener('click', () => {
    if (State.musicPlaying) {
      audio.pause();
      btn.innerHTML = '▶';
      eq && eq.classList.add('paused');
      State.musicPlaying = false;
    } else {
      audio.play().catch(() => {});
      btn.innerHTML = '⏸';
      eq && eq.classList.remove('paused');
      State.musicPlaying = true;
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key.toLowerCase() === 'm' && e.target.tagName !== 'INPUT') btn.click();
  });
}

/* ============================================================
   5. NAVIGATION
   ============================================================ */
function initNav() {
  const nav       = document.getElementById('nav');
  const hamburger = document.getElementById('nav-hamburger');
  const navLinks  = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    nav && nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  hamburger && hamburger.addEventListener('click', () => {
    navLinks && navLinks.classList.toggle('open');
  });

  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => navLinks && navLinks.classList.remove('open'));
  });
}

/* ============================================================
   6. PARALLAX SCROLLING
   ============================================================ */
function initParallax() {
  const bgs = document.querySelectorAll('.parallax-bg');
  function update() {
    bgs.forEach(bg => {
      const section = bg.closest('.parallax-section');
      if (!section) return;
      const rect   = section.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - window.innerHeight / 2;
      bg.style.transform = `translateY(${center * 0.28}px)`;
    });
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ============================================================
   7. SCROLL REVEAL
   ============================================================ */
function initScrollReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.13, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal, .timeline-item').forEach(el => observer.observe(el));
}

/* ============================================================
   8. PHOTO GALLERY MODAL
   ============================================================ */
function initGallery() {
  const items      = document.querySelectorAll('.gallery-item');
  const modal      = document.getElementById('gallery-modal');
  if (!modal) return;
  const modalImg   = document.getElementById('modal-img');
  const modalClose = document.getElementById('modal-close');
  const modalPrev  = document.getElementById('modal-prev');
  const modalNext  = document.getElementById('modal-next');
  const counter    = document.getElementById('modal-counter');

  function openModal(i) {
    State.galleryIndex = i;
    updateModal();
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
  function updateModal() {
    if (!modalImg) return;
    modalImg.src = State.galleryImages[State.galleryIndex];
    counter && (counter.textContent = `${State.galleryIndex + 1} / ${State.galleryImages.length}`);
  }
  function next() { State.galleryIndex = (State.galleryIndex + 1) % State.galleryImages.length; updateModal(); }
  function prev() { State.galleryIndex = (State.galleryIndex - 1 + State.galleryImages.length) % State.galleryImages.length; updateModal(); }

  items.forEach((item, i) => item.addEventListener('click', () => openModal(i)));
  modalClose && modalClose.addEventListener('click', closeModal);
  modalPrev  && modalPrev.addEventListener('click', prev);
  modalNext  && modalNext.addEventListener('click', next);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

  document.addEventListener('keydown', e => {
    if (!modal.classList.contains('open')) return;
    if (e.key === 'Escape')      closeModal();
    if (e.key === 'ArrowRight')  next();
    if (e.key === 'ArrowLeft')   prev();
  });

  // Swipe
  modal.addEventListener('touchstart', e => { State.touchStartX = e.changedTouches[0].screenX; }, { passive: true });
  modal.addEventListener('touchend',   e => {
    const diff = State.touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
  }, { passive: true });
}

/* ============================================================
   9. TYPEWRITER LOVE LETTER
   ============================================================ */
function initTypewriter() {
  const textEl = document.getElementById('typewriter-text');
  if (!textEl) return;

  const message = `My dearest love,

Every single day with you feels like the most beautiful scene from a movie I never want to end. Your laughter is my favourite sound, your smile is my favourite sight, and you — simply you — are my favourite everything.

On this special day, I want you to know that you are cherished beyond words, adored beyond measure, and loved in ways that no poem could ever fully capture.

Happy Birthday, my heart. You deserve the whole universe and then some.

Forever and always, with all of me. 💕`;

  const lines = message.split('\n');
  let li = 0, ci = 0, output = '', started = false;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !started) {
        started = true;
        typeNext();
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });

  obs.observe(textEl);

  function typeNext() {
    if (li >= lines.length) return;
    const line = lines[li];
    if (ci < line.length) {
      output += line[ci++];
      textEl.innerHTML = output.replace(/\n/g, '<br>') + '<span class="typewriter-cursor"></span>';
      const ch = line[ci - 1];
      setTimeout(typeNext, ch === ',' || ch === '.' ? 85 : 28);
    } else {
      output += '\n'; li++; ci = 0;
      setTimeout(typeNext, li < lines.length && lines[li] === '' ? 280 : 50);
    }
  }
}

/* ============================================================
   10. SMOOTH SCROLL
   ============================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });
}

/* ============================================================
   11. PETAL RAIN — continuous on main site
   ============================================================ */
function initPetalRain() {
  const container = document.getElementById('hearts-container');
  if (!container) return;
  const petals = ['🌸','🌺','🌷','🌼','✿'];
  function spawn() {
    const el = document.createElement('div');
    el.className = 'floating-heart';
    el.textContent = petals[Math.floor(Math.random() * petals.length)];
    el.style.left             = Math.random() * 100 + 'vw';
    el.style.fontSize         = (0.6 + Math.random() * 0.9) + 'rem';
    el.style.animationDuration = (10 + Math.random() * 10) + 's';
    el.style.animationDelay   = Math.random() * 5 + 's';
    container.appendChild(el);
    setTimeout(() => el.remove(), 25000);
  }
  setInterval(spawn, 2500);
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  runCinematicIntro();
  initNav();
  initMusic();
  spawnHearts();
  initPetalRain();
  initParallax();
  initScrollReveal();
  initGallery();
  initTypewriter();
  initSmoothScroll();

  if (typeof THREE !== 'undefined') {
    initGalaxy();
  } else {
    initCanvasParticles();
  }
});
