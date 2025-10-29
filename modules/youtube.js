export function render(app) {
  app.innerHTML = `
    <section class="youtube">
      <h2>📺 YouTube Integration</h2>
      <p>Watch embedded videos.</p>
      <iframe width="100%" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allowfullscreen></iframe>
    </section>
  `;
}
