export function renderMusic(app) {
  app.innerHTML = `
    <section id="music-module">
      <h2>🎶 My Tracks</h2>
      <button id="upload-track">Upload Track</button>
      <input type="file" id="track-file" accept="audio/*" hidden>
      <ul id="track-list"></ul>
    </section>
  `;

  const uploadBtn = document.getElementById('upload-track');
  const fileInput = document.getElementById('track-file');
  const trackList = document.getElementById('track-list');

  // Load saved tracks from localStorage
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

  uploadBtn.onclick = () => fileInput.click();

  fileInput.onchange = () => {
    const file = fileInput.files[0];
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
