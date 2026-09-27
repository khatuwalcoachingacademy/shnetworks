const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('.main-nav');
const form = document.querySelector('#quote-form');
const formNote = document.querySelector('#form-note');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 8);
});

menuButton.addEventListener('click', () => {
  const isOpen = menu.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});

menu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menu.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  });
});

if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    formNote.textContent = 'Sending your enquiry…';
    void deliverEnquiry(data);
  });
}

async function deliverEnquiry(data) {
  const submitButton = form.querySelector('button[type="submit"]');
  const endpoint = form.action.replace('://formsubmit.co/', '://formsubmit.co/ajax/');

  submitButton.disabled = true;
  formNote.textContent = 'Sending your enquiry…';

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: data
    });

    if (!response.ok) throw new Error('Form submission failed');
    form.reset();
    formNote.textContent = 'Thank you. Your enquiry has been sent — we’ll be in touch soon.';
  } catch (error) {
    formNote.textContent = 'We could not send your enquiry. Please email us directly at shreeharinetworks@proton.me.';
  } finally {
    submitButton.disabled = false;
  }
}

const announcementCarousel = document.querySelector('[data-announcement-carousel]');

if (announcementCarousel) {
  const slides = Array.from(announcementCarousel.querySelectorAll('.announcement-slide'));
  const dots = Array.from(announcementCarousel.querySelectorAll('.carousel-dot'));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let activeIndex = 0;
  let rotation;

  const showSlide = (index) => {
    activeIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === activeIndex;
      slide.classList.toggle('is-active', isActive);
      slide.setAttribute('aria-hidden', String(!isActive));
    });
    dots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === activeIndex;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-current', String(isActive));
    });
  };

  const stopRotation = () => window.clearInterval(rotation);
  const startRotation = () => {
    if (!reducedMotion) {
      stopRotation();
      rotation = window.setInterval(() => showSlide(activeIndex + 1), 5000);
    }
  };

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
      startRotation();
    });
  });

  announcementCarousel.addEventListener('mouseenter', stopRotation);
  announcementCarousel.addEventListener('mouseleave', startRotation);
  announcementCarousel.addEventListener('focusin', stopRotation);
  announcementCarousel.addEventListener('focusout', startRotation);
  document.addEventListener('visibilitychange', () => (document.hidden ? stopRotation() : startRotation()));
  startRotation();
}

const blueprintConsole = document.querySelector('[data-blueprint-console]');
const blueprintTabs = Array.from(document.querySelectorAll('[data-blueprint]'));

if (blueprintConsole && blueprintTabs.length) {
  const blueprintTitle = blueprintConsole.querySelector('[data-blueprint-title]');
  const blueprintCopy = blueprintConsole.querySelector('[data-blueprint-copy]');
  const scenarios = {
    core: {
      title: 'Secure core',
      copy: 'Protected edge, segmented access and clear network visibility.'
    },
    campus: {
      title: 'Connected campus',
      copy: 'A scalable foundation for classrooms, staff, Wi-Fi, CCTV and shared systems.'
    },
    remote: {
      title: 'Protected remote site',
      copy: 'Reliable branch connectivity with a secure path back to the network core.'
    }
  };

  const selectScenario = (scenario) => {
    const detail = scenarios[scenario];
    if (!detail) return;
    blueprintConsole.dataset.scenario = scenario;
    blueprintTitle.textContent = detail.title;
    blueprintCopy.textContent = detail.copy;
    blueprintTabs.forEach((tab) => {
      const isActive = tab.dataset.blueprint === scenario;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-selected', String(isActive));
    });
  };

  blueprintTabs.forEach((tab) => tab.addEventListener('click', () => selectScenario(tab.dataset.blueprint)));
  selectScenario('core');
}

document.querySelector('#year').textContent = new Date().getFullYear();
