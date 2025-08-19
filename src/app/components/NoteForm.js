"use client";

import { useState } from 'react';

/**
 * NoteForm allows the user to type a quick learning note. Upon submission
 * it posts to the API and triggers the onNoteAdded callback so the parent
 * can refresh its list.
 */
export default function NoteForm({ onNoteAdded }) {
  const [text, setText] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: trimmed }),
      });
      if (res.ok) {
        setText('');
        onNoteAdded && onNoteAdded();
      }
    } catch (err) {
      console.error('Failed to save note', err);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea value={text} onChange={e => setText(e.target.value)} placeholder="What did you learn?" />
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <button type="submit">Add Note</button>
        <span className="muted">Adds to your streak</span>
      </div>
    </form>
  );
}