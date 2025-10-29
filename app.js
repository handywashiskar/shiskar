import { render as settings } from './modules/settings.js';
import { render as calendar } from './modules/calendar.js';

const app = document.getElementById('app');

const routes = {
  settings,
  calendar
};

function loadModule(name) {
  app.innerHTML = '';
  if (routes[name]) {
    routes[name](app);
  } else {
    app.innerHTML = `<p>⚠️ Module "${name}" not found.</p>`;
  }
}

// Load module based on hash
window.addEventListener('hashchange', () => {
  const moduleName = location.hash.replace('#', '') || 'settings';
  loadModule(moduleName);
});

// Initial load
const initialModule = location.hash.replace('#', '') || 'settings';
loadModule(initialModule);

// Button clicks update hash
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    location.hash = btn.dataset.module;
  });
});

document.getElementById('settings-btn').onclick = () => {
  location.hash = 'settings';
};

document.getElementById('calendar-btn').onclick = () => {
  location.hash = 'calendar';
};
