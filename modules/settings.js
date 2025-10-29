export function render(app) {
  app.innerHTML = `
    <section class="settings">
      <h2>⚙️ Settings</h2>
      <p>Customize your preferences here.</p>
      <label>
        Theme:
        <select onchange="alert('Theme changed')">
          <option>Light</option>
          <option>Dark</option>
        </select>
      </label>
    </section>
  `;
}
