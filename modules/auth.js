export function render(app) {
  app.innerHTML = `
    <section id="auth-card">
      <h2 id="auth-title">Welcome to Shiskar Studio</h2>
      <div class="auth-toggle">
        <button id="show-login" class="active">Log In</button>
        <button id="show-signup">Sign Up</button>
      </div>

      <form id="login-form" class="auth-form visible">
        <input type="email" id="login-email" placeholder="Email" required>
        <input type="password" id="login-password" placeholder="Password" required>
        <button type="submit">Log In</button>
        <button type="button" id="google-login">Sign in with Google</button>
      </form>

      <form id="signup-form" class="auth-form hidden">
        <input type="email" id="signup-email" placeholder="Email" required>
        <input type="password" id="signup-password" placeholder="Password" required>
        <input type="password" id="signup-confirm" placeholder="Confirm Password" required>
        <input type="text" id="artist-name" placeholder="Artist Name (Unique)" required>
        <input type="date" id="dob" required>
        <select id="gender" required>
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>
        <select id="country" required>
          <option value="">Select Country</option>
          <option>Kenya</option>
          <option>Tanzania</option>
          <option>Uganda</option>
          <option>Rwanda</option>
          <option>Other</option>
        </select>
        <input type="tel" id="mobile" placeholder="Mobile Number (Optional)">
        <input type="email" id="comm-email" placeholder="Communication Email" required>

        <label class="terms-label">
          <input type="checkbox" id="terms-checkbox" required>
          I accept the <a href="https://github.com/handywashiskar/shiskar/blob/main/terms.md" target="_blank">Terms and Conditions</a> of Shiskar Studio.
        </label>

        <button type="submit">Sign Up</button>
        <button type="button" id="google-signup">Sign up with Google</button>
      </form>

      <div id="offline-warning" class="floating-warning hidden">
        ⚠️ You appear to be offline. Some features may be limited.
      </div>
    </section>
  `;

  // Toggle logic
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  document.getElementById('show-login').onclick = () => {
    loginForm.classList.remove('hidden');
    signupForm.classList.add('hidden');
    document.getElementById('show-login').classList.add('active');
    document.getElementById('show-signup').classList.remove('active');
  };
  document.getElementById('show-signup').onclick = () => {
    signupForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
    document.getElementById('show-signup').classList.add('active');
    document.getElementById('show-login').classList.remove('active');
  };

  // Offline detection
  if (!navigator.onLine) {
    document.getElementById('offline-warning')?.classList.remove('hidden');
  }

  // Login logic
  document.getElementById('login-form').onsubmit = (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    // TODO: Firebase login logic here
    localStorage.setItem('shiskarUser', JSON.stringify({ email }));
    const lastModule = localStorage.getItem('lastModule') || 'music';
    location.hash = lastModule;
  };

  // Sign-up logic
  document.getElementById('signup-form').onsubmit = (e) => {
    e.preventDefault();
    const termsAccepted = document.getElementById('terms-checkbox').checked;
    if (!termsAccepted) {
      alert('You must accept the Terms and Conditions to sign up.');
      return;
    }

    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirm = document.getElementById('signup-confirm').value;
    const artistName = document.getElementById('artist-name').value;

    if (password !== confirm) {
      alert('Passwords do not match.');
      return;
    }

    // TODO: Check artist name uniqueness via Firebase or local cache

    // TODO: Firebase sign-up logic here
    localStorage.setItem('shiskarUser', JSON.stringify({ email, artistName }));
    location.hash = 'music';
  };

  // Google login/signup buttons
  document.getElementById('google-login').onclick = () => {
    // TODO: Firebase Google login logic
    localStorage.setItem('shiskarUser', JSON.stringify({ email: 'googleuser@shiskar.com' }));
    const lastModule = localStorage.getItem('lastModule') || 'music';
    location.hash = lastModule;
  };

  document.getElementById('google-signup').onclick = () => {
    // TODO: Firebase Google sign-up logic
    localStorage.setItem('shiskarUser', JSON.stringify({ email: 'googleuser@shiskar.com' }));
    location.hash = 'music';
  };
  }
