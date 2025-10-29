export function render(app) {
  app.innerHTML = `
    <section class="notifications">
      <h2>🔔 Notifications</h2>
      <p>You have 2 new alerts.</p>
      <ul>
        <li>📢 Update available</li>
        <li>📅 Event reminder</li>
      </ul>
    </section>
  `;
}
