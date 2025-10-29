export function render(app) {
  app.innerHTML = `
    <section class="settings">
      <h2>⚙️ Settings</h2>
      <form>
        <label>Theme</label><select><option>Light</option><option>Dark</option></select>
        <label>Language</label><select><option>English</option></select>
        <label>Emoji Status</label><input type="checkbox" />
        <label>Cloud Sync</label><input type="checkbox" />
        <label>Media Quality</label><select><option>High</option><option>Low</option></select>
        <label>Accessibility Mode</label><input type="checkbox" />
        <label>Default Section</label><select><option>Music</option><option>Offline</option></select>
        <label>Experimental Features</label><input type="checkbox" />
      </form>
    </section>
  `;
}
