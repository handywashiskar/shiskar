export function render(app) {
  app.innerHTML = `
    <section class="video">
      <h2>🎬 Video Center</h2>
      <p>Watch and manage your videos.</p>
      <video controls width="100%">
        <source src="https://example.com/sample.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </section>
  `;
}
