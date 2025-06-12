export function extractKeyFromUrl(url) {
  try {
    const { pathname } = new URL(url);
    return decodeURIComponent(pathname.slice(1));
  } catch {
    return url;
  }
}
