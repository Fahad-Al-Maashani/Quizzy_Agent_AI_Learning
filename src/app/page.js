"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import PdfUpload from './components/PdfUpload';
import NoteForm from './components/NoteForm';
import NotesList from './components/NotesList';
import Heatmap from './components/Heatmap';
import Quiz from './components/Quiz';

/**
 * The main landing page of the learning journal. It loads notes on mount
 * and passes them to child components. Each card is animated via framer-motion.
 */
export default function Page() {
  const [notes, setNotes] = useState([]);

  async function fetchNotes() {
    try {
      const res = await fetch('/api/notes', { cache: 'no-store' });
      const data = await res.json();
      setNotes(data.notes || []);
    } catch (err) {
      console.error('Failed to fetch notes', err);
    }
  }

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="container">
      <div className="nav">
        <div className="brand">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="1.4"><path d="M12 3l8.5 4.9v7.2L12 20.9 3.5 15.1V7.9L12 3z" /></svg>
          Learning Journal
        </div>
        <div className="muted">PDF → Notes → Quiz → Daily commit</div>
      </div>
      <div className="grid">
        <motion.div className="row row-6 card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <h3>Upload Learning PDF</h3>
          <p className="muted">We extract text and turn it into notes (one per paragraph).</p>
          <PdfUpload onDone={fetchNotes} />
        </motion.div>
        <motion.div className="row row-6 card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.05 }}>
          <h3>Quick Note</h3>
          <NoteForm onNoteAdded={fetchNotes} />
        </motion.div>
        <motion.div className="row card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 }}>
          <h3>Commitment Heatmap</h3>
          <p className="muted">Each day you add a note or upload a PDF contributes to your streak. The CI heartbeat can also log a commit daily.</p>
          <Heatmap notes={notes} />
        </motion.div>
        <motion.div className="row row-6 card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.15 }}>
          <h3>Notes</h3>
          <NotesList notes={notes} />
        </motion.div>
        <motion.div className="row row-6 card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.2 }}>
          <Quiz />
        </motion.div>
      </div>
      <div className="footer muted">Built with Next.js and framer-motion. Data stored locally in <code>data/notes.json</code>.</div>
    </div>
  );
}