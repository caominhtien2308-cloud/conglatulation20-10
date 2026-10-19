/**
 * ============================================================
 *  MAIN.JS — Love Gift Website 20/10
 *  Full interactive experience with animations
 * ============================================================
 */

// ——— STATE ———
const State = {
  currentScreen: 0,   // 0=intro, 1=universe, 2=bouquet, 3=sphere, 4=gallery, 5=letter
  totalScreens: 6,
  musicPlaying: false,
  audioCtx: null,
  photoOverlayOpen: false,
  sphereRotX: 0,
  sphereRotY: 0,
  sphereVelX: 0,
  sphereVelY: 0,
  sphereAutoRotate: true,
  universeOffsetX: 0,
  universeOffsetY: 0,
  photos: [],       // merged placeholder + real photos
};

// ——— AUDIO (Web Audio API tone generator) ———
function initAudio() {
  if (State.audioCtx) return;
  try {
    State.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    createAmbientMusic();
  } catch(e) { console.warn('Audio not available', e); }
}

function createAmbientMusic() {
  if (!State.audioCtx) return;
  const ctx = State.audioCtx;
  // Soft ambient drone using oscillators
  const notes = [261.63, 329.63, 392, 440, 523.25]; // C, E, G, A, C5
  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(0, ctx.currentTime);
  gainNode.connect(ctx.destination);
  State.masterGain = gainNode;

  const reverb = ctx.createConvolver();
  // Simple reverb impulse
  const len = ctx.sampleRate * 3;
  const buf = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const arr = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) arr[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2);
  }
  reverb.buffer = buf;
  reverb.connect(gainNode);

  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.frequency.value = freq;
    osc.type = 'sine';
    g.gain.value = 0.03;
    osc.connect(g);
    g.connect(reverb);
    osc.start();
    // LFO for tremolo
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.1 + i * 0.05;
    lfoGain.gain.value = 0.015;
    lfo.connect(lfoGain);
    lfoGain.connect(g.gain);
    lfo.start();
  });
}

function toggleMusic() {
  initAudio();
  if (!State.masterGain) return;
  const btn = document.getElementById('music-toggle');
  if (State.musicPlaying) {
    State.masterGain.gain.linearRampToValueAtTime(0, State.audioCtx.currentTime + 1);
    State.musicPlaying = false;
    btn.textContent = '♪';
    btn.classList.remove('playing');
  } else {
    if (State.audioCtx.state === 'suspended') State.audioCtx.resume();
    State.masterGain.gain.linearRampToValueAtTime(1, State.audioCtx.currentTime + 1.5);
    State.musicPlaying = true;
    btn.textContent = '♫';
    btn.classList.add('playing');
  }
}

