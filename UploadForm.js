import React, { useState } from 'react';
import axios from 'axios';

function UploadForm() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:4000/upload', formData);
      setStatus(res.data.status);
    } catch (err) {
      console.error(err);
      setStatus('Upload failed');
    }
  };

  return (
    <div>
      <h2>Upload Quiz File</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".txt" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
      <p>{status}</p>
    </div>
  );
}

export default UploadForm;
