/* =================================================================
   AI CONSULTATION — SITE SCRIPT
   ================================================================= */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------------- Footer year ---------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------- Sticky header on scroll ---------------- */
  const header = document.getElementById('siteHeader');
  const toggleHeaderState = () => {
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  toggleHeaderState();
  window.addEventListener('scroll', toggleHeaderState, { passive: true });

  /* ---------------- Mobile menu ---------------- */
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');

  const closeMenu = () => {
    menuToggle.classList.remove('active');
    mobileNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  menuToggle.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    menuToggle.classList.toggle('active', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  /* ---------------- Smooth scroll for in-page anchors ---------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId.length > 1) {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const offset = 90;
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    });
  });

  /* ---------------- Hero ambient particles ---------------- */
  const particleField = document.getElementById('heroParticles');
  if (particleField) {
    const count = window.innerWidth < 600 ? 14 : 28;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.className = 'particle';
      p.style.left = `${Math.random() * 100}%`;
      p.style.bottom = `${-10 - Math.random() * 20}%`;
      p.style.animationDuration = `${10 + Math.random() * 10}s`;
      p.style.animationDelay = `${Math.random() * 10}s`;
      p.style.opacity = (0.3 + Math.random() * 0.4).toFixed(2);
      particleField.appendChild(p);
    }
  }

  /* ---------------- Scroll reveal (IntersectionObserver) ---------------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('revealed'));
  }

  /* ---------------- Animated stat counters ---------------- */
  const statNumbers = document.querySelectorAll('.stat-number[data-count]');
  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1400;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(eased * target);
      el.textContent = `${value}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if ('IntersectionObserver' in window && statNumbers.length) {
    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => statObserver.observe(el));
  }

  /* ---------------- FAQ accordion ---------------- */
  const accordionItems = document.querySelectorAll('.accordion-item');
  accordionItems.forEach(item => {
    const trigger = item.querySelector('.accordion-trigger');
    const panel = item.querySelector('.accordion-panel');

    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      accordionItems.forEach(other => {
        other.classList.remove('active');
        other.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'false');
        other.querySelector('.accordion-panel').style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
        panel.style.maxHeight = `${panel.scrollHeight}px`;
      }
    });
  });

  /* ---------------- Select field floating label support ---------------- */
  document.querySelectorAll('.field select').forEach(select => {
    const field = select.closest('.field');
    const sync = () => field.classList.toggle('select-filled', select.value !== '');
    select.addEventListener('change', sync);
    sync();
  });

  /* ---------------- Demo form validation ---------------- */
  const demoForm = document.getElementById('demoForm');
  const formSuccess = document.getElementById('formSuccess');

  const validators = {
    fullName: (v) => v.trim().length >= 2,
    companyName: (v) => v.trim().length >= 2,
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
    phone: (v) => /^[0-9+()\-.\s]{7,}$/.test(v.trim()),
    serviceInterest: (v) => v.trim().length > 0,
    message: (v) => v.trim().length >= 10
  };

  const validateField = (input) => {
    const field = input.closest('.field');
    const isValid = validators[input.name] ? validators[input.name](input.value) : true;
    field.classList.toggle('invalid', !isValid);
    return isValid;
  };

  if (demoForm) {
    Array.from(demoForm.elements).forEach(input => {
      if (!input.name) return;
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => {
        if (input.closest('.field').classList.contains('invalid')) validateField(input);
      });
    });

    demoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let formValid = true;

      Array.from(demoForm.elements).forEach(input => {
        if (!input.name) return;
        if (!validateField(input)) formValid = false;
      });

      if (formValid) {
        formSuccess.classList.add('show');
        demoForm.reset();
        document.querySelectorAll('.field.select-filled').forEach(f => f.classList.remove('select-filled'));
        setTimeout(() => formSuccess.classList.remove('show'), 6000);
      } else {
        const firstInvalid = demoForm.querySelector('.field.invalid input, .field.invalid select, .field.invalid textarea');
        if (firstInvalid) firstInvalid.focus();
      }
    });
  }

  /* ---------------- Our Edge — Tabs ---------------- */
  const edgeTabBtns = document.querySelectorAll('.edge-tab-btn');
  const edgeTabPanels = document.querySelectorAll('.edge-tab-panel');

  if (edgeTabBtns.length) {
    edgeTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabIndex = btn.getAttribute('data-tab');

        // Deactivate all
        edgeTabBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
        edgeTabPanels.forEach(p => p.classList.remove('active'));

        // Activate selected
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        const panel = document.querySelector(`.edge-tab-panel[data-panel="${tabIndex}"]`);
        if (panel) panel.classList.add('active');
      });
    });
  }

  /* ---------------- Methodology Slideshow ---------------- */
  const msTrack     = document.getElementById('methodologyTrack');
  const msPrev      = document.getElementById('msPrev');
  const msNext      = document.getElementById('msNext');
  const msDots      = document.querySelectorAll('.ms-dot');
  const msSlides    = document.querySelectorAll('.ms-slide');
  let currentSlide  = 0;
  let msAutoTimer   = null;

  const goToSlide = (index) => {
    msSlides.forEach(s => s.classList.remove('active'));
    msDots.forEach(d => d.classList.remove('active'));

    currentSlide = (index + msSlides.length) % msSlides.length;
    msSlides[currentSlide].classList.add('active');
    msDots[currentSlide].classList.add('active');
  };

  const startAutoAdvance = () => {
    clearInterval(msAutoTimer);
    msAutoTimer = setInterval(() => goToSlide(currentSlide + 1), 6000);
  };

  if (msSlides.length) {
    msPrev && msPrev.addEventListener('click', () => { goToSlide(currentSlide - 1); });
    msNext && msNext.addEventListener('click', () => { goToSlide(currentSlide + 1); });

    msDots.forEach(dot => {
      dot.addEventListener('click', () => {
        goToSlide(parseInt(dot.getAttribute('data-slide'), 10));
      });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      const slideshow = document.querySelector('.methodology-slideshow');
      if (slideshow && slideshow.matches(':hover')) {
        if (e.key === 'ArrowLeft') { goToSlide(currentSlide - 1); }
        if (e.key === 'ArrowRight') { goToSlide(currentSlide + 1); }
      }
    });

    // Touch/swipe support
    let msStartX = 0;
    const msTrackEl = document.getElementById('methodologyTrack');
    if (msTrackEl) {
      msTrackEl.addEventListener('touchstart', e => { msStartX = e.touches[0].clientX; }, { passive: true });
      msTrackEl.addEventListener('touchend', e => {
        const diff = msStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) {
          diff > 0 ? goToSlide(currentSlide + 1) : goToSlide(currentSlide - 1);
        }
      }, { passive: true });
    }

    // Auto-advance is DISABLED — user controls only
    // To re-enable: uncomment the line below
    // startAutoAdvance();
  }

});

/* =================================================================
   GOLDEN STAR SECTION BREAK — Canvas particle animation
   ================================================================= */
(function initStarBreaks() {
  const canvases = document.querySelectorAll('.star-fall-canvas');
  if (!canvases.length) return;

  // Gold star color palette
  const GOLD_COLORS = [
    'rgba(228,199,107,',   // gold-light
    'rgba(201,168,76,',    // gold
    'rgba(245,223,150,',   // gold-hover
    'rgba(255,215,0,',     // bright gold
    'rgba(184,149,42,',    // dark gold
  ];

  class Star {
    constructor(canvasW, canvasH) {
      this.canvasW = canvasW;
      this.canvasH = canvasH;
      this.reset(true);
    }

    reset(initial) {
      this.x = Math.random() * this.canvasW;
      this.y = initial ? Math.random() * -this.canvasH * 0.5 - 10 : -12;
      this.size = 3 + Math.random() * 5;       // star size 3–8px
      this.speed = 0.6 + Math.random() * 1.2;  // fall speed
      this.drift = (Math.random() - 0.5) * 0.5; // horizontal drift
      this.opacity = 0;
      this.maxOpacity = 0.5 + Math.random() * 0.5;
      this.fadeIn = 0.02 + Math.random() * 0.03;
      this.fadeOut = 0.01 + Math.random() * 0.02;
      this.fading = false;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.04;
      this.colorIdx = Math.floor(Math.random() * GOLD_COLORS.length);
      this.twinklePhase = Math.random() * Math.PI * 2;
      this.twinkleSpeed = 0.03 + Math.random() * 0.04;
    }

    update() {
      this.y += this.speed;
      this.x += this.drift;
      this.rotation += this.rotationSpeed;
      this.twinklePhase += this.twinkleSpeed;

      if (!this.fading && this.opacity < this.maxOpacity) {
        this.opacity = Math.min(this.opacity + this.fadeIn, this.maxOpacity);
      }

      if (this.y > this.canvasH * 0.7) this.fading = true;

      if (this.fading) {
        this.opacity -= this.fadeOut;
      }

      return this.opacity > 0 && this.y < this.canvasH + 20;
    }

    draw(ctx) {
      const twinkle = 0.85 + 0.15 * Math.sin(this.twinklePhase);
      const alpha = Math.max(0, this.opacity * twinkle);
      const color = GOLD_COLORS[this.colorIdx];

      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = alpha;

      // Draw 5-pointed star shape
      const outerR = this.size;
      const innerR = this.size * 0.4;
      const points = 5;
      ctx.beginPath();
      for (let i = 0; i < points * 2; i++) {
        const angle = (i * Math.PI) / points - Math.PI / 2;
        const r = i % 2 === 0 ? outerR : innerR;
        const sx = Math.cos(angle) * r;
        const sy = Math.sin(angle) * r;
        i === 0 ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy);
      }
      ctx.closePath();

      // Gradient fill
      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, outerR);
      grad.addColorStop(0, color + '1)');
      grad.addColorStop(0.5, color + (alpha * 0.8).toFixed(2) + ')');
      grad.addColorStop(1, color + '0)');
      ctx.fillStyle = grad;
      ctx.fill();

      // Glow effect
      ctx.shadowColor = color + '0.9)';
      ctx.shadowBlur = outerR * 3;
      ctx.fill();

      ctx.restore();
    }
  }

  canvases.forEach(canvas => {
    const container = canvas.parentElement;
    let stars = [];
    let animId = null;
    let isVisible = false;

    const resize = () => {
      canvas.width  = container.offsetWidth;
      canvas.height = container.offsetHeight;
      stars.forEach(s => { s.canvasW = canvas.width; s.canvasH = canvas.height; });
    };

    const initStars = () => {
      const density = Math.floor(canvas.width / 28);
      const count = Math.max(12, Math.min(density, 55));
      stars = Array.from({ length: count }, () => new Star(canvas.width, canvas.height));
    };

    const render = () => {
      if (!isVisible) return;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = stars.length - 1; i >= 0; i--) {
        const alive = stars[i].update();
        stars[i].draw(ctx);
        if (!alive) {
          stars[i].reset(false);
        }
      }
      animId = requestAnimationFrame(render);
    };

    // Intersection observer to only animate when visible
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        isVisible = entry.isIntersecting;
        if (isVisible && !animId) {
          render();
        } else if (!isVisible && animId) {
          cancelAnimationFrame(animId);
          animId = null;
        }
      });
    }, { threshold: 0 });

    resize();
    initStars();
    observer.observe(container);

    window.addEventListener('resize', () => {
      resize();
      initStars();
    }, { passive: true });
  });
})();
