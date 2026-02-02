(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // Year
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Mobile nav
  const toggle = $('.nav-toggle');
  const menu = $('#navMenu');
  if (toggle && menu) {
    const closeMenu = () => {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    };

    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close on link click
    $$('#navMenu a').forEach(a => a.addEventListener('click', closeMenu));

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!menu.classList.contains('is-open')) return;
      const target = e.target;
      if (target instanceof Node && !menu.contains(target) && !toggle.contains(target)) closeMenu();
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
  }

  // Smooth scroll (fallback / consistent offset)
  const header = $('.site-header');
  const headerOffset = () => (header ? header.getBoundingClientRect().height : 0);

  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const id = href.slice(1);
      const target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();
      const top = window.scrollY + target.getBoundingClientRect().top - headerOffset() - 10;
      window.scrollTo({ top, behavior: 'smooth' });

      // Improve accessibility: move focus
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      window.setTimeout(() => target.removeAttribute('tabindex'), 600);
    });
  });

  // IntersectionObserver: lazy-load images
  const lazyImgs = $$('.is-lazy[data-src]');
  const loadImg = (img) => {
    const src = img.getAttribute('data-src');
    if (!src) return;
    img.src = src;
    img.removeAttribute('data-src');
    img.classList.remove('is-lazy');
  };

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const img = entry.target;
        loadImg(img);
        obs.unobserve(img);
      });
    }, { rootMargin: '200px 0px' });

    lazyImgs.forEach(img => io.observe(img));
  } else {
    lazyImgs.forEach(loadImg);
  }

  // Reveal animations
  const revealTargets = $$('section .section-header, .card, .media-frame, .hero-copy, .hero-media, .icon-card, .feature, .quote');
  revealTargets.forEach(el => el.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const ro = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });

    revealTargets.forEach(el => ro.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('is-visible'));
  }
})();
