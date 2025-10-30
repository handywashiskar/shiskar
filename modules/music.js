// modules/music.js
// Music dashboard, add/edit/delete, artwork preview, folder organization, search/filter.
// Assumes an element with id="app" exists and that b2.js provides uploadToB2(file)

import { uploadToB2 } from './b2.js';

export function renderMusic(app) {
  if (!app) {
    console.error('renderMusic: container element (app) is missing');
    return;
  }

  app.innerHTML = `
    <section id="music-dashboard" class="music-dashboard">
      <header class="music-header">
        <h2>🎶 My Music</h2>
        <div class="music-controls">
          <input id="search-bar" class="search-bar" type="text" placeholder="Search by title, genre, or tags">
          <button id="add-music-btn" class="btn primary">➕ Add Music</button>
        </div>
      </header>

      <nav id="folder-tabs" class="folder-tabs"></nav>

      <main>
        <ul id="song-list" class="song-list"></ul>
      </main>

      <div id="music-form-container" class="music-form-container hidden" aria-hidden="true">
        <form id="music-form" class="music-form">
          <h3 id="form-title">Add New Track</h3>

          <div class="form-section">
            <label>Title *</label>
            <input id="title" name="title" required>
            <label>Artist *</label>
            <input id="artist" name="artist" required>
            <label>Folder / Category *</label>
            <input id="folder" name="folder" required>
          </div>

          <div class="form-section">
            <label>Genre</label>
            <input id="genre" name="genre">
            <label>Tags (comma-separated)</label>
            <input id="tags" name="tags" placeholder="tag1, tag2">
          </div>

          <div class="form-section">
            <label>Audio File * (or leave blank to use URL)</label>
            <input id="audio-file" type="file" accept="audio/*">
            <label>Or Audio URL</label>
            <input id="audio-url" placeholder="https://...">
          </div>

          <div class="form-section">
            <label>Artwork (optional)</label>
            <input id="artwork-file" type="file" accept="image/*">
            <div id="artwork-preview" class="artwork-preview" aria-live="polite"></div>
          </div>

          <div class="form-actions">
            <button type="submit" id="submit-track" class="btn primary">Save</button>
            <button type="button" id="cancel-form" class="btn">Cancel</button>
          </div>

        </form>
      </div>
    </section>
  `;

  // State
  let songs = []; // in-memory; replace with persistent store later
  let editingId = null;

  // Elements
  const addBtn = app.querySelector('#add-music-btn');
  const formContainer = app.querySelector('#music-form-container');
  const form = app.querySelector('#music-form');
  const cancelBtn = app.querySelector('#cancel-form');
  const songList = app.querySelector('#song-list');
  const folderTabs = app.querySelector('#folder-tabs');
  const searchBar = app.querySelector('#search-bar');
  const artworkFileInput = app.querySelector('#artwork-file');
  const artworkPreview = app.querySelector('#artwork-preview');
  const audioFileInput = app.querySelector('#audio-file');
  const audioUrlInput = app.querySelector('#audio-url');

  // Helpers
  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
  }

  function showForm() {
    form.reset();
    artworkPreview.innerHTML = '';
    editingId = null;
    formContainer.classList.remove('hidden');
    formContainer.setAttribute('aria-hidden', 'false');
    app.querySelector('#form-title').textContent = 'Add New Track';
  }

  function hideForm() {
    form.reset();
    artworkPreview.innerHTML = '';
    editingId = null;
    formContainer.classList.add('hidden');
    formContainer.setAttribute('aria-hidden', 'true');
  }

  function renderFolderTabs() {
    const folders = Array.from(new Set(songs.map(s => s.folder || 'Unsorted')));
    folderTabs.innerHTML = '';
    const allBtn = document.createElement('button');
    allBtn.className = 'folder-tab active';
    allBtn.textContent = 'All';
    allBtn.dataset.folder = '';
    folderTabs.appendChild(allBtn);

    folders.forEach(f => {
      const btn = document.createElement('button');
      btn.className = 'folder-tab';
      btn.textContent = f;
      btn.dataset.folder = f;
      folderTabs.appendChild(btn);
    });
  }

  function renderSongs(filter = '', folder = '') {
    songList.innerHTML = '';
    const search = (filter || '').trim().toLowerCase();

    const filtered = songs.filter(s => {
      if (folder && folder !== '' && (s.folder || '') !== folder) return false;
      if (!search) return true;
      const inTitle = (s.title || '').toLowerCase().includes(search);
      const inGenre = (s.genre || '').toLowerCase().includes(search);
      const inTags = (s.tags || []).some(t => t.toLowerCase().includes(search));
      const inArtist = (s.artist || '').toLowerCase().includes(search);
      return inTitle || inGenre || inTags || inArtist;
    });

    if (filtered.length === 0) {
      songList.innerHTML = `<li class="empty">No tracks found.</li>`;
      return;
    }

    filtered.forEach(song => {
      const li = document.createElement('li');
      li.className = 'song-card';
      li.dataset.id = song.id;

      const artworkHtml = song.artworkUrl
        ? `<img class="song-artwork" src="${song.artworkUrl}" alt="Artwork for ${escapeHtml(song.title)}">`
        : `<div class="song-artwork placeholder">No Artwork</div>`;

      const tags = (song.tags || []).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join(' ');

      li.innerHTML = `
        <div class="song-left">
          ${artworkHtml}
        </div>
        <div class="song-mid">
          <div class="song-meta">
            <div class="song-title">${escapeHtml(song.title)}</div>
            <div class="song-sub">${escapeHtml(song.artist)} • ${escapeHtml(song.folder || '')}</div>
            <div class="song-tags">${tags}</div>
          </div>
          <div class="song-player">
            <audio controls src="${escapeAttr(song.audioUrl)}"></audio>
          </div>
        </div>
        <div class="song-right">
          <button class="btn edit-btn" data-action="edit">✏️</button>
          <button class="btn delete-btn" data-action="delete">🗑️</button>
        </div>
      `;

      songList.appendChild(li);
    });
  }

  // Escape helpers
  function escapeHtml(s) {
    if (!s && s !== 0) return '';
    return String(s).replace(/[&<>"']/g, function (m) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m];
    });
  }
  function escapeAttr(s) {
    return escapeHtml(s);
  }

  // Artwork preview handling
  artworkFileInput.addEventListener('change', () => {
    const file = artworkFileInput.files[0];
    if (!file) {
      artworkPreview.innerHTML = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      artworkPreview.innerHTML = `<img src="${reader.result}" alt="Artwork preview" style="max-width:120px; max-height:120px;">`;
    };
    reader.readAsDataURL(file);
  });

  // Add button
  addBtn.addEventListener('click', () => {
    showForm();
  });

  // Cancel
  cancelBtn.addEventListener('click', (e) => {
    e.preventDefault();
    hideForm();
  });

  // Folder tab click (delegated)
  folderTabs.addEventListener('click', (e) => {
    const btn = e.target.closest('button.folder-tab');
    if (!btn) return;
    folderTabs.querySelectorAll('.folder-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const folder = btn.dataset.folder || '';
    renderSongs(searchBar.value, folder);
  });

  // Search input
  searchBar.addEventListener('input', () => {
    // Keep folder filter active if any
    const active = folderTabs.querySelector('.folder-tab.active');
    const folder = active ? active.dataset.folder : '';
    renderSongs(searchBar.value, folder);
  });

  // Song list action handling (edit/delete) - delegation
  songList.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const card = e.target.closest('.song-card');
    if (!card) return;
    const id = card.dataset.id;
    const action = btn.dataset.action;
    if (action === 'edit') {
      startEditSong(id);
    } else if (action === 'delete') {
      deleteSong(id);
    }
  });

  // Form submit (create or update)
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = form.querySelector('#title').value.trim();
    const artist = form.querySelector('#artist').value.trim();
    const folder = form.querySelector('#folder').value.trim() || 'Unsorted';
    const genre = form.querySelector('#genre').value.trim();
    const tagsRaw = form.querySelector('#tags').value.trim();
    const tags = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : [];
    const audioFile = audioFileInput.files[0];
    const audioUrlManual = audioUrlInput.value.trim();
    const artworkFile = artworkFileInput.files[0];

    if (!title || !artist || !folder) {
      alert('Please fill required fields: title, artist, folder.');
      return;
    }

    // Determine audio source
    let audioUrl = '';
    try {
      if (audioFile) {
        // Upload audio file to backend -> B2
        app.classList.add('loading');
        audioUrl = await uploadFileAndReturnUrl(audioFile);
      } else if (audioUrlManual) {
        audioUrl = audioUrlManual;
      } else {
        alert('Please provide an audio file or an audio URL.');
        return;
      }

      // Upload artwork if present
      let artworkUrl = '';
      if (artworkFile) {
        artworkUrl = await uploadFileAndReturnUrl(artworkFile);
      }

      if (editingId) {
        // Update existing
        const idx = songs.findIndex(s => s.id === editingId);
        if (idx !== -1) {
          songs[idx] = {
            ...songs[idx],
            title, artist, folder, genre, tags, audioUrl, artworkUrl: artworkUrl || songs[idx].artworkUrl
          };
        }
      } else {
        // Create new
        const newSong = {
          id: uid(),
          title, artist, folder, genre, tags, audioUrl, artworkUrl
        };
        songs.push(newSong);
      }

      renderFolderTabs();
      renderSongs(searchBar.value);
      hideForm();
    } catch (err) {
      console.error('Upload or save failed', err);
      alert('Upload failed. Check console for details.');
    } finally {
      app.classList.remove('loading');
    }
  });

  // Helper: upload via frontend helper (b2.js) and return URL
  async function uploadFileAndReturnUrl(file) {
    // uploadToB2 handles network calls to backend which talks to B2
    const result = await uploadToB2(file);
    if (!result || !result.url) throw new Error('Invalid upload response');
    return result.url;
  }

  // Start edit flow
  function startEditSong(id) {
    const song = songs.find(s => s.id === id);
    if (!song) return;
    editingId = id;
    app.querySelector('#form-title').textContent = 'Edit Track';
    form.querySelector('#title').value = song.title || '';
    form.querySelector('#artist').value = song.artist || '';
    form.querySelector('#folder').value = song.folder || '';
    form.querySelector('#genre').value = song.genre || '';
    form.querySelector('#tags').value = (song.tags || []).join(', ');
    form.querySelector('#audio-url').value = song.audioUrl || '';
    artworkPreview.innerHTML = song.artworkUrl ? `<img src="${song.artworkUrl}" style="max-width:120px;">` : '';
    formContainer.classList.remove('hidden');
  }

  // Delete song
  function deleteSong(id) {
    if (!confirm('Delete this song?')) return;
    songs = songs.filter(s => s.id !== id);
    renderFolderTabs();
    renderSongs(searchBar.value);
  }

  // Initial render
  renderFolderTabs();
  renderSongs();

  // Expose small debug API on app element for quick inspection (non-global)
  app.__music = {
    getSongs: () => songs,
    setSongs: (arr) => { songs = Array.isArray(arr) ? arr : songs; renderFolderTabs(); renderSongs(); }
  };
}
