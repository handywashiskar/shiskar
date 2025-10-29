import { render as intro } from './modules/intro.js';
import { render as auth } from './modules/auth.js';
import { render as music } from './modules/music.js';
import { render as offlineMusic } from './modules/offline-music.js';
import { render as video } from './modules/video.js';
import { render as calendar } from './modules/calendar.js';
import { render as youtube } from './modules/youtube.js';
import { render as research } from './modules/research.js';
import { render as notepad } from './modules/notepad.js';
import { render as settings } from './modules/settings.js';
import { render as notifications } from './modules/notifications.js';
import { render as profile } from './modules/profile.js';

const app = document.getElementById('app');

const routes = {
  intro,
  auth,
  music,
  'offline-music': offlineMusic,
  video,
  calendar,
  youtube,
  research,
  notepad,
  settings,
  notifications,
  profile
};

function loadModule(name) {
  app.innerHTML = '';
  if (routes[name]) {
    routes[name](app);
  } else {
    app.innerHTML = `<p>⚠️ Module "${name}" not found.</p>`;
  }
}

// Listen for hash changes
window.addEventListener('hashchange', () => {
  const moduleName = location.hash.replace('#', '') || 'intro';
  loadModule(moduleName);
});

// Initial load
const initialModule = location.hash.replace('#', '') || 'intro';
loadModule(initialModule);

// Update hash when buttons are clicked
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    location.hash = btn.dataset.module;
  });
});

document.getElementById('notifications-btn').onclick = () => {
  location.hash = 'notifications';
};

document.getElementById('profile-btn').onclick = () => {
  location.hash = 'profile';
};
