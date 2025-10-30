export async function uploadToB2(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('http://localhost:3000/upload', {
    method: 'POST',
    body: formData
  });

  const data = await response.json();
  return data.url;
}
