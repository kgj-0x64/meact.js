/**
 * Returns the current location object, which represents the current URL in web browsers.
 */

export function useLocation() {
  return window.location;
}

export function useCurrentPathname(): string {
  const loc = useLocation();

  return loc.pathname;
}
