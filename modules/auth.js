export function render(app) {
  app.innerHTML = `
    <section class="auth">
      <h2>🔐 Authentication</h2>
      <p>Login or register to access personalized features.</p>
      <button onclick="alert('Login clicked')">Login</button>
      <button onclick="alert('Register clicked')">Register</button>
    </section>
  `;
}
