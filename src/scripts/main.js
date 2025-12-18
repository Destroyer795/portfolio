function initPage() {
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

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', (e) => {
      if (!document.startViewTransition) {
        toggleTheme();
        return;
      }
      const x = e.clientX;
      const y = e.clientY;
      const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      
      const transition = document.startViewTransition(toggleTheme);

      transition.ready.then(() => {
        const clipPath = [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`
        ];
        document.documentElement.animate(
          { clipPath: clipPath },
          {
            duration: 500,
            easing: 'ease-in-out',
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
