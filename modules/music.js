export function renderMusic(app) {
  app.innerHTML = `
    <section id="music-module">
      <h2>🎶 Music Player</h2>
      <p>Stream your favorite tracks.</p>
      <button id="upload-btn">Upload Track</button>
      <input type="file" id="track-input" accept="audio/*" hidden>
      <ul id="track-list"></ul>
    </section>
  `;

  const uploadBtn = document.getElementById('upload-btn');
  const trackInput = document.getElementById('track-input');
  const trackList = document.getElementById('track-list');

  // Load saved tracks
  const savedTracks = JSON.parse(localStorage.getItem('shiskarTracks') || '[]');
  savedTracks.forEach(({ name, url }) => {
    const li = document.createElement('li');
    li.textContent = name;

    const audio = document.createElement('audio');
    audio.controls = true;
    audio.src = url;

    li.appendChild(audio);
    trackList.appendChild(li);
  });

  // Upload logic
  uploadBtn.onclick = () => trackInput.click();

  trackInput.onchange = () => {
    const file = trackInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result;
      const li = document.createElement('li');
      li.textContent = file.name;

      const audio = document.createElement('audio');
      audio.controls = true;
      audio.src = url;

      li.appendChild(audio);
      trackList.appendChild(li);

      // Save to localStorage
      savedTracks.push({ name: file.name, url });
      localStorage.setItem('shiskarTracks', JSON.stringify(savedTracks));
    };
    reader.readAsDataURL(file);
  };
}
