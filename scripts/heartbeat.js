/**
 * heartbeat.js
 *
 * This script writes a timestamp to `data/streak.log`. It is intended to be
 * executed by a scheduled CI workflow (e.g. daily) to ensure that there is
 * always at least one modified file each day. Combined with the commit
 * workflow, this allows the GitHub contribution graph to reflect daily
 * activity like a habit tracker. The log file grows by one line per run.
 */

import fs from 'fs/promises';
import path from 'path';

async function heartbeat() {
  const file = path.join(process.cwd(), 'data', 'streak.log');
  const timestamp = new Date().toISOString();
  await fs.mkdir(path.dirname(file), { recursive: true });
  // Append the timestamp with a newline. The { flag: 'a' } option ensures
  // that the file is created if it does not exist.
  await fs.writeFile(file, timestamp + '\n', { flag: 'a' });
  console.log(`Heartbeat written at ${timestamp}`);
}

heartbeat().catch(err => {
  console.error(err);
  process.exit(1);
});