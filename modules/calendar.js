export function render(app) {
  app.innerHTML = `
    <section class="calendar">
      <h2>📅 Calendar</h2>
      <p>Plan your events and reminders.</p>
      <ul>
        <li>🗓️ Team sync – Friday 10am</li>
        <li>🎶 Music upload – Saturday 2pm</li>
      </ul>
    </section>
  `;
}
