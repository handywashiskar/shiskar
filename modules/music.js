import { uploadToB2 } from './b2.js';

export function renderMusic(app) {
  app.innerHTML = `
    <section id="music-dashboard">
      <h2>🎶 My Music</h2>
      <input type="text" id="search-bar" placeholder="Search by genre or tags">
      <div id="folder-tabs"></div>
      <ul id="song-list"></ul>
      <button id="add-music-btn">➕ Add Music</button>
      <form id="music-form" class="hidden">
        <input type="text" id="title" placeholder="Title" required>
        <input type="text" id="artist" placeholder="Artist Name" required>
        <input type="text" id="folder" placeholder="Folder/Category" required>
        <input type="text" id="genre" placeholder="Genre">
        <input type="text" id="tags" placeholder="Tags (comma-separated)">
        <input type="file" id="audio-file" accept="audio/*" required>
        <input type="file" id="artwork-file" accept="image/*">
        <div id="artwork-preview"></div>
        <button type="submit">Upload Track</button>
        <button type="button" id="cancel-form">Cancel</button>
      </form>
    </section>
  `;

  const songList = document.getElementById('song-list');
  const folderTabs = document.getElementById('folder-tabs');
  const searchBar = document.getElementById('search-bar');
  const form = document.getElementById('music-form');
  const artworkFile = document.getElementById('artwork-file');
  const artworkPreview = document.getElementById('artwork-preview');

  let songs = [];

  // Artwork preview
  artworkFile.onchange = () => {
    const file = artworkFile.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      artworkPreview.innerHTML = `<img src="${reader.result}" alt="Artwork" style="max-width:100px;">`;
    };
    reader.readAsDataURL(file);
  };

  // Show form
  document.getElementById('add-music-btn').onclick = () => {
    form.classList.remove('hidden');
  };
  document.getElementById('cancel-form').onclick = () => {
    form.classList.add('hidden');
  };

  // Submit form
  form.onsubmit = async (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const artist = document.getElementById('artist').value;
    const folder = document.getElementById('folder').value;
    const genre = document.getElementById('genre').value;
    const tags = document.getElementById('tags').value.split(',').map(t => t.trim());
    const audioFile = document.getElementById('audio-file').files[0];
    const artwork = artworkFile.files[0];

    if (!title || !artist || !folder || !audioFile) {
      alert('Please fill all required fields.');
      return;
    }

    const audioUrl = await uploadToB2(audioFile);
    let artworkUrl = '';
    if (artwork) artworkUrl = await uploadToB2(artwork);

    const song = { title, artist, folder, genre, tags, audioUrl, artworkUrl };
    songs.push(song);
    renderSongs();
    form.reset();
    artworkPreview.innerHTML = '';
    form.classList.add('hidden');
  };

  // Render songs
  function renderSongs(filter = '') {
    songList.innerHTML = '';
    const filtered = songs.filter(song =>
      song.genre?.toLowerCase().includes(filter.toLowerCase()) ||
      song.tags?.some(tag => tag.toLowerCase().includes(filter.toLowerCase()))
    );

    const folders = [...new Set(songs.map(s => s.folder))];
    folderTabs.innerHTML = folders.map(f => `<button class="folder-tab">${f}</button>`).join('');
    document.querySelectorAll('.folder-tab').forEach(btn => {
      btn.onclick = () => renderSongsByFolder(btn.textContent);
    });

    (filter ? filtered : songs).forEach((song, index) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>${song.title}</strong> by ${song.artist}<br>
        <audio controls src="${song.audioUrl}"></audio><br>
        ${song.artworkUrl ? `<img src="${song.artworkUrl}" style="max-width:80px;">` : ''}
        <button onclick="editSong(${index})">✏️ Edit</button>
        <button onclick="deleteSong(${index})">🗑️ Delete</button>
      `;
      songList.appendChild(li);
    });
  }

  function renderSongsByFolder(folderName) {
    const filtered = songs.filter(song => song.folder === folderName);
    songList.innerHTML = '';
    filtered.forEach((song, index) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>${song.title}</strong> by ${song.artist}<br>
        <audio controls src="${song.audioUrl}"></audio><br>
        ${song.artworkUrl ? `<img src="${song.artworkUrl}" style="max-width:80px;">` : ''}
        <button onclick="editSong(${index})">✏️ Edit</button>
        <button onclick="deleteSong(${index})">🗑️ Delete</button>
      `;
      songList.appendChild(li);
    });
  }

  searchBar.oninput = () => {
    renderSongs(searchBar.value);
  };

  window.editSong = (index) => {
    const song = songs[index];
    document.getElementById('title').value = song.title;
    document.getElementById('artist').value = song.artist;
    document.getElementById('folder').value = song.folder;
    document.getElementById('genre').value = song.genre;
    document.getElementById('tags').value = song.tags.join(', ');
    form.classList.remove('hidden');
    songs.splice(index, 1);
  };

  window.deleteSong = (index) => {
    if (confirm('Delete this song?')) {
      songs.splice(index, 1);
      renderSongs();
    }
  };
                     }
