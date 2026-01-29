export const sanitizeContent = (content: string) =>
  content
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

export const isSpamContent = (content: string) => {
  const lower = content.toLowerCase();
  const links = (lower.match(/https?:\/\//g) ?? []).length;
  return links > 3 || lower.includes('free money');
};

const rateMap = new Map<string, number[]>();

export const rateLimit = (key: string, limit: number, windowMs: number) => {
  const now = Date.now();
  const windowStart = now - windowMs;
  const history = (rateMap.get(key) ?? []).filter((time) => time > windowStart);
  if (history.length >= limit) {
    return false;
  }
  history.push(now);
  rateMap.set(key, history);
  return true;
};
