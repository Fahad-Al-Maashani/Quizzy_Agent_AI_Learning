"use client";

/**
 * Heatmap displays a 53×7 grid showing the user's learning activity over
 * the past year. Each cell corresponds to one day. Cells with any activity
 * (notes or PDF imports) are rendered in white, while empty days remain dark.
 */
export default function Heatmap({ notes = [] }) {
  const countByDay = new Map();
  notes.forEach(note => {
    const dateStr = new Date(note.date).toISOString().slice(0, 10);
    countByDay.set(dateStr, (countByDay.get(dateStr) || 0) + 1);
  });
  const days = 371; // roughly 53 weeks
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const columns = [];
  for (let c = 0; c < 53; c++) {
    const col = [];
    for (let r = 0; r < 7; r++) {
      const idx = (52 - c) * 7 + r;
      const d = new Date(today);
      d.setDate(today.getDate() - idx);
      const key = d.toISOString().slice(0, 10);
      const count = countByDay.get(key) || 0;
      const level = count >= 4 ? 4 : count; // 0-4 levels
      col.push({ key, count, level });
    }
    columns.push(col);
  }
  return (
    <div className="heatmap" aria-label="commitment heatmap">
      {columns.map((col, i) => (
        <div className="hm-col" key={i}>
          {col.map(cell => (
            <div
              key={cell.key}
              className="hm-cell"
              data-level={cell.level}
              title={`${cell.key}: ${cell.count} activities`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}