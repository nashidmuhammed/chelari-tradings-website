/**
 * CHELARI TRADINGS — INTERACTIVE 3D WEB ENGINE
 * Core Javascript: Lenis Smooth Scroll, Physics 3D Tilt Lerp, Glare Engine,
 * Material Studio, Filter Gallery, WhatsApp Lead Estimator & Modal Systems.
 */

document.addEventListener('DOMContentLoaded', () => {
  initLenisSmoothScroll();
  initScrollHeader();
  init3DTiltEngine();
  initMaterialStudio();
  initProductFilter();
  initQuickSpecsModal();
  initProjectEstimator();
  initMobileMenu();
  initMobileDisciplinesHorizontalScroll();
  initScrollProgress();
  initFaqAccordion();
  initScrollReveal();
  initTestimonialsCarousel();
  initMobileBrandStackingEffect();
});

/* ==========================================================================
   0. Framer-Grade Smooth Momentum Scrolling (Lenis Engine)
   ========================================================================== */
let lenisInstance = null;

function initLenisSmoothScroll() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion || typeof Lenis === 'undefined') return;

  lenisInstance = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    smooth: true,
    smoothTouch: false,
    wheelMultiplier: 1.0,
  });

  window.lenisInstance = lenisInstance;

  function raf(time) {
    lenisInstance.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Hook in-page navigation clicks for luxury smooth glide
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          lenisInstance.scrollTo(targetEl, { offset: -70, duration: 1.15 });
        }
      }
    });
  });

  // Sync scroll progress and header
  lenisInstance.on('scroll', () => {
    updateScrollStates();
  });
}

/* ==========================================================================
   1. Scroll Header & Progress Bar
   ========================================================================== */
