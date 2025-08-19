"use client";

/**
 * NotesList displays saved learning notes. It sorts notes from newest to oldest
 * and shows the date and source for each entry.
 */
export default function NotesList({ notes = [] }) {
  const sorted = [...notes].sort((a, b) => new Date(b.date) - new Date(a.date));
  return (
    <div className="notes-list">
      {sorted.map((note, idx) => {
        const date = new Date(note.date);
        return (
          <div key={note.id || idx} className="note">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <small>{date.toLocaleString()}</small>
              <small className="muted">{(note.source || 'manual').toUpperCase()}</small>
            </div>
            <div>{note.text}</div>
          </div>
        );
      })}
      {sorted.length === 0 && <div className="muted">No notes yet.</div>}
    </div>
  );
}