// Login page (login.html). Talks to /api/auth; on success the server sets the session cookie and we go back to
// the page the visitor originally asked for (middleware.js passes it as ?next=).
const $ = id => document.getElementById(id);
let mode = 'login';

// Only paths on this site: '/x' is fine, but '//evil.com' or '/\evil.com' would leave the site, so they fall back
// to the home page (otherwise a crafted login link could send someone elsewhere after logging in).
function nextPage() {
  const next = new URLSearchParams(location.search).get('next') || '/';
  return /^\/(?![/\\])/.test(next) ? next : '/';
}

function setMode(m) {
  mode = m;
  const signup = m === 'signup';
  for (const [id, on] of [['m-login', !signup], ['m-signup', signup]]) {
    $(id).classList.toggle('on', on);
    $(id).setAttribute('aria-selected', on);
  }
  $('invite-row').hidden = !signup;
  // Lets password managers offer to save a new password on sign-up and fill the saved one on log-in.
  $('password').autocomplete = signup ? 'new-password' : 'current-password';
  $('hint').textContent = signup ? 'Pick a name nobody else has. It is shown to the others on the progress board and can\'t be changed later.'
    : 'Your name is shown to the others on the progress board.';
  $('submit').textContent = signup ? 'Create account' : 'Log in';
  $('error').hidden = true;
}

async function submit(e) {
  e.preventDefault();
  const btn = $('submit');
  btn.disabled = true;
  $('error').hidden = true;
  try {
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: mode, name: $('name').value, password: $('password').value, invite: $('invite').value }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) { location.replace(nextPage()); return; }
    $('error').textContent = data.error || `Something went wrong (${res.status}).`;
  } catch {
    $('error').textContent = 'No connection. Check your internet and try again.';
  }
  $('error').hidden = false;
  btn.disabled = false;
}

$('m-login').addEventListener('click', () => setMode('login'));
$('m-signup').addEventListener('click', () => setMode('signup'));
$('login').addEventListener('submit', submit);

// Already logged in (e.g. opened login.html from history): skip straight to the app.
fetch('/api/auth').then(r => { if (r.ok) location.replace(nextPage()); }).catch(() => {});
