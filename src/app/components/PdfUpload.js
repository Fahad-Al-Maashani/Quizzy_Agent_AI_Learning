"use client";

import { useState } from 'react';

/**
 * PdfUpload renders a file input that lets the user choose a PDF. When
 * submitted it sends the file via multipart/form-data to the upload API.
 */
export default function PdfUpload({ onDone }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    setStatus('Uploading…');
    try {
      let res = await fetch('/api/upload', { method: 'POST', body: fd });
      if (res.status === 404) {
        // some hosts require a trailing slash to match the route
        res = await fetch('/api/upload/', { method: 'POST', body: fd });
      }
      if (res.ok) {
        setStatus('Imported ✅');
        setFile(null);
        onDone && onDone();
      } else {
        const data = await res.json().catch(() => ({}));
        setStatus(data.error || 'Failed to import ❌');
      }
    } catch (err) {
      console.error(err);
      setStatus('Upload failed ❌');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" accept="application/pdf" onChange={e => setFile(e.target.files?.[0] || null)} />
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
      <button type="submit" disabled={!file}>Import PDF</button>
      <span className="muted">{status}</span>
      </div>
    </form>
  );
}