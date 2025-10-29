export function render(app) {
  app.innerHTML = `
    <section class="intro">
      <h1>Welcome to Shiskar Studio</h1>
      <p>Manage your music, videos, events, and ideas—all in one luxurious creative space.</p>
      <div class="intro-buttons">
        <button onclick="window.location.reload()">Get Started</button>
        <button onclick="window.location.reload()">Already have an account</button>
      </div>
    </section>
  `;
}