function updateScrollStates() {
  const scrollY = window.scrollY || (lenisInstance ? lenisInstance.scroll : 0);
  const header = document.querySelector('.site-header');
  if (header) {
    if (scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  const progressBar = document.getElementById('scroll-progress');
  if (progressBar) {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      const progress = (scrollY / totalHeight) * 100;
      progressBar.style.width = `${progress}%`;
    }
  }
}

function initScrollHeader() {
  window.addEventListener('scroll', updateScrollStates, { passive: true });
  updateScrollStates();
}

function initScrollProgress() {
  window.addEventListener('scroll', updateScrollStates, { passive: true });
  updateScrollStates();
}

/* ==========================================================================
   2. 3D Tilt Engine with Physics Lerp & Specular Glare (Framer Inertia)
   ========================================================================== */
function init3DTiltEngine() {
  const tiltElements = document.querySelectorAll('.hero-3d-card, .product-3d-card, .studio-stage-card');
  if (!tiltElements.length) return;

  tiltElements.forEach(card => {
    let bounds = null;
    let isHovered = false;
    let targetRotX = 0;
    let targetRotY = 0;
    let currentRotX = 0;
    let currentRotY = 0;
    let targetScale = 1;
    let currentScale = 1;
    let targetGlareX = 50;
    let targetGlareY = 50;
    let currentGlareX = 50;
    let currentGlareY = 50;
    let rafId = null;

    function updateBounds() {
      bounds = card.getBoundingClientRect();
    }

    function updateTilt() {
      // Lerp factor 0.12 creates natural mass and spring deceleration
      currentRotX += (targetRotX - currentRotX) * 0.12;
      currentRotY += (targetRotY - currentRotY) * 0.12;
      currentScale += (targetScale - currentScale) * 0.12;
      currentGlareX += (targetGlareX - currentGlareX) * 0.12;
      currentGlareY += (targetGlareY - currentGlareY) * 0.12;

      card.style.setProperty('--mouse-x', `${currentGlareX.toFixed(2)}%`);
      card.style.setProperty('--mouse-y', `${currentGlareY.toFixed(2)}%`);
      card.style.transform = `perspective(1200px) rotateX(${currentRotX.toFixed(3)}deg) rotateY(${currentRotY.toFixed(3)}deg) scale3d(${currentScale.toFixed(3)}, ${currentScale.toFixed(3)}, ${currentScale.toFixed(3)})`;

      const delta = Math.abs(targetRotX - currentRotX) + Math.abs(targetRotY - currentRotY) + Math.abs(targetScale - currentScale);
      if (isHovered || delta > 0.01) {
        rafId = requestAnimationFrame(updateTilt);
      } else {
        rafId = null;
        card.style.transform = '';
      }
    }

    function onMouseEnter() {
      isHovered = true;
      updateBounds();
      targetScale = card.classList.contains('hero-3d-card') ? 1.025 : 1.018;
      if (!rafId) rafId = requestAnimationFrame(updateTilt);
    }

    function onMouseMove(e) {
      if (!bounds) updateBounds();
      const mouseX = e.clientX - bounds.left;
      const mouseY = e.clientY - bounds.top;

      const percentX = mouseX / bounds.width;
      const percentY = mouseY / bounds.height;

      const normalizedX = (percentX - 0.5) * 2;
      const normalizedY = (percentY - 0.5) * 2;

      const maxTilt = card.classList.contains('hero-3d-card') ? 13 : 9;
      targetRotX = -normalizedY * maxTilt;
      targetRotY = normalizedX * maxTilt;

      targetGlareX = percentX * 100;
      targetGlareY = percentY * 100;

      if (!rafId) rafId = requestAnimationFrame(updateTilt);
    }

    function onMouseLeave() {
      isHovered = false;
      targetRotX = 0;
      targetRotY = 0;
      targetScale = 1;
      targetGlareX = 50;
      targetGlareY = 50;
      if (!rafId) rafId = requestAnimationFrame(updateTilt);
    }

    window.addEventListener('resize', () => { bounds = null; }, { passive: true });
    card.addEventListener('mouseenter', onMouseEnter);
    card.addEventListener('mousemove', onMouseMove);
    card.addEventListener('mouseleave', onMouseLeave);
  });
}

/* ==========================================================================
   3. 3D Material / Finish Studio Switcher
   ========================================================================== */
const studioData = {
  glass: {
    title: 'Architectural Fluted Glass',
    spec: '10mm Toughened Ribbed / Reeded Profile with Minimal Brass Frame',
    img: 'assets/images/features/glass-architecture.jpg',
    category: 'GLASS DIVISION',
    badge: 'AIS / Saint-Gobain Certified',
    hotspots: [
      { x: '50%', y: '45%', title: 'Reeded Flutes', text: 'Optically diffused privacy with 85% light transmission' },
      { x: '38%', y: '65%', title: 'Champagne Brass Frame', text: 'SUS304 PVD Coated Slim Aluminum profile' }
    ]
  },
  plywood: {
    title: 'IS:710 Marine Calibrated Plywood',
    spec: '100% Gurjan Hardwood Core with Boiling Water Proof (BWP) Phenolic Resin',
    img: 'assets/images/optimized/DSC03931.jpg',
    category: 'PLYWOOD & VENEERS',
    badge: 'IS:710 Marine Grade',
    hotspots: [
      { x: '35%', y: '40%', title: '3D Metallic Louvre', text: 'Precision CNC fluted finish for luxury wall paneling' },
      { x: '65%', y: '60%', title: 'Gurjan Core', text: 'Borer & Termite proof lifetime structural warranty' }
    ]
  },
  hardware: {
    title: 'Sculptural Knurled Brass Hardware',
    spec: 'Solid Forged Brass Architectural Lever with Precision Diamond Knurl',
    img: 'assets/images/features/hero-handle-3d.jpg',
    category: 'LUXURY HARDWARE',
    badge: 'German Architectural Spec',
    hotspots: [
      { x: '50%', y: '42%', title: 'Diamond Knurled Grip', text: 'Tactile architectural grip with matte gold PVD coat' },
      { x: '22%', y: '60%', title: 'Solid Brass Base', text: 'Engineered for 500,000+ cycle durability' }
    ]
  },
  kitchen: {
    title: 'Precision German Modular Kitchen',
    spec: 'Curved Fluted Oak Island with Honed Sintered Stone Waterfall Countertop',
    img: 'assets/images/features/modular-kitchen.jpg',
    category: 'MODULAR KITCHENS',
    badge: 'Soft-Close Blum/Hettich Tech',
    hotspots: [
      { x: '45%', y: '68%', title: 'Fluted Oak Tambour', text: 'Thermo-treated moisture-resistant solid fluted timber' },
      { x: '75%', y: '30%', title: 'Integrated LED Profile', text: '3000K warm ambient recessed cabinet illumination' }
    ]
  },
  appliances: {
    title: 'Built-in Induction Hob & Chimney Suite',
    spec: 'Black Schott Ceran Glass Touch Hob + 1400m³/hr Silent Filterless Extractor',
    img: 'assets/images/features/appliances-luxury.jpg',
    category: 'HOME APPLIANCES',
    badge: 'Energy Efficiency Grade A++',
    hotspots: [
      { x: '32%', y: '75%', title: 'Schott Ceran Glass', text: 'Scratch-resistant thermal shock tested glass surface' },
      { x: '35%', y: '20%', title: 'Baffleless Extraction', text: 'Whisper-quiet brushless DC motor with motion sensor' }
    ]
  },
  stone: {
    title: '3D Natural Slate Rock Veneer',
    spec: 'Ultra-thin flexible natural stone veneer for architectural feature walls',
    img: 'assets/images/optimized/DSC03951.jpg',
    category: 'SURFACE FINISHES',
    badge: '100% Genuine Slate',
    hotspots: [
      { x: '45%', y: '50%', title: 'Tactile Relief', text: 'Authentic quartzite fissures and mineral depth' }
    ]
  }
};

function initMaterialStudio() {
  const pills = document.querySelectorAll('.material-pill');
  const stageImg = document.querySelector('.stage-visual-img');
  const stageTitle = document.querySelector('.stage-item-title');
  const stageSpec = document.querySelector('.stage-item-spec');
  const stageCategory = document.querySelector('.stage-chip-cat');
  const stageBadge = document.querySelector('.stage-chip-badge');
  const hotspotContainer = document.querySelector('.stage-hotspot-layer');

  if (!pills.length || !stageImg) return;

  function setMaterial(key) {
    const data = studioData[key];
    if (!data) return;

    // Fade out
    stageImg.style.opacity = '0.3';
    stageImg.style.transform = 'scale(0.97)';

    setTimeout(() => {
      stageImg.src = data.img;
      if (stageTitle) stageTitle.textContent = data.title;
      if (stageSpec) stageSpec.textContent = data.spec;
      if (stageCategory) stageCategory.textContent = data.category;
      if (stageBadge) stageBadge.textContent = data.badge;

      // Update Hotspots
      if (hotspotContainer) {
        hotspotContainer.innerHTML = '';
        data.hotspots.forEach(hp => {
          const pin = document.createElement('div');
          pin.className = 'stage-hotspot';
          pin.style.left = hp.x;
          pin.style.top = hp.y;
          pin.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
            <div class="hotspot-tooltip">
              <strong>${hp.title}</strong>
              <div>${hp.text}</div>
            </div>
          `;
          hotspotContainer.appendChild(pin);
        });
      }

      stageImg.style.opacity = '1';
      stageImg.style.transform = 'scale(1)';
    }, 220);
  }

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const matKey = pill.getAttribute('data-material');
      setMaterial(matKey);
    });
  });

  // Init default (first active)
  const defaultPill = document.querySelector('.material-pill.active');
  if (defaultPill) {
    setMaterial(defaultPill.getAttribute('data-material'));
  }
}

/* ==========================================================================
   4. Filterable Product Gallery
   ========================================================================== */
function initProductFilter() {
  const tabs = document.querySelectorAll('.filter-tab');
  const cards = document.querySelectorAll('.product-3d-card');

  if (!tabs.length || !cards.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterVal = tab.getAttribute('data-filter');

      cards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (filterVal === 'all' || cardCat === filterVal) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 40);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* ==========================================================================
   5. Quick Specs Modal Popup
   ========================================================================== */
function initQuickSpecsModal() {
  const modal = document.getElementById('specs-modal');
  const closeBtn = document.querySelector('.modal-close-btn');
  const viewBtns = document.querySelectorAll('.js-quick-view');

  if (!modal) return;

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  function openModal(data) {
    const modalImg = modal.querySelector('.modal-img');
    const modalCat = modal.querySelector('.modal-category');
    const modalTitle = modal.querySelector('.modal-title');
    const modalDesc = modal.querySelector('.modal-desc');
    const modalSpecs = modal.querySelector('.modal-specs-list');
    const modalInquire = modal.querySelector('.modal-whatsapp-link');

    if (modalImg && data.img) modalImg.src = data.img;
    if (modalCat && data.cat) modalCat.textContent = data.cat;
    if (modalTitle && data.title) modalTitle.textContent = data.title;
    if (modalDesc && data.desc) modalDesc.textContent = data.desc;

    if (modalSpecs && data.specs) {
      modalSpecs.innerHTML = '';
      data.specs.forEach(item => {
        const row = document.createElement('div');
        row.className = 'modal-spec-row';
        row.innerHTML = `<span class="modal-spec-k">${item.key}:</span><span class="modal-spec-v">${item.val}</span>`;
        modalSpecs.appendChild(row);
      });
    }

    if (modalInquire) {
      const msg = encodeURIComponent(`Hello Chelari Tradings, I am interested in inquiring about "${data.title}" from your catalog. Could you share price and availability?`);
      modalInquire.href = `https://wa.me/919072555257?text=${msg}`;
    }

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  viewBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.product-3d-card') || btn.closest('.hero-3d-card');
      if (!card) return;

      const title = card.querySelector('.product-name, .hero-card-title')?.textContent || 'Chelari Architectural Piece';
      const cat = card.querySelector('.product-category-label, .hero-card-category')?.textContent || 'PREMIUM COLLECTION';
      const desc = card.querySelector('.product-specs-snippet, .hero-card-desc')?.textContent || 'Engineered architectural fitting from Chelari Tradings collection.';
      const img = card.querySelector('img')?.src || '';

      const specs = [
        { key: 'Category', val: cat },
        { key: 'Material Grade', val: card.getAttribute('data-grade') || 'Architectural Grade' },
        { key: 'Finish', val: card.getAttribute('data-finish') || 'Hand-buffed PVD / Natural' },
        { key: 'Warranty', val: '10 Years Assurance' },
        { key: 'Origin', val: 'Chelari Tradings Showroom, Kerala' }
      ];

      openModal({ title, cat, desc, img, specs });
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   6. Interactive Digital Marketing Project Estimator (WhatsApp Lead Gen)
   ========================================================================== */
function initProjectEstimator() {
  const typeChoices = document.querySelectorAll('.estimator-btn-choice');
  const catPills = document.querySelectorAll('.estimator-check-pill');
  const summaryText = document.querySelector('.estimator-summary-text');
  const whatsappBtn = document.querySelector('.btn-whatsapp-inquire');

  let selectedType = 'Modern Villa';
  let selectedCats = ['Architectural Glass', 'Modular Kitchen'];

  function updateLeadLink() {
    const catsStr = selectedCats.length > 0 ? selectedCats.join(', ') : 'General Materials';
    if (summaryText) {
      summaryText.textContent = `${selectedType} • ${selectedCats.length} Categories Selected`;
    }

    if (whatsappBtn) {
      const text = `Hello Chelari Tradings! I visited your website and would like to get a quote/consultation for my upcoming project.\n\n` +
        `• Project Type: ${selectedType}\n` +
        `• Required Categories: ${catsStr}\n` +
        `• Showroom Location: Malappuram / Calicut Bypass, Kerala\n\n` +
        `Please share your digital catalog and let me know when we can connect!`;

      // Chelari Tradings official inquiry link
      whatsappBtn.href = `https://wa.me/919072555257?text=${encodeURIComponent(text)}`;
    }
  }

  typeChoices.forEach(btn => {
    btn.addEventListener('click', () => {
      typeChoices.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedType = btn.getAttribute('data-type') || btn.textContent.trim();
      updateLeadLink();
    });
  });

  catPills.forEach(pill => {
    pill.addEventListener('click', () => {
      pill.classList.toggle('checked');
      const catVal = pill.getAttribute('data-cat') || pill.textContent.trim();
      if (pill.classList.contains('checked')) {
        if (!selectedCats.includes(catVal)) selectedCats.push(catVal);
      } else {
        selectedCats = selectedCats.filter(c => c !== catVal);
      }
      updateLeadLink();
    });
  });

  updateLeadLink();
}

/* ==========================================================================
   7. Mobile Navigation Drawer
   ========================================================================== */
function initMobileMenu() {
  const toggle = document.querySelector('.mobile-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const drawerLinks = document.querySelectorAll('.mobile-drawer .nav-link, .mobile-drawer .btn-pill');

  if (!toggle || !drawer) return;

  function toggleDrawer() {
    const isOpen = drawer.classList.contains('open');
    if (isOpen) {
      drawer.classList.remove('open');
      toggle.classList.remove('active');
      document.body.style.overflow = '';
    } else {
      drawer.classList.add('open');
      toggle.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  toggle.addEventListener('click', toggleDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('open');
      toggle.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

/* Global Quick Navigation & Filter Helper */
window.filterAndScroll = function(category) {
  const showcase = document.querySelector('#showcase');
  if (showcase) {
    if (window.lenisInstance) {
      window.lenisInstance.scrollTo(showcase, { offset: -70, duration: 1.15 });
    } else {
      showcase.scrollIntoView({ behavior: 'smooth' });
    }
  }

  const tab = document.querySelector(`.filter-tab[data-filter="${category}"]`);
  if (tab) {
    setTimeout(() => {
      tab.click();
    }, 350);
  }
};

/* ==========================================================================
   8b. Mobile Pinned Horizontal Scroll-Driven Carousel
   ========================================================================== */
function initMobileDisciplinesHorizontalScroll() {
  const track = document.getElementById('hero-disciplines-track');
  const dock = document.getElementById('hero-disciplines-dock');
  const grid = document.getElementById('hero-ticker-grid');
  const progressBar = document.getElementById('hero-dock-progress-bar');
  if (!track || !dock || !grid) return;

  let ticking = false;

  function updateSlide() {
    if (window.innerWidth > 768) {
      grid.style.transform = '';
      if (progressBar) progressBar.style.width = '0%';
      ticking = false;
      return;
    }

    const trackRect = track.getBoundingClientRect();
    const pinTopOffset = parseFloat(window.getComputedStyle(dock).top) || 76;

    // Available vertical distance the dock stays pinned while user scrolls through track
    const availableScroll = track.offsetHeight - dock.offsetHeight;
    if (availableScroll <= 0) {
      ticking = false;
      return;
    }

    // How far user has scrolled into the sticky pin zone
    const scrolledDistance = pinTopOffset - trackRect.top;
    let progress = scrolledDistance / availableScroll;
    progress = Math.max(0, Math.min(1, progress));

    // Maximum distance the cards need to slide horizontally
    const wrap = grid.parentElement;
    const maxTranslate = Math.max(0, grid.scrollWidth - wrap.clientWidth);

    const currentTranslate = progress * maxTranslate;
    grid.style.transform = `translate3d(-${currentTranslate.toFixed(1)}px, 0, 0)`;

    if (progressBar) {
      const barPercent = 20 + progress * 80;
      progressBar.style.width = `${barPercent.toFixed(1)}%`;
    }

    ticking = false;
  }

  function requestUpdate() {
    if (!ticking) {
      requestAnimationFrame(updateSlide);
      ticking = true;
    }
  }

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate, { passive: true });
  if (window.lenisInstance) {
    window.lenisInstance.on('scroll', requestUpdate);
  }
  requestUpdate();
}

/* ==========================================================================
   9. Framer-Style Scroll Reveal & Parallax Motion
   ========================================================================== */
function initScrollReveal() {
  const revealSelectors = [
    '.disciplines-intro',
    '.disciplines-list',
    '.showcase-header',
    '.products-grid',
    '.material-studio-header',
    '.material-studio-grid',
    '.specs-intro',
    '.specs-grid',
    '.brands-header',
    '.brands-grid',
    '.trade-banner-card',
    '.showroom-card',
    '.estimator-card',
    '.reviews-header',
    '.review-cards-grid',
    '.faq-header',
    '.faq-accordion',
    '.footer-top-grid'
  ];

  const targets = document.querySelectorAll(revealSelectors.join(', '));
  if (!targets.length) return;

  targets.forEach(el => {
    el.classList.add('reveal-on-scroll');
    if (el.classList.contains('products-grid') || el.classList.contains('disciplines-list') || el.classList.contains('review-cards-grid') || el.classList.contains('brands-grid')) {
      el.classList.add('stagger-group');
    }
  });

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  targets.forEach(el => observer.observe(el));

  // Subtle Smooth Parallax on Hero Backdrop Image
  const heroBackdrop = document.querySelector('.hero-backdrop-img');
  if (heroBackdrop) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          if (scrollY < window.innerHeight * 1.5) {
            heroBackdrop.style.transform = `translate3d(0, ${(scrollY * 0.18).toFixed(1)}px, 0) scale(1.04)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }
}

/* ==========================================================================
   10. Architectural Specifications FAQ Accordion System
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isAlreadyActive = item.classList.contains('active');

      // Close all other accordion items for clean accordion UX
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const btn = otherItem.querySelector('.faq-question');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current item
      if (isAlreadyActive) {
        item.classList.remove('active');
        questionBtn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
      }

      // Re-calculate Lenis height if smooth scroll is running
      if (window.lenisInstance) {
        setTimeout(() => {
          window.lenisInstance.resize();
        }, 360);
      }
    });
  });
}

/* ==========================================================================
   10. Testimonials Horizontal Carousel (Graft Style Drag & Nav Controls)
   ========================================================================== */
function initTestimonialsCarousel() {
  const track = document.getElementById('testimonials-track');
  const prevBtn = document.getElementById('testimonials-nav-prev');
  const nextBtn = document.getElementById('testimonials-nav-next');
  if (!track) return;

  function getStepWidth() {
    const card = track.querySelector('.testimonial-card-editorial');
    if (!card) return 360;
    const style = window.getComputedStyle(track);
    const gap = parseFloat(style.gap) || 24;
    return card.offsetWidth + gap;
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      track.scrollBy({ left: -getStepWidth(), behavior: 'smooth' });
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      track.scrollBy({ left: getStepWidth(), behavior: 'smooth' });
    });
  }

  // Smooth mouse drag-to-scroll for desktop users
  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

  track.addEventListener('mousedown', (e) => {
    isDown = true;
    track.classList.add('active');
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
  });

  track.addEventListener('mouseleave', () => {
    isDown = false;
    track.classList.remove('active');
  });

  track.addEventListener('mouseup', () => {
    isDown = false;
    track.classList.remove('active');
  });

  track.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.6; // Scroll speed multiplier
    track.scrollLeft = scrollLeft - walk;
  });
}

/* ==========================================================================
   Mobile Vertical 3D Brand Stacking Effect
   ========================================================================== */
function initMobileBrandStackingEffect() {
  const cards = document.querySelectorAll('.brands-grid .brand-card');
  if (!cards.length) return;

  function updateCardStack() {
    if (window.innerWidth > 768) {
      cards.forEach(card => {
        card.style.transform = '';
        card.style.filter = '';
      });
      return;
    }

    const navHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 76;

    cards.forEach((card, index) => {
      const nextCard = cards[index + 1];

      if (nextCard) {
        const nextRect = nextCard.getBoundingClientRect();
        const nextPinTop = navHeight + 12 + (index + 1) * 10;

        const distance = nextRect.top - nextPinTop;
        const overlapWindow = 200;

        if (distance <= overlapWindow && distance >= 0) {
          const factor = (overlapWindow - distance) / overlapWindow;
          const scale = 1 - factor * 0.05;
          const brightness = 1 - factor * 0.12;
          card.style.transform = `scale(${scale.toFixed(3)}) translateY(0)`;
          card.style.filter = `brightness(${brightness.toFixed(2)})`;
        } else if (distance < 0) {
          card.style.transform = 'scale(0.95) translateY(0)';
          card.style.filter = 'brightness(0.88)';
        } else {
          card.style.transform = 'scale(1) translateY(0)';
          card.style.filter = 'brightness(1)';
        }
      } else {
        card.style.transform = 'scale(1) translateY(0)';
        card.style.filter = 'brightness(1)';
      }
    });
  }

  window.addEventListener('scroll', updateCardStack, { passive: true });
  window.addEventListener('resize', updateCardStack, { passive: true });

  if (window.lenisInstance) {
    window.lenisInstance.on('scroll', updateCardStack);
  }

  updateCardStack();
}




