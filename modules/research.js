export function render(app) {
  app.innerHTML = `
    <section class="research">
      <h2>🔍 Research Tools</h2>
      <p>Search and explore resources.</p>
      <input type="text" placeholder="Search..." />
      <button onclick="alert('Search triggered')">Search</button>
    </section>
  `;
}
