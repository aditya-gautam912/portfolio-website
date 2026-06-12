/* ============================================
   Aditya Gautam — Premium Portfolio Script
   Scroll-driven animations, particle system,
   custom cursor, and interactive effects.
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---------- LOADING SCREEN ----------
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader?.classList.add('hidden'), 400);
  });
  setTimeout(() => loader?.classList.add('hidden'), 2500);

  // ---------- CUSTOM CURSOR ----------
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  if (cursor && follower && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    });

    function animateFollower() {
      followerX += (mouseX - followerX) * 0.1;
      followerY += (mouseY - followerY) * 0.1;
      follower.style.left = followerX + 'px';
      follower.style.top = followerY + 'px';
      requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Grow cursor on interactive elements
    const interactables = document.querySelectorAll('a, button, .project-card, .skill-bar, .contact__card, .timeline__content');
    interactables.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor?.classList.add('grow');
        follower?.classList.add('grow');
      });
      el.addEventListener('mouseleave', () => {
        cursor?.classList.remove('grow');
        follower?.classList.remove('grow');
      });
    });
  }

  // ---------- SCROLL PROGRESS ----------
  const progressBar = document.getElementById('scroll-progress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = progress + '%';
    });
  }

  // ---------- HEADER SCROLL ----------
  const header = document.getElementById('header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    header?.classList.toggle('scrolled', currentScroll > 50);

    // Scroll top button
    const scrollTop = document.getElementById('scroll-top');
    if (scrollTop) {
      scrollTop.classList.toggle('show', currentScroll > 500);
    }

    lastScroll = currentScroll;
  });

  // ---------- MOBILE MENU ----------
  const navToggle = document.getElementById('nav-toggle');
  const navClose = document.getElementById('nav-close');
  const navList = document.querySelector('.nav__list');

  if (navToggle && navList) {
    navToggle.addEventListener('click', () => navList.classList.add('show'));
  }
  if (navClose && navList) {
    navClose.addEventListener('click', () => navList.classList.remove('show'));
  }

  // Close menu on link click
  document.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => navList?.classList.remove('show'));
  });

  // ---------- DARK/LIGHT THEME ----------
  const themeBtn = document.getElementById('theme-button');
  const STORAGE_KEY = 'ag-portfolio-theme';

  const getTheme = () => document.body.classList.contains('light-theme') ? 'light' : 'dark';
  const getIcon = () => themeBtn?.classList.contains('fa-sun') ? 'fa-moon' : 'fa-sun';

  const savedTheme = localStorage.getItem(STORAGE_KEY);
  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
    themeBtn?.classList.add('fa-sun');
    themeBtn?.classList.remove('fa-moon');
  }

  themeBtn?.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    themeBtn.classList.toggle('fa-moon');
    themeBtn.classList.toggle('fa-sun');
    localStorage.setItem(STORAGE_KEY, getTheme());
  });

  // ---------- ACTIVE NAV LINK ----------
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  function updateActiveLink() {
    const scrollY = window.scrollY + 120;
    let current = '';

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('nav__link--active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('nav__link--active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink);

  // ---------- SCROLL REVEAL (IntersectionObserver) ----------
  const revealElements = document.querySelectorAll('[data-reveal]');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ---------- SKILL BAR ANIMATION ----------
  const skillBars = document.querySelectorAll('.skill-bar');

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        bar.classList.add('animated');
        const fill = bar.querySelector('.skill-bar__fill');
        if (fill) {
          const pct = bar.dataset.percent || 0;
          fill.style.setProperty('--target', pct + '%');
          // Set width after a tiny delay to trigger CSS transition
          setTimeout(() => { fill.style.width = pct + '%'; }, 100);
        }
        skillObserver.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  skillBars.forEach(bar => skillObserver.observe(bar));

  // ---------- COUNT-UP ANIMATION ----------
  const countEls = document.querySelectorAll('[data-count]');

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        animateCount(el, target);
        countObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  countEls.forEach(el => countObserver.observe(el));

  function animateCount(el, target) {
    let current = 0;
    const increment = target > 20 ? Math.ceil(target / 40) : 1;
    const duration = 1500;
    const stepTime = Math.max(16, duration / (target / increment));

    function tick() {
      current += increment;
      if (current >= target) {
        el.textContent = target + '+';
        return;
      }
      el.textContent = current;
      requestAnimationFrame(() => setTimeout(tick, stepTime));
    }
    tick();
  }

  // ---------- HERO PARTICLE CANVAS ----------
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w, h;
    const particles = [];
    const PARTICLE_COUNT = 60;
    const hue = 230; // Match CSS var(--hue)

    function resize() {
      const hero = canvas.parentElement;
      w = canvas.width = hero.offsetWidth;
      h = canvas.height = hero.offsetHeight;
    }

    function createParticles() {
      particles.length = 0;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          r: Math.random() * 2 + 1,
          baseOpacity: Math.random() * 0.4 + 0.1,
          opacity: 0,
          hueShift: Math.random() * 60 - 30
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const alpha = (1 - dist / 150) * 0.15;
            ctx.strokeStyle = `hsla(${hue + particles[i].hueShift}, 69%, 61%, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw particles
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue + p.hueShift}, 69%, 61%, ${p.opacity})`;
        ctx.fill();
      });

      update();
      requestAnimationFrame(draw);
    }

    function update() {
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.opacity += (p.baseOpacity - p.opacity) * 0.02;

        // Wrap around edges
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;

        // Gentle oscillation
        p.vx += (Math.random() - 0.5) * 0.02;
        p.vy += (Math.random() - 0.5) * 0.02;
        p.vx = Math.max(-1, Math.min(1, p.vx));
        p.vy = Math.max(-1, Math.min(1, p.vy));
      });
    }

    resize();
    createParticles();
    draw();

    window.addEventListener('resize', () => {
      resize();
      createParticles();
    });

    // Mouse parallax influence
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const mx = (e.clientX - rect.left) / w;
      const my = (e.clientY - rect.top) / h;
      particles.forEach((p, i) => {
        p.vx += (mx - 0.5) * 0.02 * (1 - i / particles.length);
        p.vy += (my - 0.5) * 0.02 * (1 - i / particles.length);
      });
    });
  }

  // ---------- 3D TILT ON PROJECT CARDS ----------
  const projectCards = document.querySelectorAll('.project-card');

  projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform =
        `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
  });

  // ---------- SMOOTH SCROLL FOR ANCHOR LINKS ----------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ---------- CONTACT FORM (basic) ----------
  const contactForm = document.getElementById('contact-form');
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('.contact__submit');
    const original = btn.innerHTML;
    btn.innerHTML = '<span>Sending...</span><i class="fa-solid fa-spinner fa-spin"></i>';
    btn.disabled = true;

    // Simulate sending
    setTimeout(() => {
      btn.innerHTML = '<span>Message Sent!</span><i class="fa-solid fa-check"></i>';
      setTimeout(() => {
        btn.innerHTML = original;
        btn.disabled = false;
        contactForm.reset();
      }, 2000);
    }, 1500);
  });

  // ---------- PARALLAX EFFECT ON HERO SCROLL ----------
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const hero = document.querySelector('.hero__content');
    const avatar = document.querySelector('.hero__avatar');
    if (hero && scrolled < window.innerHeight) {
      const speed = 0.15;
      hero.style.transform = `translateY(${scrolled * speed}px)`;
      hero.style.opacity = 1 - (scrolled / (window.innerHeight * 0.8));
    }
    if (avatar && scrolled < window.innerHeight) {
      avatar.style.transform = `translateY(${scrolled * 0.08}px) scale(${1 - scrolled * 0.0003})`;
    }
  });

  // ---------- GLARE EFFECT ON ABOUT IMAGE ----------
  const aboutImg = document.querySelector('.about__img-wrapper');
  aboutImg?.addEventListener('mousemove', (e) => {
    const rect = aboutImg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const glare = aboutImg.querySelector('.about__img-glare');
    if (glare) {
      glare.style.background =
        `radial-gradient(circle at ${x}% ${y}%, hsla(0, 0%, 100%, 0.12) 0%, transparent 60%)`;
    }
  });

  console.log('%c Aditya Gautam Portfolio ', 'background: #6c63ff; color: #fff; padding: 8px 16px; font-size: 14px; border-radius: 4px; font-weight: bold;');
  console.log('%c Built with passion, one line at a time. ', 'color: #aaa; font-size: 12px;');
});
