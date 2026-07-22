import Lenis from 'lenis';

let lenis;
let rafId;

function initPage() {
  if (lenis) {
    lenis.destroy();
    cancelAnimationFrame(rafId);
  }

  lenis = new Lenis();
  function raf(time) {
    lenis.raf(time);
    rafId = requestAnimationFrame(raf);
  }
  rafId = requestAnimationFrame(raf);

  const themeToggleBtn = document.getElementById('theme-toggle');
  
  const setInitialTheme = () => {
    const theme = (() => {
      if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
        return localStorage.getItem('theme');
      }
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
      return 'light';
    })();

    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
    window.localStorage.setItem('theme', theme);
  };

  const toggleTheme = () => {
    const element = document.documentElement;
    element.classList.toggle('dark');
    const isDark = element.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };

  if (themeToggleBtn && !themeToggleBtn._themeListenerAttached) {
    themeToggleBtn._themeListenerAttached = true;
    themeToggleBtn.addEventListener('click', (e) => {
      if (!document.startViewTransition) {
        toggleTheme();
        return;
      }

      // Always measure the exact center of the theme-toggle button
      const rect = themeToggleBtn.getBoundingClientRect();
      let x = rect.left + rect.width / 2;
      let y = rect.top + rect.height / 2;

      // Fallback safeguard: if rect measurement is invalid, default to top-right button location
      if (!x || isNaN(x) || x === 0) {
        x = window.innerWidth - 48;
        y = 32;
      }

      const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

      const transition = document.startViewTransition(() => {
        toggleTheme();
      });

      transition.ready.then(() => {
        document.documentElement.animate(
          [
            {
              clipPath: `circle(0px at ${x}px ${y}px)`,
              'clip-path': `circle(0px at ${x}px ${y}px)`
            },
            {
              clipPath: `circle(${endRadius}px at ${x}px ${y}px)`,
              'clip-path': `circle(${endRadius}px at ${x}px ${y}px)`
            }
          ],
          {
            duration: 400,
            easing: 'ease-out',
            pseudoElement: '::view-transition-new(root)',
          }
        );
      });
    });
  }

  const menuBtn = document.getElementById('mobile-menu-btn');
  const backdrop = document.getElementById('mobile-backdrop');
  const drawer = document.getElementById('mobile-drawer');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  const toggleMenu = () => {
    if (backdrop && drawer) {
      backdrop.classList.toggle('opacity-0');
      backdrop.classList.toggle('pointer-events-none');
      drawer.classList.toggle('translate-x-full');
      document.body.classList.toggle('menu-open');
    }
  };

  if (menuBtn && backdrop && drawer) {
    menuBtn.addEventListener('click', toggleMenu);
    backdrop.addEventListener('click', toggleMenu);
  }
  if (mobileLinks.length) {
    mobileLinks.forEach(link => {
      link.addEventListener('click', toggleMenu);
    });
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach((section) => {
    observer.observe(section);
  });

  // Track scroll direction for nav link underline animation
  let lastScrollY = window.scrollY;
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY) {
      document.documentElement.setAttribute('data-scroll-dir', 'down');
    } else if (currentScrollY < lastScrollY) {
      document.documentElement.setAttribute('data-scroll-dir', 'up');
    }
    lastScrollY = currentScrollY;
  }, { passive: true });

  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  const observerOptions = {
    root: null,
    rootMargin: '-50% 0px -50% 0px',
    threshold: 0,
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    if (section.getAttribute('id')) {
      sectionObserver.observe(section);
    }
  });

  // Staggered list animation
  const staggerObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const staggerItems = entry.target.querySelectorAll('.stagger-item');
        staggerItems.forEach((item, index) => {
          setTimeout(() => {
            item.classList.add('is-visible');
          }, index * 150);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('[data-stagger-container]').forEach(container => {
    staggerObserver.observe(container);
  });

  setInitialTheme();
}

initPage();

document.addEventListener('astro:page-load', initPage);
