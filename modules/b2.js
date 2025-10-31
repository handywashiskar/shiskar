// modules/b2.js
// Uploads a file to your backend endpoint with progress tracking.
// Exports uploadToB2(file, onProgress) -> returns { url } or throws

export function uploadToB2(file, onProgress) {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error('No file provided to uploadToB2'));

    const formData = new FormData();
    formData.append('file', file, file.name);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/upload');

    // Track upload progress
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && typeof onProgress === 'function') {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        try {
          const data = JSON.parse(xhr.responseText);
          if (!data || !data.url) {
            reject(new Error('Invalid response from upload endpoint'));
          } else {
            resolve(data);
          }
        } catch (err) {
          reject(new Error('Failed to parse upload response'));
        }
      } else {
        reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`));
      }
    };

    xhr.onerror = () => reject(new Error('Network error during upload'));
    xhr.send(formData);
  });
}
