export const SITE = {
  title: 'the-blog',
  description: 'Long-form writing by a team that writes together.',
  lang: 'en',
  repo: 'https://github.com/oykucann/the-blog',
};

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Prefix an internal path with the site's base path. */
export function url(path = '/'): string {
  const clean = path.replace(/^\/+/, '');
  return `${base}/${clean}`;
}

const dateFormat = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

export function formatDate(date: Date): string {
  return dateFormat.format(date);
}

/** Rough reading time for a Markdown/MDX body, ignoring code fences and import lines. */
export function readingTime(body = ''): number {
  const text = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/^import .*$/gm, ' ')
    .replace(/<[^>]+>/g, ' ');
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 230));
}
