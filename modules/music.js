export function render(app) {
  app.innerHTML = `
    <section class="music">
      <h2>🎵 Music Player</h2>
      <p>Stream your favorite tracks.</p>
      <audio controls src="https://example.com/sample.mp3"></audio>
    </section>
  `;
}
