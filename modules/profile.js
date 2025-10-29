export function render(app) {
  app.innerHTML = `
    <section class="profile">
      <h2>👤 Profile</h2>
      <p>Manage your account and preferences.</p>
      <label>Name: <input type="text" value="Kijana" /></label>
    </section>
  `;
}
