export function render(app) {
  app.innerHTML = `
    <section class="video">
      <h2>🎬 Video Module</h2>
      <p>Upload or link videos, preview them, and manage your collection.</p>
      <div class="video-preview">[Video player here]</div>
    </section>
  `;
}
