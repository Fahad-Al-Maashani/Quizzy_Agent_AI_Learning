export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const FILE = path.join(process.cwd(), 'data', 'notes.json');

async function readNotes() {
  try {
    return JSON.parse(await fs.readFile(FILE, 'utf8'));
  } catch {
    return [];
  }
}

function pickQuestion(notes) {
  if (!notes || notes.length === 0) return null;
  for (let tries = 0; tries < 30; tries++) {
    const note = notes[Math.floor(Math.random() * notes.length)];
    const words = note.text.split(/[^A-Za-z0-9]+/).filter(w => w.length >= 4);
    if (words.length === 0) continue;
    const answer = words[Math.floor(Math.random() * words.length)];
    const rx = new RegExp(`\\b${answer}\\b`, 'i');
    const question = note.text.replace(rx, '____');
    if (question !== note.text) return { question, answer };
  }
  return null;
}

export async function GET() {
  const notes = await readNotes();
  const qa = pickQuestion(notes);
  return NextResponse.json(qa || {});
}