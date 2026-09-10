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
form.addEventListener('submit', async event => {
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
  const submit = form.querySelector('button[type="submit"]');
  status.textContent = 'Sending your inquiry…';
  submit.disabled = true;
  window.dataLayer.push({ event: 'generate_lead', service: interest.value });
  const data = Object.fromEntries(new FormData(form));
  try {
    const response = await fetch('/api/inquiry', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(data) });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Unable to send inquiry.');
    form.reset();
    status.textContent = 'Thank you—your inquiry has been sent. We’ll be in touch soon.';
  } catch (error) {
    status.textContent = error.message || 'Unable to send your inquiry. Please email hello@paotechs.com.';
  } finally {
    submit.disabled = false;
  }
});

const paolaLauncher = document.getElementById('paola-launcher');
const paolaPanel = document.getElementById('paola-panel');
const paolaClose = document.getElementById('paola-close');
const paolaForm = document.getElementById('paola-form');
const paolaInput = document.getElementById('paola-input');
const paolaMessages = document.getElementById('paola-messages');

const paolaAnswers = [
  { terms: ['labaflow', 'laundry'], answer: 'LabaFlow is our laundry operations platform for customer management, orders, service tracking, loyalty, payments, and multi-branch workflows. You can explore it on the LabaFlow page.', link: ['Explore LabaFlow', 'labaflow.html'] },
  { terms: ['retail', 'inventory', 'pos', 'barcode', 'stock'], answer: 'Our Retail Sales & Inventory platform connects point-of-sale, barcode workflows, purchasing, stock transfers, expenses, reporting, and branch-level inventory.', link: ['Explore the retail platform', 'retail-solutions.html'] },
  { terms: ['salesforce', 'crm', 'apex', 'flow'], answer: 'Yes. PAOTECHS provides Salesforce administration, development, automation, reporting, integrations, and ongoing support backed by more than 14 years of hands-on experience.', link: ['Discuss a Salesforce need', '#contact'] },
  { terms: ['website', 'web site', 'landing page', 'seo'], answer: 'We build fast, responsive websites that clearly communicate your value and make it easier for customers to connect. We can also help with SEO foundations and ongoing improvements.', link: ['Start a website inquiry', '#contact'] },
  { terms: ['automation', 'manual', 'workflow', 'repetitive', 'process'], answer: 'We can map repetitive or error-prone work and turn it into a practical automated workflow. The best starting point is a short description of the current process and where time is being lost.', link: ['Tell us about the process', '#contact'] },
  { terms: ['integration', 'connect systems', 'api'], answer: 'PAOTECHS can connect the tools your team already uses so information flows more reliably between systems. Share the systems involved and the result you want to achieve.', link: ['Discuss an integration', '#contact'] },
  { terms: ['custom app', 'application', 'software', 'system'], answer: 'We design custom business applications around your actual workflow, users, and goals—from discovery and process mapping through launch and ongoing improvement.', link: ['Explore custom solutions', 'custom-apps.html'] },
  { terms: ['price', 'pricing', 'cost', 'quote', 'quotation', 'how much'], answer: 'Project pricing depends on the scope, users, integrations, and support required. I don’t create quotations, but the PAOTECHS team can review your needs and provide the right estimate.', link: ['Request a consultation', '#contact'] },
  { terms: ['support', 'maintenance', 'help'], answer: 'We provide dependable technical support, maintenance, and continuous improvements for business systems. Tell us what platform you use and what help you need.', link: ['Request technical support', '#contact'] },
  { terms: ['service', 'services', 'what do you do', 'offer'], answer: 'PAOTECHS provides custom business applications, Salesforce solutions, websites, process automation, system integrations, and ongoing technical support. We also offer LabaFlow and our Retail Sales & Inventory platform.', link: ['View all services', '#services'] },
  { terms: ['contact', 'talk', 'meeting', 'consultation', 'inquiry'], answer: 'You can send the team a secure inquiry using the form below, or email hello@paotechs.com. Include your goal and current challenge so we can respond more helpfully.', link: ['Open the inquiry form', '#contact'] }
];

function paolaOpen() {
  paolaPanel.setAttribute('aria-hidden', 'false');
  paolaLauncher.setAttribute('aria-expanded', 'true');
  window.setTimeout(() => paolaInput.focus(), 120);
}
function paolaHide() {
  paolaPanel.setAttribute('aria-hidden', 'true');
  paolaLauncher.setAttribute('aria-expanded', 'false');
  paolaLauncher.focus();
}
function paolaAdd(text, who, link) {
  const message = document.createElement('div');
  message.className = `paola-message ${who}`;
  const paragraph = document.createElement('p');
  paragraph.textContent = text;
  message.appendChild(paragraph);
  if (link) {
    const anchor = document.createElement('a');
    anchor.href = link[1]; anchor.textContent = `${link[0]} →`;
    anchor.addEventListener('click', () => { if (link[1].startsWith('#')) paolaHide(); });
    message.appendChild(anchor);
  }
  paolaMessages.appendChild(message);
  paolaMessages.scrollTop = paolaMessages.scrollHeight;
}
function paolaReply(question) {
  const normalized = question.toLowerCase();
  const match = paolaAnswers.find(item => item.terms.some(term => normalized.includes(term)));
  window.setTimeout(() => {
    if (match) paolaAdd(match.answer, 'bot', match.link);
    else paolaAdd('That sounds like something the PAOTECHS team should review with you. Please share a few details through the secure inquiry form, and they’ll recommend the most practical next step.', 'bot', ['Send an inquiry', '#contact']);
  }, 350);
}
function paolaAsk(question) {
  const clean = question.trim().slice(0, 500);
  if (!clean) return;
  paolaAdd(clean, 'user');
  paolaInput.value = '';
  paolaReply(clean);
  window.dataLayer.push({ event: 'paola_question' });
}
paolaLauncher.addEventListener('click', () => paolaPanel.getAttribute('aria-hidden') === 'true' ? paolaOpen() : paolaHide());
paolaClose.addEventListener('click', paolaHide);
paolaForm.addEventListener('submit', event => { event.preventDefault(); paolaAsk(paolaInput.value); });
document.querySelectorAll('[data-paola-question]').forEach(button => button.addEventListener('click', () => paolaAsk(button.dataset.paolaQuestion)));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && paolaPanel.getAttribute('aria-hidden') === 'false') paolaHide(); });
