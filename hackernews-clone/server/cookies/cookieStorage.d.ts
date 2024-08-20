import type { SessionStorage, SessionIdStorageStrategy } from "./sessions";
interface CookieSessionStorageOptions {
  /**
   * The Cookie used to store the session data on the client, or options used
   * to automatically create one.
   */
  cookie?: SessionIdStorageStrategy["cookie"];
}
/**
 * Creates and returns a SessionStorage object that stores all session data
 * directly in the session cookie itself.
 *
 * This has the advantage that no database or other backend services are
 * needed, and can help to simplify some load-balanced scenarios. However, it
 * also has the limitation that serialized session data may not exceed the
 * browser's maximum cookie size. Trade-offs!
 *
 * @see https://remix.run/api/remix#createcookiesessionstorage
 */
export declare function createCookieSessionStorage({
  cookie: cookieArg,
}?: CookieSessionStorageOptions): SessionStorage;
export {};
