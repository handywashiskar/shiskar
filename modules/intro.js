export function render(app) {
  app.innerHTML = `
    <section id="intro-card" class="fade-in">
      <h1 class="intro-title">Welcome to Shiskar Studio</h1>
      <p class="intro-description">
        Where rhythm meets clarity. Shiskar helps creators stay inspired, organized, and connected.
      </p>
      <div class="intro-buttons">
        <button id="get-started-btn">Get Started</button>
        <button id="login-btn">Log In</button>
      </div>
    </section>
    <div id="offline-warning" class="floating-warning hidden">
      ⚠️ Seems you are offline. Switch to offline mode.
    </div>
  `;

  // Animate card appearance
  setTimeout(() => {
    document.getElementById('intro-card')?.classList.add('visible');
  }, 100);

  // Show offline warning after delay
  setTimeout(() => {
    if (!navigator.onLine) {
      document.getElementById('offline-warning')?.classList.remove('hidden');
    }
  }, 3000);

  // Check for authenticated user
  const user = localStorage.getItem('shiskarUser');
  if (user) {
    location.hash = 'auth'; // Redirect to login view inside auth.js
    return;
  }

  // Button actions
  document.getElementById('get-started-btn').onclick = () => {
    const authCard = document.getElementById('auth-card');
    if (authCard) {
      document.getElementById('signup-link')?.click(); // Switch to Sign-Up
    } else {
      location.hash = 'auth';
    }
  };

  document.getElementById('login-btn').onclick = () => {
    const authCard = document.getElementById('auth-card');
    if (authCard) {
      document.getElementById('login-link')?.click(); // Switch to Login
    } else {
      location.hash = 'auth';
    }
  };
}
