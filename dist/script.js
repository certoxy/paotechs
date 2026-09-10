const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('nav');
menu.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(open));
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
}));
const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
}), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
document.getElementById('year').textContent = new Date().getFullYear();

window.dataLayer = window.dataLayer || [];
document.querySelectorAll('a, button').forEach(element => element.addEventListener('click', () => {
  window.dataLayer.push({ event: 'paotechs_interaction', label: element.textContent.trim().replace(/\s+/g, ' ').slice(0, 80) });
}));

const interest = document.getElementById('interest');
document.querySelectorAll('.inquiry-link').forEach(link => link.addEventListener('click', () => {
  interest.value = link.dataset.interest || '';
}));

const form = document.getElementById('inquiry-form');
const status = document.getElementById('form-status');
form.addEventListener('submit', event => {
  event.preventDefault();
  let valid = true;
  ['name', 'email', 'interest', 'message'].forEach(id => {
    const field = document.getElementById(id);
    const error = document.getElementById(`${id}-error`);
    let message = '';
    if (!field.value.trim()) message = 'Please complete this field.';
    if (id === 'email' && field.value && !field.validity.valid) message = 'Enter a valid email address.';
    field.setAttribute('aria-invalid', message ? 'true' : 'false');
    error.textContent = message;
    if (message) valid = false;
  });
  if (!valid) {
    status.textContent = 'Please review the highlighted fields.';
    form.querySelector('[aria-invalid="true"]').focus();
    return;
  }
  status.textContent = 'Sending your inquiry…';
  window.dataLayer.push({ event: 'generate_lead', service: interest.value });
  const data = new FormData(form);
  const subject = `PAOTECHS inquiry: ${data.get('interest')}`;
  const body = [`Name: ${data.get('name')}`, `Email: ${data.get('email')}`, `Company: ${data.get('company') || 'Not provided'}`, `Interest: ${data.get('interest')}`, '', 'Project details:', data.get('message')].join('\n');
  status.textContent = 'Your email app is opening with the inquiry prepared.';
  window.location.href = `mailto:hello@paotechs.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
