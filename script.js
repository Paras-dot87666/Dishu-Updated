/* ============================================================
   WOMEN'S DAY — DISHU ❤️  |  script.js
   Rain · Lightning · Cards · Music · Hearts · Animations
   ============================================================ */

(function () {
  'use strict';

  /* ──────────────────────────────────────────
     0. WAIT FOR DOM
  ────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    setupRain();
    setupLightning();
    setupFloatingHearts();
    setupMusic();
    setupScrollObserver();
    setupPage3Activation();
  }

  /* ──────────────────────────────────────────
     1. PAGE NAVIGATION
  ────────────────────────────────────────── */
  window.goToPage = function (pageNum) {
    const all = document.querySelectorAll('.page');
    all.forEach(p => {
      p.classList.remove('active');
      p.style.display = 'none';
    });

    const target = document.getElementById('page' + pageNum);
    if (!target) return;

    target.style.display = 'flex';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        target.classList.add('active');
      });
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (pageNum === 3) {
      activateCardsPage();
    }
  };

  /* ──────────────────────────────────────────
     2. CARDS PAGE ACTIVATION
  ────────────────────────────────────────── */
  function setupPage3Activation() {
    const p3 = document.getElementById('page3');
    if (p3) {
      p3.style.display = 'none';
      p3.style.opacity = '0';
    }
  }

  function activateCardsPage() {
    const p3 = document.getElementById('page3');
    if (!p3) return;
    p3.style.display = 'block';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        p3.classList.add('active');
        p3.style.opacity = '1';
      });
    });
    observeCards();
  }

  /* ──────────────────────────────────────────
     3. INTERSECTION OBSERVER — CARD REVEALS
  ────────────────────────────────────────── */
  function setupScrollObserver() {
    // Will be called when page3 activates
  }

  function observeCards() {
    const cards = document.querySelectorAll('.story-card');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const card = entry.target;
            // Stagger based on card index
            const idx = Array.from(cards).indexOf(card);
            card.style.transitionDelay = `${idx * 0.05}s`;
            card.classList.add('visible');

            // Final card triggers special effects
            if (card.classList.contains('final-card')) {
              setTimeout(triggerFinalCardEffects, 600);
            }

            observer.unobserve(card);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.12
      }
    );

    cards.forEach(card => observer.observe(card));
  }

  /* ──────────────────────────────────────────
     4. FINAL CARD — HEART EXPLOSION
  ────────────────────────────────────────── */
  function triggerFinalCardEffects() {
    burstHearts();
    spawnFinalFloatingHearts();
  }

  function burstHearts() {
    const container = document.getElementById('heartExplosion');
    if (!container) return;

    const emojis = ['❤️', '💖', '💗', '💓', '💞', '💕', '🌸', '✨', '💫'];
    const count = 28;

    for (let i = 0; i < count; i++) {
      const el = document.createElement('span');
      el.classList.add('burst-heart');

      const angle = (i / count) * 360;
      const dist  = 80 + Math.random() * 180;
      const rad   = (angle * Math.PI) / 180;
      const tx    = Math.cos(rad) * dist;
      const ty    = Math.sin(rad) * dist;

      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      el.style.setProperty('--tx', `${tx}px`);
      el.style.setProperty('--ty', `${ty}px`);
      el.style.setProperty('--d',  `${0.8 + Math.random() * 0.8}s`);
      el.style.setProperty('--delay', `${Math.random() * 0.5}s`);
      el.style.fontSize = `${0.8 + Math.random() * 1.0}rem`;

      container.appendChild(el);
    }

    // Re-trigger every few seconds
    setTimeout(() => {
      container.innerHTML = '';
      burstHearts();
    }, 4000);
  }

  function spawnFinalFloatingHearts() {
    const container = document.getElementById('finalHearts');
    if (!container) return;

    const emojis = ['❤️', '💖', '💗', '🌸', '✨'];
    for (let i = 0; i < 16; i++) {
      const el = document.createElement('span');
      el.style.cssText = `
        position: absolute;
        bottom: -40px;
        left: ${Math.random() * 100}%;
        font-size: ${0.7 + Math.random() * 1.1}rem;
        opacity: 0;
        animation: floatUp ${6 + Math.random() * 6}s ${Math.random() * 4}s ease-in infinite;
        pointer-events: none;
        filter: drop-shadow(0 0 6px rgba(232,93,138,0.6));
      `;
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      container.appendChild(el);
    }
  }

  /* ──────────────────────────────────────────
     5. RAIN CANVAS
  ────────────────────────────────────────── */
  function setupRain() {
    const canvas = document.getElementById('rainCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W, H, drops;

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
      createDrops();
    }

    function createDrops() {
      const count = Math.floor(W * 0.065);
      drops = Array.from({ length: count }, () => createDrop());
    }

    function createDrop() {
      return {
        x:      Math.random() * W,
        y:      Math.random() * H,
        len:    8  + Math.random() * 22,
        speed:  4  + Math.random() * 9,
        opacity: 0.18 + Math.random() * 0.55,
        width:  0.5 + Math.random() * 0.8,
        // glow state
        glowing: Math.random() < 0.15,
        glowTimer: Math.random() * 60,
        glowInterval: 40 + Math.random() * 80,
      };
    }

    function draw() {
      // Fade trail
      ctx.fillStyle = 'rgba(5, 8, 16, 0.22)';
      ctx.fillRect(0, 0, W, H);

      drops.forEach(d => {
        // Update glow blink
        d.glowTimer++;
        if (d.glowTimer > d.glowInterval) {
          d.glowing = !d.glowing;
          d.glowTimer = 0;
          d.glowInterval = 40 + Math.random() * 80;
        }

        const alpha = d.glowing
          ? Math.min(1, d.opacity + 0.35)
          : d.opacity;

        ctx.save();

        if (d.glowing) {
          ctx.shadowColor = '#FFDBE9';
          ctx.shadowBlur  = 8;
        }

        // Gradient rain drop
        const grad = ctx.createLinearGradient(d.x, d.y, d.x, d.y + d.len);
        grad.addColorStop(0, `rgba(255, 219, 233, 0)`);
        grad.addColorStop(0.5, `rgba(255, 219, 233, ${alpha})`);
        grad.addColorStop(1, `rgba(255, 219, 233, ${alpha * 0.5})`);

        ctx.strokeStyle = grad;
        ctx.lineWidth   = d.width;
        ctx.lineCap     = 'round';

        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - 1.5, d.y + d.len);
        ctx.stroke();

        ctx.restore();

        // Move drop
        d.y += d.speed;
        if (d.y - d.len > H) {
          d.y      = -d.len;
          d.x      = Math.random() * W;
          d.opacity = 0.18 + Math.random() * 0.55;
          d.glowing = Math.random() < 0.15;
        }
      });

      requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    resize();
    draw();
  }

  /* ──────────────────────────────────────────
     6. LIGHTNING FLASHES
  ────────────────────────────────────────── */
  function setupLightning() {
    const el = document.getElementById('lightning');
    if (!el) return;

    function scheduleFlash() {
      const delay = 4000 + Math.random() * 12000;
      setTimeout(() => {
        triggerFlash(el);
        scheduleFlash();
      }, delay);
    }

    function triggerFlash(el) {
      el.classList.add('flash');
      setTimeout(() => el.classList.remove('flash'), 280);

      // Sometimes double flash
      if (Math.random() < 0.4) {
        setTimeout(() => {
          el.classList.add('flash');
          setTimeout(() => el.classList.remove('flash'), 200);
        }, 350);
      }
    }

    scheduleFlash();
  }

  /* ──────────────────────────────────────────
     7. FLOATING HEARTS (background ambience)
  ────────────────────────────────────────── */
  function setupFloatingHearts() {
    const container = document.getElementById('floatingHeartsContainer');
    if (!container) return;

    const emojis = ['❤️', '💖', '💗', '💓', '💕', '🌸'];
    const count  = 12;

    for (let i = 0; i < count; i++) {
      const el = document.createElement('span');
      el.classList.add('float-heart');
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      el.style.left  = `${Math.random() * 100}%`;
      el.style.fontSize = `${0.6 + Math.random() * 0.8}rem`;
      el.style.setProperty('--dur',   `${7 + Math.random() * 8}s`);
      el.style.setProperty('--delay', `${Math.random() * 10}s`);
      container.appendChild(el);
    }
  }

  /* ──────────────────────────────────────────
     8. MUSIC CONTROL
  ────────────────────────────────────────── */
  function setupMusic() {
    const btn       = document.getElementById('musicBtn');
    const audio     = document.getElementById('bgMusic');
    const playIcon  = document.getElementById('playIcon');
    const pauseIcon = document.getElementById('pauseIcon');

    if (!btn || !audio) return;

    let isPlaying = false;

    btn.addEventListener('click', () => {
      if (isPlaying) {
        audio.pause();
        playIcon.style.display  = 'block';
        pauseIcon.style.display = 'none';
        btn.style.borderColor   = 'rgba(255, 219, 233, 0.18)';
      } else {
        audio.play().catch(() => {
          // Autoplay blocked — user must interact first (already done by click)
        });
        playIcon.style.display  = 'none';
        pauseIcon.style.display = 'block';
        btn.style.borderColor   = '#FFDBE9';
      }
      isPlaying = !isPlaying;
    });

    audio.volume = 0.55;

    // Graceful fade in
    audio.addEventListener('play', () => {
      audio.volume = 0;
      fadeVolume(audio, 0, 0.55, 2500);
    });
  }

  function fadeVolume(audio, from, to, duration) {
    const steps    = 50;
    const stepTime = duration / steps;
    const delta    = (to - from) / steps;
    let   current  = from;
    const timer = setInterval(() => {
      current += delta;
      if ((delta > 0 && current >= to) || (delta < 0 && current <= to)) {
        audio.volume = Math.max(0, Math.min(1, to));
        clearInterval(timer);
      } else {
        audio.volume = Math.max(0, Math.min(1, current));
      }
    }, stepTime);
  }

  /* ──────────────────────────────────────────
     9. SMOOTH PARALLAX ON MOUSE MOVE (landing)
  ────────────────────────────────────────── */
  document.addEventListener('mousemove', (e) => {
    const orbs = document.querySelectorAll('.orb');
    const cx   = window.innerWidth  / 2;
    const cy   = window.innerHeight / 2;
    const dx   = (e.clientX - cx) / cx;
    const dy   = (e.clientY - cy) / cy;

    orbs.forEach((orb, i) => {
      const factor = (i === 0) ? 18 : 14;
      orb.style.transform = `translate(${dx * factor}px, ${dy * factor}px) scale(${i === 0 ? 1 : 1.05})`;
    });
  });

  /* ──────────────────────────────────────────
     10. CARD HOVER — RIPPLE GLOW
  ────────────────────────────────────────── */
  document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.card-inner');
    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mx', `${x}px`);
      card.style.setProperty('--my', `${y}px`);
    });
  });

  /* ──────────────────────────────────────────
     11. THUNDER SOUND VISUAL (extra rumble effect)
  ────────────────────────────────────────── */
  function setupThunderRumble() {
    setInterval(() => {
      if (Math.random() < 0.3) {
        const body = document.body;
        body.style.transform = 'translate(0.5px, 0.3px)';
        setTimeout(() => {
          body.style.transform = 'translate(-0.3px, 0.2px)';
          setTimeout(() => {
            body.style.transform = '';
          }, 60);
        }, 50);
      }
    }, 6000);
  }
  setupThunderRumble();

  /* ──────────────────────────────────────────
     12. CURSOR TRAIL (sparkle)
  ────────────────────────────────────────── */
  const sparkles = [];
  const MAX_SPARKLES = 12;

  document.addEventListener('mousemove', (e) => {
    if (Math.random() > 0.3) return;

    const sp = document.createElement('div');
    sp.style.cssText = `
      position: fixed;
      left: ${e.clientX}px;
      top:  ${e.clientY}px;
      width: 4px;
      height: 4px;
      background: #FFDBE9;
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      box-shadow: 0 0 6px #FFDBE9;
      transform: translate(-50%,-50%);
      animation: sparkleOut 0.7s ease-out forwards;
    `;
    document.body.appendChild(sp);
    sparkles.push(sp);

    if (sparkles.length > MAX_SPARKLES) {
      const old = sparkles.shift();
      old.remove();
    }

    setTimeout(() => {
      sp.remove();
      const idx = sparkles.indexOf(sp);
      if (idx > -1) sparkles.splice(idx, 1);
    }, 700);
  });

  // Inject sparkle keyframe
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    @keyframes sparkleOut {
      0%   { opacity:1; transform: translate(-50%,-50%) scale(1); }
      100% { opacity:0; transform: translate(-50%,-50%) scale(0) translateY(-12px); }
    }
  `;
  document.head.appendChild(styleEl);

  /* ──────────────────────────────────────────
     13. INITIAL PAGE SETUP
  ────────────────────────────────────────── */
  // Make sure only page1 is shown initially
  const pages = document.querySelectorAll('.page');
  pages.forEach((p, i) => {
    if (i === 0) {
      p.style.display = 'flex';
      p.classList.add('active');
    } else {
      p.style.display = 'none';
      p.classList.remove('active');
    }
  });

})();
