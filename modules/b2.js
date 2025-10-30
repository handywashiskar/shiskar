// modules/b2.js
// Frontend helper that posts file to your backend endpoint which handles Backblaze B2.
// Exports uploadToB2(file) -> returns { url } or throws

export async function uploadToB2(file) {
  if (!file) throw new Error('No file provided to uploadToB2');

  const formData = new FormData();
  formData.append('file', file, file.name);

  // Replace this with your actual backend upload endpoint
  const UPLOAD_ENDPOINT = '/upload';

  const res = await fetch(UPLOAD_ENDPOINT, {
    method: 'POST',
    body: formData
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Upload failed: ${res.status} ${res.statusText} ${text}`);
  }

  const data = await res.json();
  // Expecting { url: 'https://f000.backblazeb2.com/file/bucket/file.mp3' }
  if (!data || !data.url) throw new Error('Invalid response from upload endpoint');
  return data;
}
