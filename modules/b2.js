export async function uploadToB2(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('https://your-backend.com/upload', {
    method: 'POST',
    body: formData
  });

  const data = await response.json();
  return data.url; // Public URL of uploaded file
}
