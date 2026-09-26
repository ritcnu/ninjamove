/* ============================================================
   NILMANGKORN - script.js
   ============================================================ */

'use strict';

// ──────────────────────────────────────────────
// Init AOS
// ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  AOS.init({
    duration: 700,
    once: true,
    offset: 60,
    easing: 'ease-out-cubic',
  });

  initNavbar();
  initMobileMenu();
  initParticles();
  initCounters();
  initContactForm();
  initBackToTop();
  initSmoothScroll();
  initActiveNavLink();
});

// ──────────────────────────────────────────────
// NAVBAR — scroll behavior
// ──────────────────────────────────────────────
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ──────────────────────────────────────────────
// ACTIVE NAV LINK — highlight on scroll
// ──────────────────────────────────────────────
function initActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => link.classList.remove('active'));
          const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
          if (active) active.classList.add('active');
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach((s) => observer.observe(s));
}

// ──────────────────────────────────────────────
// MOBILE MENU
// ──────────────────────────────────────────────
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on link click
  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

// ──────────────────────────────────────────────
// SMOOTH SCROLL for anchor links
// ──────────────────────────────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

// ──────────────────────────────────────────────
// CANVAS PARTICLES — hero background
// ──────────────────────────────────────────────
function initParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'particleCanvas';
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];

  const resize = () => {
    W = canvas.width = container.offsetWidth;
    H = canvas.height = container.offsetHeight;
  };

  const COLORS = ['rgba(0,188,212,', 'rgba(245,158,11,', 'rgba(255,255,255,'];

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.r = Math.random() * 2 + 0.5;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `${this.color}${this.alpha})`;
      ctx.fill();
    }
  }

  const init = () => {
    resize();
    particles = Array.from({ length: 80 }, () => new Particle());
  };

  const drawLines = () => {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0,188,212,${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  };

  const animate = () => {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p) => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(animate);
  };

  window.addEventListener('resize', resize, { passive: true });
  init();
  animate();
}

// ──────────────────────────────────────────────
// COUNTER ANIMATION — stats section
// ──────────────────────────────────────────────
function initCounters() {
  const counters = document.querySelectorAll('.stat-number');
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const start = performance.now();

    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    };

    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((c) => observer.observe(c));
}

// ──────────────────────────────────────────────
// CONTACT FORM — client-side handling
// ──────────────────────────────────────────────
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Simple validation
    const required = form.querySelectorAll('[required]');
    let valid = true;
    required.forEach((field) => {
      field.style.borderColor = '';
      if (!field.value.trim()) {
        field.style.borderColor = '#ef4444';
        valid = false;
      }
    });

    if (!valid) {
      showToast('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน', 'error');
      return;
    }

    // Simulate submission
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> กำลังส่ง...';

    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> ส่งข้อความ';
      form.reset();
      showToast('ส่งข้อความสำเร็จ! ทีมงานจะติดต่อกลับโดยเร็ว', 'success');
    }, 1500);
  });

  // Clear error style on input
  form.querySelectorAll('input, textarea, select').forEach((field) => {
    field.addEventListener('input', () => { field.style.borderColor = ''; });
  });
}

// ──────────────────────────────────────────────
// TOAST NOTIFICATION
// ──────────────────────────────────────────────
function showToast(message, type = 'success') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';

  const iconClass = type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation';
  const iconColor = type === 'success' ? 'var(--accent-cyan)' : '#ef4444';
  toast.style.borderLeftColor = iconColor;

  toast.innerHTML = `
    <i class="fas ${iconClass}" style="color:${iconColor};font-size:1.3rem;"></i>
    <span>${message}</span>
  `;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => { toast.classList.add('show'); });
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

// ──────────────────────────────────────────────
// BACK TO TOP BUTTON
// ──────────────────────────────────────────────
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
