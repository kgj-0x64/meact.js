export function getCurrentPathname(): string {
  const loc = window.location;

  return loc.pathname;
}
