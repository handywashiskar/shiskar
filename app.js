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

  const user = localStorage.getItem('shiskarUser');
  const publicModules = ['intro', 'auth', 'offline-music'];

  if (!user && !publicModules.includes(name)) {
    alert('You must log in first.');
    location.hash = 'auth';
    return;
  }

  if (routes[name]) {
    routes[name](app);
  } else {
    app.innerHTML = `<p>⚠️ Module "${name}" not found.</p>`;
  }
}

window.addEventListener('hashchange', () => {
  const moduleName = location.hash.replace('#', '') || 'intro';
  loadModule(moduleName);
});

const initialModule = location.hash.replace('#', '') || 'intro';
loadModule(initialModule);

// Footer navigation
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    location.hash = btn.dataset.module;
  });
});

// Hamburger menu toggle
document.getElementById('hamburger-btn').addEventListener('click', () => {
  document.getElementById('hamburger-menu').classList.toggle('hidden');
});

// Hamburger menu navigation
document.querySelectorAll('#hamburger-menu button').forEach(btn => {
  btn.addEventListener('click', () => {
    location.hash = btn.dataset.module;
    document.getElementById('hamburger-menu').classList.add('hidden');
  });
});

// Auto-collapse hamburger menu when clicking outside
document.addEventListener('click', (e) => {
  const menu = document.getElementById('hamburger-menu');
  const toggle = document.getElementById('hamburger-btn');
  if (!menu.contains(e.target) && e.target !== toggle) {
    menu.classList.add('hidden');
  }
});
