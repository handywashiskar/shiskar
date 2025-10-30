// backend/backend.js
// Simple Express server that authorizes with Backblaze B2 and uploads received files to the specified bucket.
// IMPORTANT: Replace BUCKET_ID and BUCKET_NAME with your values. Replace KEY_ID and APP_KEY placeholders with your credentials (🆔🆔🆔 and 🔐🔐🔐).

const express = require('express');
const multer = require('multer');
const crypto = require('crypto');
const axios = require('axios');

const app = express();
const upload = multer();

const KEY_ID = '🆔🆔🆔';
const APP_KEY = '🔐🔐🔐';
const BUCKET_ID = 'your-bucket-id';   // replace with real bucket id
const BUCKET_NAME = 'your-bucket-name'; // replace with real bucket name

let authData = null;
let authFetchedAt = 0;
const AUTH_TTL_MS = 1000 * 60 * 45; // refresh every 45 minutes (authorize token TTL ~ 24 hours but refreshing is safe)

// Authorize account and store apiUrl + auth token
async function authorizeB2() {
  try {
    const encoded = Buffer.from(`${KEY_ID}:${APP_KEY}`).toString('base64');
    const res = await axios.get('https://api.backblazeb2.com/b2api/v2/b2_authorize_account', {
      headers: { Authorization: `Basic ${encoded}` }
    });
    authData = res.data; // contains apiUrl, authorizationToken, etc.
    authFetchedAt = Date.now();
    return authData;
  } catch (err) {
    console.error('b2 authorize failed', err.response ? err.response.data : err.message);
    throw err;
  }
}

// Ensure we have valid auth data
async function ensureAuth() {
  if (!authData || (Date.now() - authFetchedAt) > AUTH_TTL_MS) {
    await authorizeB2();
  }
}

// Get upload URL for bucket
async function getUploadUrl() {
  await ensureAuth();
  const url = `${authData.apiUrl}/b2api/v2/b2_get_upload_url`;
  try {
    const res = await axios.post(url, { bucketId: BUCKET_ID }, {
      headers: { Authorization: authData.authorizationToken }
    });
    return res.data; // { uploadUrl, authorizationToken }
  } catch (err) {
    console.error('b2 get_upload_url failed', err.response ? err.response.data : err.message);
    throw err;
  }
}

// Endpoint: POST /upload
// Expects multipart form with field 'file'
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Ensure we have upload endpoint
    const uploadData = await getUploadUrl();

    // Compute SHA1 of file buffer
    const sha1 = crypto.createHash('sha1').update(req.file.buffer).digest('hex');

    // Safe filename: timestamp + random + original sanitized name
    const timestamp = Date.now();
    const random = crypto.randomBytes(6).toString('hex');
    const originalName = (req.file.originalname || 'file').replace(/[^a-zA-Z0-9_\-\.]/g, '_');
    const fileName = `${timestamp}-${random}-${originalName}`;

    // Upload to the uploadUrl returned by get_upload_url
    const uploadRes = await axios.post(uploadData.uploadUrl, req.file.buffer, {
      headers: {
        Authorization: uploadData.authorizationToken,
        'X-Bz-File-Name': fileName,
        'Content-Type': req.file.mimetype || 'application/octet-stream',
        'X-Bz-Content-Sha1': sha1
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });

    // Construct public URL for the file (bucket must be public or you must serve via authorized method)
    const publicUrl = `https://f000.backblazeb2.com/file/${BUCKET_NAME}/${encodeURIComponent(fileName)}`;

    return res.json({ url: publicUrl });
  } catch (err) {
    console.error('upload error', err.response ? err.response.data : err.message);
    const status = err.response && err.response.status ? err.response.status : 500;
    const message = err.response && err.response.data ? err.response.data : err.message;
    return res.status(status).json({ error: String(message) });
  }
});

// Simple health endpoint
app.get('/health', (req, res) => res.json({ ok: true }));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`B2 upload backend running on port ${PORT}`));
