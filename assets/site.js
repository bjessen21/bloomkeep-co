(function () {
'use strict';

// ---- Mobile menu toggle ----
var menuBtn = document.querySelector('.menu-toggle');
var links = document.querySelector('.links');
if (menuBtn && links) {
menuBtn.addEventListener('click', function () {
var isOpen = links.classList.toggle('open');
menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
});
}

// ---- Services sub-menu (click/tap toggle, hover still works via CSS) ----
var toggles = document.querySelectorAll('.sub-toggle');
toggles.forEach(function (btn) {
var panel = btn.parentElement.querySelector('.panel');
if (!panel) return;
btn.addEventListener('click', function (e) {
e.preventDefault();
var isOpen = panel.classList.toggle('open');
btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
});
});

document.addEventListener('click', function (e) {
document.querySelectorAll('.has-sub .panel.open').forEach(function (panel) {
if (!panel.parentElement.contains(e.target)) {
panel.classList.remove('open');
var btn = panel.parentElement.querySelector('.sub-toggle');
if (btn) btn.setAttribute('aria-expanded', 'false');
}
});
});

document.addEventListener('keydown', function (e) {
if (e.key === 'Escape') {
document.querySelectorAll('.has-sub .panel.open').forEach(function (panel) {
panel.classList.remove('open');
});
document.querySelectorAll('.sub-toggle').forEach(function (btn) {
btn.setAttribute('aria-expanded', 'false');
});
if (links) links.classList.remove('open');
if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
}
});

// ---------------------------------------------------------------
// Lead form submission — Google Apps Script Web App.
// Paste your deployed Web App URL below. See
// apps-script-lead-form.gs.txt for deployment steps.
// ---------------------------------------------------------------
var LEAD_ENDPOINT = 'https://script.google.com/macros/s/AKfycbzwAZ_34VVE0t62bImlKrKhgj2S2ZFgZ9ErC0v0QnaiPi-zsf-5eLyD5zMkG7GtwMQqlw/exec';

document.querySelectorAll('form.quote-form').forEach(function (form) {
var note = form.querySelector('.form-note');

form.addEventListener('submit', function (e) {
e.preventDefault();

if (LEAD_ENDPOINT.indexOf('PASTE_YOUR') === 0) {
if (note) {
note.textContent = 'This form is not connected yet — add the Apps Script Web App URL in assets/site.js.';
note.className = 'form-note bad';
note.hidden = false;
}
return;
}

var btn = form.querySelector('button[type="submit"]');
var originalText = btn ? btn.textContent : '';
if (btn) {
btn.disabled = true;
btn.textContent = 'Sending…';
}
if (note) note.hidden = true;

var data = new FormData(form);

// Apps Script Web Apps don't return CORS headers, so the response
// body can't be read from fetch(). mode:"no-cors" lets the POST
// go through and land in the Sheet; a successful fetch (no network
// error) is treated as success here.
fetch(LEAD_ENDPOINT, { method: 'POST', mode: 'no-cors', body: data })
.then(function () {
form.reset();
// Note: the confirmation message lives inside the form, so we
// keep the form itself visible (just disabled) rather than
// hiding it — hiding the form would hide the message too and
// leave the visitor with no confirmation their request sent.
form.querySelectorAll('input, textarea, select, button').forEach(function (el) {
el.disabled = true;
});
if (btn) btn.textContent = 'Request Sent ✓';
if (note) {
note.textContent = "Thank you — we've received your request and will follow up within one business day.";
note.className = 'form-note ok';
note.hidden = false;
}
})
.catch(function () {
if (note) {
note.textContent = 'Something went wrong sending your request. Please call or text us directly.';
note.className = 'form-note bad';
note.hidden = false;
}
if (btn) {
btn.disabled = false;
btn.textContent = originalText;
}
});
});
});
})();
