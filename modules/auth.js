export function render(app) {
  app.innerHTML = `
    <section class="auth">
      <h2>Login or Create Account</h2>
      <form>
        <input type="email" placeholder="Email" required />
        <input type="password" placeholder="Password" required />
        <button type="submit">Login</button>
        <p>or</p>
        <button type="button">Sign in with Google</button>
      </form>
    </section>
  `;
}
