export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

const FILE = path.join(process.cwd(), 'data', 'notes.json');

async function readNotes() {
  try {
    const data = await fs.readFile(FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeNotes(notes) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(notes, null, 2), 'utf8');
}

export async function GET() {
  const notes = await readNotes();
  return NextResponse.json({ notes });
}

export async function POST(request) {
  const { text } = await request.json();
  const notes = await readNotes();
  const note = {
    id: randomUUID(),
    date: new Date().toISOString(),
    text: String(text || '').slice(0, 2000),
    source: 'manual',
  };
  notes.push(note);
  await writeNotes(notes);
  return NextResponse.json({ ok: true, note });
}