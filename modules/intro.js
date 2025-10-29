export function render(app) {
  app.innerHTML = `
    <section class="intro">
      <h1>👋 Welcome to Shiskar Studio</h1>
      <p>Your creative command center for music, video, events, and ideas.</p>
      <button onclick="alert('Get Started clicked')">Get Started</button>
      <button onclick="alert('Already have an account clicked')">Already have an account</button>
    </section>
  `;
}
