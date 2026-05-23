export function readTime(body: string | undefined): string {
  if (!body || !body.trim()) return '5 min';
  const words = body.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min`;
}
