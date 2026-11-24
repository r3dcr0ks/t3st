/** Resolve a file from /public so it works both locally and on GitHub Pages. */
export function asset(path: string) {
  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) return path;
  return import.meta.env.BASE_URL + path.replace(/^\//, '');
}
