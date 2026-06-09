/**
 * Jaya Prakash S — DevOps & Cloud Engineer Portfolio
 * script.js
 */

'use strict';

/* ============================================================
   1. PARTICLE CANVAS BACKGROUND
   ============================================================ */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];

  const config = {
    count: 60,
    speed: 0.3,
    size: { min: 1, max: 2.5 },
    opacity: { min: 0.05, max: 0.3 },
    color: ['56,189,248', '129,140,248', '52,211,153'],
    connectionDistance: 140,
    connectionOpacity: 0.06,
  };

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createParticle() {
    const colorStr = config.color[Math.floor(Math.random() * config.color.length)];
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * config.speed,
      vy: (Math.random() - 0.5) * config.speed,
      r: config.size.min + Math.random() * (config.size.max - config.size.min),
      op: config.opacity.min + Math.random() * (config.opacity.max - config.opacity.min),
      color: colorStr,
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: config.count }, createParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < config.connectionDistance) {
          const alpha = config.connectionOpacity * (1 - dist / config.connectionDistance);
          ctx.beginPath();
          ctx.strokeStyle = `rgba(56,189,248,${alpha})`;
          ctx.lineWidth = 1;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw particles
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${p.op})`;
      ctx.fill();
    });
  }

  function update() {
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
      if (p.y < -10) p.y = H + 10;
      if (p.y > H + 10) p.y = -10;
    });
  }

  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }

  // Respect reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion) {
    init();
    loop();
    window.addEventListener('resize', () => { resize(); });
  }
})();


/* ============================================================
   2. TYPED TITLE EFFECT
   ============================================================ */
(function initTyped() {
  const el = document.getElementById('typed-title');
  if (!el) return;

  const titles = [
    'DevOps Engineer',
    'Cloud Engineer',
    'Infrastructure Automation',
    'CI/CD Architect',
  ];

  let titleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let delay = 120;

  function type() {
    const current = titles[titleIdx];

    if (isDeleting) {
      el.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      delay = 60;
    } else {
      el.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      delay = 100;
    }

    if (!isDeleting && charIdx === current.length) {
      isDeleting = true;
      delay = 1800; // pause at end
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      titleIdx = (titleIdx + 1) % titles.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }

  setTimeout(type, 800);
})();


/* ============================================================
   3. STICKY NAVBAR — scroll class + active link highlighting
   ============================================================ */
(function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    // Scrolled class
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active section highlight
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 90;
      if (window.scrollY >= top) current = sec.getAttribute('id');
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
})();


/* ============================================================
   4. MOBILE NAV TOGGLE
   ============================================================ */
(function initMobileNav() {
  const toggle   = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', isOpen.toString());
  });

  // Close on link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!toggle.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
      toggle.classList.remove('open');
    }
  });
})();


/* ============================================================
   5. SCROLL REVEAL ANIMATIONS
   ============================================================ */
(function initScrollReveal() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger siblings
          const siblings = entry.target.parentElement
            ? Array.from(entry.target.parentElement.querySelectorAll('.reveal'))
            : [];
          const idx = siblings.indexOf(entry.target);
          const staggerDelay = Math.min(idx * 80, 400);

          setTimeout(() => {
            entry.target.classList.add('visible');
          }, staggerDelay);

          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();


/* ============================================================
   6. BACK TO TOP BUTTON
   ============================================================ */
(function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ============================================================
   7. SMOOTH SCROLL for anchor links (fallback for older Safari)
   ============================================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const navHeight = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--nav-height')) || 70;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ============================================================
   8. FLOW STEP HOVER — subtle animation on project cards
   ============================================================ */
(function initFlowHover() {
  document.querySelectorAll('.flow-step').forEach(step => {
    step.addEventListener('mouseenter', () => {
      const icon = step.querySelector('.flow-icon');
      if (icon) icon.style.borderColor = 'rgba(56,189,248,0.5)';
    });
    step.addEventListener('mouseleave', () => {
      const icon = step.querySelector('.flow-icon');
      if (icon) icon.style.borderColor = '';
    });
  });
})();


/* ============================================================
   9. SKILL CATEGORY — stagger tag animation on hover
   ============================================================ */
(function initSkillHover() {
  document.querySelectorAll('.skill-category').forEach(card => {
    card.addEventListener('mouseenter', () => {
      const tags = card.querySelectorAll('.tag');
      tags.forEach((tag, i) => {
        setTimeout(() => {
          tag.style.transform = 'translateY(-2px)';
          tag.style.transition = 'transform 0.2s ease';
        }, i * 30);
      });
    });
    card.addEventListener('mouseleave', () => {
      card.querySelectorAll('.tag').forEach(tag => {
        tag.style.transform = '';
      });
    });
  });
})();


/* ============================================================
   10. STAT NUMBER COUNTER ANIMATION
   ============================================================ */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number');
  if (!counters.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el  = entry.target;
      const raw = el.textContent;
      const num = parseInt(raw);
      // Skip non-numeric stat values (e.g. "AWS")
      if (isNaN(num)) { observer.unobserve(el); return; }
      const suffix = raw.replace(String(num), '');
      let start = 0;
      const duration = 1200;
      const step = 16;
      const increment = num / (duration / step);

      const timer = setInterval(() => {
        start += increment;
        if (start >= num) {
          el.textContent = num + suffix;
          clearInterval(timer);
        } else {
          el.textContent = Math.floor(start) + suffix;
        }
      }, step);

      observer.unobserve(el);
    });
  }, { threshold: 0.6 });

  counters.forEach(c => observer.observe(c));
})();
