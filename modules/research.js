export function render(app) {
  app.innerHTML = `
    <section class="research">
      <h2>🔍 Research Hub</h2>
      <p>Use Gemini to brainstorm ideas, generate lyrics, and explore concepts.</p>
      <textarea placeholder="Ask Gemini something..."></textarea>
      <button>Add Note</button>
      <div class="gemini-response">[Response will appear here]</div>
    </section>
  `;
}
