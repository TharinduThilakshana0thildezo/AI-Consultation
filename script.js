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

  /* ---------------- Subtle parallax on hero visual ---------------- */
  const visualCore = document.querySelector('.visual-core');
  const heroSection = document.querySelector('.hero');
  if (visualCore && heroSection && window.matchMedia('(pointer: fine)').matches) {
    heroSection.addEventListener('mousemove', (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 14;
      const y = (e.clientY / innerHeight - 0.5) * 14;
      visualCore.style.transform = `translate(${x}px, ${y}px)`;
    });
    heroSection.addEventListener('mouseleave', () => {
      visualCore.style.transform = 'translate(0,0)';
    });
  }

});