// ——— CANVAS PARTICLE SYSTEM ———
const ParticleSystem = (() => {
  let canvas, ctx, particles = [], raf;

  function init() {
    canvas = document.getElementById('particle-canvas');
    ctx = canvas.getContext('2d');
    resize();
    for (let i = 0; i < 120; i++) spawnParticle(true);
    tick();
    window.addEventListener('resize', resize);
  }

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function spawnParticle(random) {
    const colors = ['255,79,163', '184,107,255', '255,182,217', '255,255,255'];
    const c = colors[Math.floor(Math.random() * colors.length)];
    particles.push({
      x: random ? Math.random() * canvas.width : Math.random() * canvas.width,
      y: random ? Math.random() * canvas.height : canvas.height + 10,
      r: Math.random() * 1.8 + 0.3,
      alpha: Math.random() * 0.7 + 0.1,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -(Math.random() * 0.4 + 0.1),
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      twinkleOffset: Math.random() * Math.PI * 2,
      color: c,
    });
  }

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const now = performance.now() / 1000;
    particles = particles.filter(p => p.y > -10 && p.alpha > 0.01);
    while (particles.length < 120) spawnParticle(false);

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      const tw = Math.sin(now * p.twinkleSpeed * 60 + p.twinkleOffset) * 0.3 + 0.7;
      ctx.save();
      ctx.globalAlpha = p.alpha * tw;
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2.5);
      grad.addColorStop(0, `rgba(${p.color},1)`);
      grad.addColorStop(1, `rgba(${p.color},0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    raf = requestAnimationFrame(tick);
  }

  return { init };
})();

// ——— SCREEN MANAGER ———
const Screens = (() => {
  const ids = ['screen-intro','screen-universe','screen-bouquet','screen-sphere','screen-gallery','screen-letter'];
  let overlay;

  function init() {
    overlay = document.getElementById('transition-overlay');
    showScreen(0, true);
  }

  function showScreen(idx, instant) {
    const prevId = ids[State.currentScreen];
    const nextId = ids[idx];
    const prevEl = document.getElementById(prevId);
    const nextEl = document.getElementById(nextId);

    if (instant) {
      if (prevEl) prevEl.classList.remove('active');
      nextEl.classList.add('active');
      State.currentScreen = idx;
      updateNavDots();
      onScreenEnter(idx);
      return;
    }

    overlay.classList.add('fading');
    setTimeout(() => {
      if (prevEl) prevEl.classList.remove('active');
      nextEl.classList.add('active');
      State.currentScreen = idx;
      overlay.classList.remove('fading');
      updateNavDots();
      onScreenEnter(idx);
    }, 500);
  }

  function nextScreen() {
    if (State.currentScreen < State.totalScreens - 1) {
      showScreen(State.currentScreen + 1);
    }
  }

  function goToScreen(idx) { showScreen(idx); }

  function onScreenEnter(idx) {
    if (idx === 0) { /* handled by intro */ }
    if (idx === 1) Universe.onEnter();
    if (idx === 2) BouquetScene.onEnter();
    if (idx === 3) Sphere.onEnter();
    if (idx === 4) Gallery.onEnter();
    if (idx === 5) Letter.onEnter();

    const musicBtn = document.getElementById('music-toggle');
    const navDots = document.getElementById('nav-dots');
    if (idx > 0) {
      musicBtn.classList.add('visible');
      navDots.classList.add('visible');
    } else {
      musicBtn.classList.remove('visible');
      navDots.classList.remove('visible');
    }
  }

  function updateNavDots() {
    document.querySelectorAll('.nav-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === State.currentScreen - 1);
    });
  }

  return { init, nextScreen, goToScreen };
})();

// ——— INTRO SCREEN ———
const Intro = (() => {
  function init() {
    const mainText = document.getElementById('intro-main-text');
    const cursor   = document.getElementById('typing-cursor');
    const subText  = document.getElementById('intro-sub-text');
    const btn      = document.getElementById('btn-open-gift');

    const text = LOVE_DATA.intro.mainText;
    let i = 0;
    mainText.textContent = '';

    function typeChar() {
      if (i < text.length) {
        mainText.textContent += text[i++];
        setTimeout(typeChar, i === 1 ? 800 : 55 + Math.random() * 30);
      } else {
        cursor.style.display = 'none';
        setTimeout(() => {
          subText.classList.add('show');
          setTimeout(() => btn.classList.add('show'), 600);
        }, 400);
      }
    }
    setTimeout(typeChar, 600);

    btn.textContent = LOVE_DATA.intro.buttonText;
    subText.textContent = LOVE_DATA.intro.subText;
    btn.addEventListener('click', handleOpenGift);
    btn.addEventListener('touchend', handleOpenGift, { passive: true });
  }

  function handleOpenGift(e) {
    e.preventDefault();
    const touch = e.touches ? e.touches[0] : e;
    spawnRipple(touch.clientX || window.innerWidth / 2, touch.clientY || window.innerHeight / 2);
    spawnIntroParticles();
    setTimeout(() => Screens.nextScreen(), 800);
  }

  function spawnRipple(x, y) {
    const size = Math.max(window.innerWidth, window.innerHeight) * 2.5;
    const el = document.createElement('div');
    el.className = 'ripple';
    el.style.cssText = `width:${size}px;height:${size}px;left:${x - size/2}px;top:${y - size/2}px`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1000);
  }

  function spawnIntroParticles() {
    for (let i = 0; i < 40; i++) {
      setTimeout(() => {
        const el = document.createElement('div');
        el.className = 'petal';
        el.style.left  = Math.random() * 100 + 'vw';
        el.style.top   = Math.random() * 100 + 'vh';
        el.style.animation = `fadeInUp ${0.5 + Math.random()}s ease forwards`;
        el.style.opacity = Math.random() * 0.8;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 1200);
      }, i * 20);
    }
  }

  return { init };
})();

// ——— FLOATING PHOTO UNIVERSE ———
const Universe = (() => {
  let photos = [];
  let touchStartX = 0, touchStartY = 0;
  let offsetX = 0, offsetY = 0;
  let velX = 0, velY = 0;
  let lastTouchX = 0, lastTouchY = 0;
  let quoteTimer = null;
  let currentQuoteIdx = 0;

  function buildPhotos() {
    const container = document.getElementById('universe-container');
    container.innerHTML = '';
    const allPhotos = getMergedPhotos();
    photos = [];

    allPhotos.forEach((p, i) => {
      const el = document.createElement('div');
      el.className = 'float-photo';

      // Random sizing
      const w = 90 + Math.random() * 80;
      const h = w * (0.75 + Math.random() * 0.5);
      const rot = (Math.random() - 0.5) * 18;
      const depth = -100 + Math.random() * 200;
      const startX = (Math.random() - 0.5) * 200;
      const startY = (Math.random() - 0.5) * 180;
      const opacity = 0.55 + Math.random() * 0.45;
      const glowColor = Math.random() > 0.5 ? '255,79,163' : '184,107,255';
      const floatAmp   = 5 + Math.random() * 10;
      const floatSpeed = 3 + Math.random() * 4;
      const floatPhase = Math.random() * Math.PI * 2;

      el.style.cssText = `
        width: ${w}px;
        height: ${h}px;
        left: 50%;
        top: 50%;
        margin-left: ${startX - w/2}px;
        margin-top: ${startY - h/2}px;
        opacity: 0;
        box-shadow: 0 0 16px rgba(${glowColor},0.25), 0 0 40px rgba(${glowColor},0.1);
      `;
      el.dataset.rotBase = rot;
      el.dataset.depth = depth;
      el.dataset.startX = startX;
      el.dataset.startY = startY;
      el.dataset.floatAmp = floatAmp;
      el.dataset.floatSpeed = floatSpeed;
      el.dataset.floatPhase = floatPhase;
      el.dataset.photoIdx = i;

      if (p.src) {
        const img = document.createElement('img');
        img.src = p.src;
        img.loading = 'lazy';
        img.alt = p.caption || 'Memory';
        el.appendChild(img);
      } else {
        const ph = document.createElement('div');
        ph.className = 'photo-placeholder';
        ph.innerHTML = `<span class="ph-icon">📸</span><span>Ảnh kỷ niệm</span>`;
        el.appendChild(ph);
      }

      el.addEventListener('click', () => openPhotoOverlay(p, el));
      el.addEventListener('touchend', (ev) => {
        if (Math.abs(velX) < 1 && Math.abs(velY) < 1) openPhotoOverlay(p, el);
      }, { passive: true });

      container.appendChild(el);
      photos.push({ el, rotBase: rot, depth, startX, startY, floatAmp, floatSpeed, floatPhase, data: p, opacity });

      // Stagger fade-in
      setTimeout(() => { el.style.transition = 'opacity 0.8s ease'; el.style.opacity = opacity; }, i * 120);
    });
  }

  function getMergedPhotos() {
    const real = LOVE_DATA.photos || [];
    if (real.length > 0) return real;
    // Generate placeholders
    return Array.from({ length: LOVE_DATA.placeholderCount || 8 }, (_, i) => ({
      src: null,
      caption: ['Lần đầu mình gặp nhau.', 'Một ngày bình thường nhưng thật đáng nhớ.', 'Khoảnh khắc mà anh luôn muốn giữ lại.', 'Hy vọng chúng ta còn nhiều kỷ niệm như thế này.', 'Cảm ơn em đã ở đây.', 'Em là ánh sáng của anh.', 'Mỗi khoảnh khắc bên em đều đáng trân trọng.', 'Thương em nhiều lắm ♡'][i % 8],
      date: `${Math.floor(Math.random()*28+1).toString().padStart(2,'0')}/${Math.floor(Math.random()*12+1).toString().padStart(2,'0')}/2024`,
    }));
  }

  function animate(ts) {
    const t = ts / 1000;
    photos.forEach(({ el, rotBase, depth, startX, startY, floatAmp, floatSpeed, floatPhase }) => {
      const floatY = Math.sin(t / floatSpeed + floatPhase) * floatAmp;
      const floatX = Math.cos(t / (floatSpeed * 1.3) + floatPhase) * (floatAmp * 0.6);
      const scale  = 1 + depth / 2000;
      const tx = startX + floatX + offsetX * (1 + depth / 600);
      const ty = startY + floatY + offsetY * (1 + depth / 600);
      el.style.transform = `translateX(-50%) translateY(-50%) translate3d(${tx}px,${ty}px,${depth}px) rotate(${rotBase}deg) scale(${scale})`;
    });

    // Dampen velocity
    velX *= 0.96;
    velY *= 0.96;
    offsetX += velX;
    offsetY += velY;
    // Clamp
    offsetX = Math.max(-150, Math.min(150, offsetX));
    offsetY = Math.max(-120, Math.min(120, offsetY));

    if (State.currentScreen === 1) requestAnimationFrame(animate);
  }

  function setupTouchEvents() {
    const el = document.getElementById('screen-universe');
    el.addEventListener('touchstart', e => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      lastTouchX  = touchStartX;
      lastTouchY  = touchStartY;
      velX = 0; velY = 0;
    }, { passive: true });

    el.addEventListener('touchmove', e => {
      const dx = e.touches[0].clientX - lastTouchX;
      const dy = e.touches[0].clientY - lastTouchY;
      velX = dx * 0.5;
      velY = dy * 0.5;
      lastTouchX = e.touches[0].clientX;
      lastTouchY = e.touches[0].clientY;
    }, { passive: true });

    // Desktop mouse
    let dragging = false, mouseX = 0, mouseY = 0;
    el.addEventListener('mousedown', e => { dragging = true; mouseX = e.clientX; mouseY = e.clientY; velX = 0; velY = 0; });
    el.addEventListener('mousemove', e => {
      if (!dragging) return;
      velX = (e.clientX - mouseX) * 0.4;
      velY = (e.clientY - mouseY) * 0.4;
      mouseX = e.clientX; mouseY = e.clientY;
    });
    el.addEventListener('mouseup', () => { dragging = false; });
  }

  function startQuoteRotation() {
    const quotes = LOVE_DATA.loveQuotes;
    const displayEl = document.getElementById('love-quote-text');
    let idx = 0;

    function showNextQuote() {
      displayEl.classList.remove('visible');
      setTimeout(() => {
        displayEl.textContent = quotes[idx % quotes.length];
        idx++;
        displayEl.classList.add('visible');
        quoteTimer = setTimeout(() => {
          displayEl.classList.remove('visible');
          setTimeout(showNextQuote, 1500);
        }, 5000);
      }, 800);
    }
    setTimeout(showNextQuote, 1500);
  }

  function onEnter() {
    buildPhotos();
    setupTouchEvents();
    requestAnimationFrame(animate);
    startQuoteRotation();
  }

  return { onEnter, getMergedPhotos };
})();

// ——— PHOTO OVERLAY ———
function openPhotoOverlay(photo, el) {
  if (State.photoOverlayOpen) return;
  State.photoOverlayOpen = true;
  const overlay = document.getElementById('photo-overlay');
  const img     = document.getElementById('photo-overlay-img');
  const caption = document.getElementById('photo-overlay-caption');
  const date    = document.getElementById('photo-overlay-date');

  if (photo.src) {
    img.src = photo.src;
    img.style.display = 'block';
  } else {
    img.style.display = 'none';
  }
  caption.textContent = photo.caption || '';
  date.textContent    = photo.date || '';
  overlay.classList.add('open');
}

function closePhotoOverlay() {
  State.photoOverlayOpen = false;
  document.getElementById('photo-overlay').classList.remove('open');
}

// ——— BOUQUET SCENE ———
const BouquetScene = (() => {
  let petalsActive = false;

  function onEnter() {
    document.getElementById('bouquet-title').textContent = LOVE_DATA.bouquet.title;
    document.getElementById('bouquet-subtitle').textContent = LOVE_DATA.bouquet.subtitle;
    document.getElementById('btn-receive-flower').textContent = LOVE_DATA.bouquet.buttonText;
    document.getElementById('bouquet-gift-msg').textContent = LOVE_DATA.bouquet.giftMessage;
    document.getElementById('bouquet-gift-msg').classList.remove('show');
  }

  function receiveFlower() {
    if (petalsActive) return;
    petalsActive = true;
    spawnPetals(30);
    const gifMsg = document.getElementById('bouquet-gift-msg');
    gifMsg.classList.add('show');
    const btn = document.getElementById('btn-receive-flower');
    btn.style.opacity = '0.4';
    btn.style.pointerEvents = 'none';
  }

  function spawnPetals(count) {
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const el = document.createElement('div');
        el.className = 'fall-petal';
        const colors = ['#FFB6D9','#FF4FA3','#FFF2FA','#B86BFF'];
        el.style.cssText = `
          left: ${Math.random() * 100}vw;
          top: -10px;
          background: ${colors[Math.floor(Math.random() * colors.length)]};
          width: ${6 + Math.random() * 8}px;
          height: ${6 + Math.random() * 8}px;
          animation-duration: ${2 + Math.random() * 3}s;
          animation-delay: 0s;
          border-radius: ${Math.random() > 0.5 ? '50% 0' : '50%'};
        `;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 5500);
      }, i * 80);
    }
  }

  return { onEnter, receiveFlower };
})();

// ——— MEMORY SPHERE ———
const Sphere = (() => {
  let rotX = 0, rotY = 0, velX = 0, velY = 0;
  let lastX = 0, lastY = 0, dragging = false;
  let raf = null;

  function buildSphere() {
    const inner = document.getElementById('sphere-inner');
    inner.innerHTML = '';
    const photos = Universe.getMergedPhotos();
    const total  = Math.min(photos.length, 16);
    const phi    = Math.PI * (3 - Math.sqrt(5)); // golden angle

    for (let i = 0; i < total; i++) {
      const y   = 1 - (i / (total - 1)) * 2;
      const r   = Math.sqrt(1 - y * y);
      const theta = phi * i;
      const x   = Math.cos(theta) * r;
      const z   = Math.sin(theta) * r;
      const radius = 120;
      const el  = document.createElement('div');
      el.className = 'sphere-photo';
      const p = photos[i];
      if (p.src) {
        const img = document.createElement('img'); img.src = p.src; img.loading = 'lazy'; el.appendChild(img);
      } else {
        const ph = document.createElement('div'); ph.className = 'sphere-ph'; ph.textContent = '♡'; el.appendChild(ph);
      }
      el.style.transform = `translate3d(${x*radius}px,${y*radius}px,${z*radius}px)`;
      el.addEventListener('click', () => openPhotoOverlay(p, el));
      inner.appendChild(el);
    }
  }

  function animate() {
    if (!State.sphereAutoRotate || dragging) { /* skip auto when dragging */ }
    else { rotY += 0.3; }

    rotX += velX; rotY += velY;
    velX *= 0.94; velY *= 0.94;
    rotX = Math.max(-45, Math.min(45, rotX));

    document.getElementById('sphere-inner').style.transform =
      `rotateX(${rotX}deg) rotateY(${rotY}deg)`;

    if (State.currentScreen === 3) raf = requestAnimationFrame(animate);
  }

  function setupInput() {
    const container = document.getElementById('sphere-container');

    container.addEventListener('touchstart', e => {
      lastX = e.touches[0].clientX;
      lastY = e.touches[0].clientY;
      dragging = true; velX = 0; velY = 0;
    }, { passive: true });

    container.addEventListener('touchmove', e => {
      if (!dragging) return;
      const dx = e.touches[0].clientX - lastX;
      const dy = e.touches[0].clientY - lastY;
      velY = dx * 0.35;
      velX = dy * 0.35;
      lastX = e.touches[0].clientX;
      lastY = e.touches[0].clientY;
    }, { passive: true });

    container.addEventListener('touchend', () => { dragging = false; });

    container.addEventListener('mousedown', e => { dragging = true; lastX = e.clientX; lastY = e.clientY; velX = 0; velY = 0; });
    container.addEventListener('mousemove', e => {
      if (!dragging) return;
      velY = (e.clientX - lastX) * 0.35;
      velX = (e.clientY - lastY) * 0.35;
      lastX = e.clientX; lastY = e.clientY;
    });
    container.addEventListener('mouseup', () => { dragging = false; });
  }

  function onEnter() {
    buildSphere();
    setupInput();
    requestAnimationFrame(animate);
  }

  return { onEnter };
})();

// ——— GALLERY ———
const Gallery = (() => {
  function onEnter() {
    const grid = document.getElementById('gallery-grid');
    grid.innerHTML = '';
    const photos = Universe.getMergedPhotos();

    photos.forEach((p, i) => {
      const item = document.createElement('div');
      item.className = 'gallery-item';
      if (p.src) {
        const img = document.createElement('img');
        img.src = p.src; img.loading = 'lazy'; img.alt = p.caption || 'Memory';
        item.appendChild(img);
      } else {
        const ph = document.createElement('div');
        ph.className = 'gallery-ph';
        ph.innerHTML = `<span>📷</span><small>Ảnh ${i+1}</small>`;
        item.appendChild(ph);
      }
      if (p.caption) {
        const badge = document.createElement('div');
        badge.className = 'caption-badge';
        badge.textContent = p.caption;
        item.appendChild(badge);
      }
      item.addEventListener('click', () => openPhotoOverlay(p, item));
      grid.appendChild(item);
    });
  }

  return { onEnter };
})();

// ——— LOVE LETTER ———
const Letter = (() => {
  function onEnter() {
    const d = LOVE_DATA.loveLetter;
    document.getElementById('letter-to').textContent   = d.toLine;
    document.getElementById('letter-title').textContent = d.title;
    document.getElementById('letter-from').textContent  = d.fromLine;
    document.getElementById('letter-date-sig').textContent = d.dateSignature;

    const body = document.getElementById('letter-body');
    body.innerHTML = '';
    d.paragraphs.forEach((para, i) => {
      const p = document.createElement('p');
      p.textContent = para;
      body.appendChild(p);
      setTimeout(() => p.classList.add('revealed'), 300 + i * 350);
    });
  }

  return { onEnter };
})();

// ——— NAV DOTS SETUP ———
function setupNavDots() {
  const container = document.getElementById('nav-dots');
  container.innerHTML = '';
  const labels = ['Universe', 'Bouquet', 'Sphere', 'Gallery', 'Letter'];
  labels.forEach((label, i) => {
    const dot = document.createElement('div');
    dot.className = 'nav-dot';
    dot.setAttribute('aria-label', label);
    dot.addEventListener('click', () => Screens.goToScreen(i + 1));
    container.appendChild(dot);
  });
}

// ——— INIT ———
document.addEventListener('DOMContentLoaded', () => {
  ParticleSystem.init();
  setupNavDots();
  Screens.init();
  Intro.init();

  // Music toggle
  document.getElementById('music-toggle').addEventListener('click', toggleMusic);

  // Photo overlay close
  document.getElementById('photo-overlay-close').addEventListener('click', closePhotoOverlay);
  document.getElementById('photo-overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('photo-overlay')) closePhotoOverlay();
  });

  // Bouquet receive button
  document.getElementById('btn-receive-flower').addEventListener('click', BouquetScene.receiveFlower);

  // Nav buttons
  document.querySelectorAll('[data-nav]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = parseInt(btn.dataset.nav);
      Screens.goToScreen(target);
    });
  });

  // Set site title
  document.title = LOVE_DATA.general.siteTitle;
});
