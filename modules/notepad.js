export function render(app) {
  app.innerHTML = `
    <section class="notepad">
      <h2>📝 Notepad</h2>
      <textarea rows="8" cols="30" placeholder="Write your notes here..."></textarea>
    </section>
  `;
}
