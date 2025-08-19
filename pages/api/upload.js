// pages/api/upload.js
import formidable from 'formidable';
import pdf from 'pdf-parse';
import fs from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

export const config = {
  api: { bodyParser: false }, // very important for multipart/form-data
};

const FILE = path.join(process.cwd(), 'data', 'notes.json');

async function readNotes() {
  try {
    return JSON.parse(await fs.readFile(FILE, 'utf8'));
  } catch {
    return [];
  }
}

async function writeNotes(notes) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(notes, null, 2), 'utf8');
}

export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({ ok: true, route: '/api/upload (pages)' });
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    try {
      if (err) return res.status(400).json({ error: 'form parse failed' });

      // Normalize: formidable v3 may return a single object or an array
      const f = files.file;
      const uploaded = Array.isArray(f) ? f[0] : f;

      // v3 uses `filepath`; older used `path`. Handle both.
      const filePath = uploaded?.filepath || uploaded?.path;
      if (!filePath) return res.status(400).json({ error: 'file missing' });

      const buf = await fs.readFile(filePath);
      const data = await pdf(buf);
      const text = data?.text || '';

      const paras = text
        .split(/\n\s*\n+/)
        .map(s => s.replace(/\s+/g, ' ').trim())
        .filter(s => s.length >= 20)
        .slice(0, 200);

      const now = new Date().toISOString();
      const newNotes = paras.map(p => ({
        id: randomUUID(),
        date: now,
        text: p,
        source: 'pdf',
      }));

      const notes = await readNotes();
      notes.push(...newNotes);
      await writeNotes(notes);

      return res.status(200).json({ imported: newNotes.length });
    } catch (e) {
      console.error('upload error:', e);
      return res.status(500).json({ error: 'pdf parse failed', details: String(e) });
    }
  });
}
