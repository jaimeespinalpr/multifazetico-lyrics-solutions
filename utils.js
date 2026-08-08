export function formatTime(seconds, separator = ',') {
  const s = Math.max(0, Number(seconds) || 0);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  const ms = Math.round((s - Math.floor(s)) * 1000);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}${separator}${String(ms).padStart(3, '0')}`;
}

export function sanitizeSegments(segments = []) {
  return segments
    .map((x) => ({
      start: Math.max(0, Number(x.start ?? x.timestamp?.[0]) || 0),
      end: Math.max(0, Number(x.end ?? x.timestamp?.[1]) || 0),
      text: String(x.text || '').trim(),
    }))
    .filter((x) => x.text)
    .map((x, i, all) => ({
      ...x,
      end: x.end > x.start ? x.end : (all[i + 1]?.start || x.start + 3),
    }));
}

export function toTXT(lines) {
  return sanitizeSegments(lines).map((x) => x.text).join('\n');
}

export function toSRT(lines) {
  return sanitizeSegments(lines)
    .map((x, i) => `${i + 1}\n${formatTime(x.start)} --> ${formatTime(x.end)}\n${x.text}`)
    .join('\n\n');
}

export function toLRC(lines) {
  return sanitizeSegments(lines)
    .map((x) => {
      const m = Math.floor(x.start / 60);
      const s = x.start % 60;
      return `[${String(m).padStart(2, '0')}:${s.toFixed(2).padStart(5, '0')}]${x.text}`;
    })
    .join('\n');
}

export function activeIndex(lines, time) {
  const clean = sanitizeSegments(lines);
  let index = clean.findIndex((x) => time >= x.start && time < x.end);
  if (index < 0) index = clean.findLastIndex((x) => time >= x.start);
  return index;
}
