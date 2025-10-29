export function render(app) {
  app.innerHTML = `
    <section class="music">
      <h2>🎵 Music Module</h2>
      <p>Add, edit, preview, and manage your music with full metadata.</p>
      <button>Add New Track</button>
      <div class="music-list">[Track list will appear here]</div>
    </section>
  `;
}
