export function render(app) {
  app.innerHTML = `
    <section class="profile">
      <h2>👤 Artist Profile</h2>
      <form>
        <label>Name</label><input type="text" />
        <label>Genre</label><input type="text" />
        <label>Bio</label><textarea></textarea>
        <label>YouTube Channel URL</label><input type="url" />
        <label>Social Links</label><input type="url" />
        <button>Save</button>
        <button onclick="window.location.reload()">Logout</button>
      </form>
    </section>
  `;
}
