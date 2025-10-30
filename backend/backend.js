const express = require('express');
const multer = require('multer');
const crypto = require('crypto');
const axios = require('axios');
const app = express();
const upload = multer();

const KEY_ID = '006f75089442ae10000000001';
const APP_KEY = 'K006n6bV6vzrmXGoPQgjw/K2w1ebv40';
const BUCKET_ID = 'your-bucket-id';
const BUCKET_NAME = 'your-bucket-name';

let authData = null;

async function authorizeB2() {
  const encoded = Buffer.from(`${KEY_ID}:${APP_KEY}`).toString('base64');
  const res = await axios.get('https://api.backblazeb2.com/b2api/v2/b2_authorize_account', {
    headers: { Authorization: `Basic ${encoded}` }
  });
  authData = res.data;
}

async function getUploadUrl() {
  const res = await axios.post(`${authData.apiUrl}/b2api/v2/b2_get_upload_url`, {
    bucketId: BUCKET_ID
  }, {
    headers: { Authorization: authData.authorizationToken }
  });
  return res.data;
}

app.post('/upload', upload.single('file'), async (req, res) => {
  if (!authData) await authorizeB2();
  const uploadData = await getUploadUrl();

  const sha1 = crypto.createHash('sha1').update(req.file.buffer).digest('hex');
  const fileName = `${Date.now()}-${req.file.originalname}`;

  const uploadRes = await axios.post(uploadData.uploadUrl, req.file.buffer, {
    headers: {
      Authorization: uploadData.authorizationToken,
      'X-Bz-File-Name': fileName,
      'Content-Type': req.file.mimetype,
      'X-Bz-Content-Sha1': sha1
    }
  });

  const publicUrl = `https://f000.backblazeb2.com/file/${BUCKET_NAME}/${fileName}`;
  res.json({ url: publicUrl });
});

app.listen(3000, () => console.log('Backend running on port 3000'));
