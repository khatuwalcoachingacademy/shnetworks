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

document.querySelector('#year').textContent = new Date().getFullYear();
