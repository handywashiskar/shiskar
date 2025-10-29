export function render(app) {
  const userExists = localStorage.getItem('shiskarUser');

  app.innerHTML = `
    <section id="auth-card">
      <h2 id="auth-title">Welcome to Shiskar Studio</h2>

      <div id="switch-to-login" class="auth-switch">
        Already have an account? <button id="login-link">Log In</button>
      </div>

      <form id="signup-form" class="auth-form ${userExists ? 'hidden' : 'visible'}">
        <input type="email" id="signup-email" placeholder="Email" required>
        <input type="password" id="signup-password" placeholder="Password" required>
        <input type="password" id="signup-confirm" placeholder="Confirm Password" required>
        <input type="text" id="artist-name" placeholder="Artist Name (Unique)" required>

        <label for="dob">Date of Birth</label>
        <input type="date" id="dob" required>

        <select id="gender" required>
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
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

        <div class="auth-switch">
          Already have an account? <button id="login-link-bottom">Log In</button>
        </div>
      </form>

      <form id="login-form" class="auth-form ${userExists ? 'visible' : 'hidden'}">
        <input type="email" id="login-email" placeholder="Email" required>
        <input type="password" id="login-password" placeholder="Password" required>
        <button type="submit">Log In</button>
        <button type="button" id="google-login">Sign in with Google</button>

        <div class="auth-switch">
          New here? <button id="signup-link">Create Account</button>
        </div>
      </form>

      <div id="offline-warning" class="floating-warning hidden">
        ⚠️ You appear to be offline. Some features may be limited.
      </div>
    </section>
  `;

  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');

  // Manual switches
  document.getElementById('login-link').onclick = () => {
    signupForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
  };
  document.getElementById('login-link-bottom').onclick = () => {
    signupForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
  };
  document.getElementById('signup-link').onclick = () => {
    loginForm.classList.add('hidden');
    signupForm.classList.remove('hidden');
  };

  // Offline detection
  if (!navigator.onLine) {
    document.getElementById('offline-warning')?.classList.remove('hidden');
  }

  // Login logic
  loginForm.onsubmit = (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    // TODO: Firebase login logic here
    localStorage.setItem('shiskarUser', JSON.stringify({ email }));
    const lastModule = localStorage.getItem('lastModule') || 'music';
    location.hash = lastModule;
  };

  // Sign-up logic
  signupForm.onsubmit = (e) => {
    e.preventDefault();

    const termsAccepted = document.getElementById('terms-checkbox').checked;
    if (!termsAccepted) {
      alert('You must accept the Terms and Conditions to sign up.');
      return;
    }

    const dobInput = document.getElementById('dob').value;
    const dob = new Date(dobInput);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    if (age < 13) {
      alert('You must be at least 13 years old to create an account.');
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
