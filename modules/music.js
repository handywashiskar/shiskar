import { uploadToB2 } from './b2.js';

export function render(app) {
  if (!app) return;

  app.innerHTML = `
    <section id="music-dashboard">
      <h2>🎶 My Music</h2>
      <input type="text" id="search-bar" placeholder="Search by genre, title, or tags">
      <div id="folder-tabs"></div>
      <ul id="song-list"></ul>
      <button id="add-music-btn">➕ Add Music</button>

      <div id="music-form" class="hidden">
        <h3 id="form-title">Add New Track</h3>

        <!-- Section 1: Basic Metadata -->
        <div class="form-section" id="section-1">
          <h4>1️⃣ Basic Info</h4>
          <input type="text" id="title" placeholder="Title" required>
          <input type="text" id="artist" placeholder="Artist Name" required>
          <input type="text" id="folder" placeholder="Folder/Project" required>
          <input type="text" id="genre" placeholder="Genre">
          <input type="text" id="tags" placeholder="Tags (comma-separated)">
          <select id="status">
            <option value="Draft">Draft</option>
            <option value="Final">Final</option>
            <option value="Published">Published</option>
          </select>
          <input type="text" id="country" placeholder="Country">
          <label><input type="checkbox" id="terms"> I accept the terms</label>
          <button id="next-1">Next</button>
        </div>

        <!-- Section 2: Cover Art -->
        <div class="form-section hidden" id="section-2">
          <h4>2️⃣ Cover Art</h4>
          <input type="file" id="artwork-file" accept="image/*">
          <div id="artwork-preview"></div>
          <div id="artwork-progress" class="upload-progress hidden">
            <div id="artwork-bar" class="upload-bar"></div>
          </div>
          <button id="next-2">Next</button>
        </div>

        <!-- Section 3: Audio Upload -->
        <div class="form-section hidden" id="section-3">
          <h4>3️⃣ Audio File</h4>
          <input type="file" id="audio-file" accept="audio/*">
          <div id="audio-progress" class="upload-progress hidden">
            <div id="audio-bar" class="upload-bar"></div>
          </div>
          <button id="next-3">Next</button>
        </div>

        <!-- Section 4: Advanced Details -->
        <div class="form-section hidden" id="section-4">
          <h4>4️⃣ Advanced Details</h4>
          <input type="text" id="isrc" placeholder="ISRC Code (optional)">
          <input type="text" id="featured" placeholder="Featured Artist">
          <input type="text" id="producer" placeholder="Producer">
          <input type="text" id="engineer" placeholder="Engineer">
          <textarea id="notes" placeholder="Private Notes"></textarea>
          <label><input type="checkbox" id="notify"> Notify followers</label>
          <label><input type="checkbox" id="smartlink"> Generate smart link</label>
          <button id="submit-track">Submit Track</button>
          <button id="cancel-form">Cancel</button>
        </div>
      </div>
    </section>
  `;

  let songs = [];
  let editingIndex = null;
  let artworkUrl = '';
  let audioUrl = '';

  const form = document.getElementById('music-form');
  const artworkFile = document.getElementById('artwork-file');
  const artworkPreview = document.getElementById('artwork-preview');
  const artworkProgress = document.getElementById('artwork-progress');
  const artworkBar = document.getElementById('artwork-bar');
  const audioFile = document.getElementById('audio-file');
  const audioProgress = document.getElementById('audio-progress');
  const audioBar = document.getElementById('audio-bar');

  document.getElementById('add-music-btn').onclick = () => {
    form.classList.remove('hidden');
    showSection(1);
    editingIndex = null;
  };

  document.getElementById('cancel-form').onclick = () => {
    form.classList.add('hidden');
    form.reset();
    artworkPreview.innerHTML = '';
    artworkProgress.classList.add('hidden');
    audioProgress.classList.add('hidden');
    artworkBar.style.width = '0%';
    audioBar.style.width = '0%';
    editingIndex = null;
  };

  function showSection(n) {
    for (let i = 1; i <= 4; i++) {
      document.getElementById(`section-${i}`).classList.add('hidden');
    }
    document.getElementById(`section-${n}`).classList.remove('hidden');
  }

  document.getElementById('next-1').onclick = () => {
    const title = document.getElementById('title').value;
    const artist = document.getElementById('artist').value;
    const folder = document.getElementById('folder').value;
    const terms = document.getElementById('terms').checked;
    if (title && artist && folder && terms) {
      showSection(2);
    } else {
      alert('Please complete all required fields and accept terms.');
    }
  };

  document.getElementById('next-2').onclick = async () => {
    const file = artworkFile.files[0];
    if (!file) return alert('Please select artwork.');
    artworkProgress.classList.remove('hidden');
    try {
      const res = await uploadToB2(file, percent => {
        artworkBar.style.width = percent + '%';
      });
      artworkUrl = res.url;
      const reader = new FileReader();
      reader.onload = () => {
        artworkPreview.innerHTML = `<img src="${reader.result}" style="max-width:100px;">`;
      };
      reader.readAsDataURL(file);
      showSection(3);
    } catch (err) {
      alert('Artwork upload failed.');
    }
  };

  document.getElementById('next-3').onclick = async () => {
    const file = audioFile.files[0];
    if (!file) return alert('Please select audio file.');
    audioProgress.classList.remove('hidden');
    try {
      const res = await uploadToB2(file, percent => {
        audioBar.style.width = percent + '%';
      });
      audioUrl = res.url;
      showSection(4);
    } catch (err) {
      alert('Audio upload failed.');
    }
  };

  document.getElementById('submit-track').onclick = () => {
    const song = {
      title: document.getElementById('title').value,
      artist: document.getElementById('artist').value,
      folder: document.getElementById('folder').value,
      genre: document.getElementById('genre').value,
      tags: document.getElementById('tags').value.split(',').map(t => t.trim()),
      status: document.getElementById('status').value,
      country: document.getElementById('country').value,
      isrc: document.getElementById('isrc').value,
      featured: document.getElementById('featured').value,
      producer: document.getElementById('producer').value,
      engineer: document.getElementById('engineer').value,
      notes: document.getElementById('notes').value,
      notify: document.getElementById('notify').checked,
      smartlink: document.getElementById('smartlink').checked,
      audioUrl,
      artworkUrl,
      timestamp: new Date().toISOString()
    };

    if (editingIndex !== null) {
      songs[editingIndex] = song;
    } else {
      songs.push(song);
    }

    form.classList.add('hidden');
    form.reset();
    artworkPreview.innerHTML = '';
    artworkProgress.classList.add('hidden');
    audioProgress.classList.add('hidden');
    artworkBar.style.width = '0%';
    audioBar.style.width = '0%';
    editingIndex = null;
    renderSongs();
  };

  function renderSongs(filter = '') {
    const songList = document.getElementById('song-list');
    songList.innerHTML = '';
    const filtered = songs.filter(song =>
      song.title.toLowerCase().includes(filter.toLowerCase()) ||
      song.genre.toLowerCase().includes(filter.toLowerCase()) ||
      song.tags.some(tag => tag.toLowerCase().includes(filter.toLowerCase()))
    );

    const folders = [...new Set(songs.map(s => s.folder))];
    const folderTabs = document.getElementById('folder-tabs');
    folderTabs.innerHTML = folders.map(f => `<button class="folder-tab">${f}</button>`).join('');
folderTabs.innerHTML = folders.map(f => `<button class="folder-tab">${f}</button>`).join('');
    document.querySelectorAll('.folder-tab').forEach(btn => {
      btn.onclick = () => renderSongsByFolder(btn.textContent);
    });

    filtered.forEach((song, index) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>${song.title}</strong> by ${song.artist} <br>
        <audio controls src="${song.audioUrl}"></audio><br>
        ${song.artworkUrl ? `<img src="${song.artworkUrl}" style="max-width:80px;">` : ''}
        <div><em>${song.status}</em> • ${song.country} • ${new Date(song.timestamp).toLocaleString()}</div>
        <div>Tags: ${song.tags.join(', ')}</div>
        <div>Credits: ${song.featured || '—'} / ${song.producer || '—'} / ${song.engineer || '—'}</div>
        <div>Notes: ${song.notes || '—'}</div>
        <button onclick="editSong(${index})">✏️ Edit</button>
        <button onclick="deleteSong(${index})">🗑️ Delete</button>
      `;
      songList.appendChild(li);
    });
  }

  function renderSongsByFolder(folderName) {
    const filtered = songs.filter(song => song.folder === folderName);
    const songList = document.getElementById('song-list');
    songList.innerHTML = '';
    filtered.forEach((song, index) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>${song.title}</strong> by ${song.artist} <br>
        <audio controls src="${song.audioUrl}"></audio><br>
        ${song.artworkUrl ? `<img src="${song.artworkUrl}" style="max-width:80px;">` : ''}
        <div><em>${song.status}</em> • ${song.country} • ${new Date(song.timestamp).toLocaleString()}</div>
        <div>Tags: ${song.tags.join(', ')}</div>
        <div>Credits: ${song.featured || '—'} / ${song.producer || '—'} / ${song.engineer || '—'}</div>
        <div>Notes: ${song.notes || '—'}</div>
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
    document.getElementById('status').value = song.status;
    document.getElementById('country').value = song.country;
    document.getElementById('isrc').value = song.isrc || '';
    document.getElementById('featured').value = song.featured || '';
    document.getElementById('producer').value = song.producer || '';
    document.getElementById('engineer').value = song.engineer || '';
    document.getElementById('notes').value = song.notes || '';
    document.getElementById('notify').checked = song.notify || false;
    document.getElementById('smartlink').checked = song.smartlink || false;
    artworkUrl = song.artworkUrl;
    audioUrl = song.audioUrl;
    artworkPreview.innerHTML = song.artworkUrl ? `<img src="${song.artworkUrl}" style="max-width:100px;">` : '';
    form.classList.remove('hidden');
    showSection(1);
    editingIndex = index;
    document.getElementById('form-title').textContent = 'Edit Track';
  };

  window.deleteSong = (index) => {
    if (confirm('Delete this song?')) {
      songs.splice(index, 1);
      renderSongs();
    }
  };

  renderSongs();
        }
