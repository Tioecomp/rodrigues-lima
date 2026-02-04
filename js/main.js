/**
 * Rodrigues & Lima - Main JavaScript
 * Handles navigation, scroll animations, and interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all modules
  initHeader();
  initMobileMenu();
  initSmoothScroll();
  initRevealAnimations();
  initOfficeSlideshow();
  initWhyUsAnimation();
});

/**
 * Header scroll behavior
 * Adds 'scrolled' class when page is scrolled
 */
function initHeader() {
  const header = document.getElementById('header');
  const scrollThreshold = 50;

  function handleScroll() {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Check initial state
}

/**
 * Mobile menu toggle
 */
function initMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');
  const navLinks = nav.querySelectorAll('.nav__link');

  menuToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', nav.classList.contains('active'));
  });

  // Close menu when clicking on a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
      nav.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');

      // Skip if it's just '#'
      if (href === '#') return;

      const target = document.querySelector(href);

      if (target) {
        e.preventDefault();

        // Calculate offset for fixed header
        const headerHeight = document.getElementById('header').offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Reveal animations on scroll using Intersection Observer
 */
function initRevealAnimations() {
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    // Show all elements immediately if user prefers reduced motion
    document.querySelectorAll('.reveal').forEach(el => {
      el.classList.add('visible');
    });
    return;
  }

  const revealElements = document.querySelectorAll('.reveal');

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -100px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(el => {
    observer.observe(el);
  });
}

/**
 * Optional: Counter animation for stats
 * Uncomment and call if needed
 */
/*
function animateCounters() {
  const counters = document.querySelectorAll('.hero__stat-number');
  
  counters.forEach(counter => {
    const target = parseInt(counter.textContent);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const updateCounter = () => {
      current += step;
      if (current < target) {
        counter.textContent = Math.floor(current) + '+';
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target + '+';
      }
    };
    
    updateCounter();
  });
}
*/

/**
 * Office slideshow with automatic transitions
 */
function initOfficeSlideshow() {
  const slideshow = document.getElementById('officeSlideshow');
  if (!slideshow) return;

  const slides = slideshow.querySelectorAll('.office__slide');
  const dots = slideshow.querySelectorAll('.office__dot');
  let currentSlide = 0;
  const slideInterval = 3000; // 3 seconds

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }

  // Auto-advance slides
  let autoPlay = setInterval(nextSlide, slideInterval);

  // Click on dots to change slide
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      currentSlide = index;
      showSlide(currentSlide);
      // Reset autoplay
      clearInterval(autoPlay);
      autoPlay = setInterval(nextSlide, slideInterval);
    });
  });
}

/**
 * Why Us section - Circle activation animation
 */
function initWhyUsAnimation() {
  const numbers = document.querySelectorAll('.why-card__number');
  if (numbers.length === 0) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5
  };

  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        // Animate circles one by one
        numbers.forEach((num, index) => {
          setTimeout(() => {
            num.classList.add('active');
          }, index * 1500); // 1.5s delay between each
        });
        observer.disconnect();
      }
    });
  }, observerOptions);

  const whyUsSection = document.querySelector('.why-us');
  if (whyUsSection) {
    observer.observe(whyUsSection);
  }
}
