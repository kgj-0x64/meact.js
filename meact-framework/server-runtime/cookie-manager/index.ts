/**
 * ! Stateless Session Management
 *
 * In a stateless architecture, all the session data should be stored on the client side (usually in a cookie),
 * and the server should not keep any session state between requests.
 * This means there should be no in-memory session store on the server.
 *
 * Instead, session data is:
 * 1. Stored in the Cookie:
 *     The entire session state is stored in a cookie, which is sent back and forth between the client and server with each request.
 * 2. Signed and Encrypted:
 *     To ensure the integrity and confidentiality of the session data,
 *     the cookie is signed (and optionally encrypted) so that it can't be tampered with by the client.
 *
 */

import cookie from "cookie";
import crypto from "crypto";

export enum SessionCookieProperties {
  USER_ID = "userId",
}

const secretKey = process.env.COOKIES_SECRET_KEY || "insecure_example"; // Secret for signing the session data
const cookieName = "__session";
const maxAge = 7 * 24 * 60 * 60; // One week in seconds

// Interface for session data
interface SessionData {
  [key: string]: any;
}

// Interface for the session object returned by getSession
interface Session {
  id?: string;
  data: SessionData;
  isNew: boolean;
}

// Function to sign session data
function sign(data: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(data).digest("hex");
}

// Function to encode session data into a cookie string
function encodeSession(sessionData: SessionData): string {
  const dataString = JSON.stringify(sessionData);
  const signature = sign(dataString, secretKey);
  return `${Buffer.from(dataString).toString("base64")}.${signature}`;
}

// Function to decode session data from a cookie string
function decodeSession(cookieValue: string | undefined): SessionData | null {
  if (!cookieValue) return null;

  const [encodedData, signature] = cookieValue.split(".");

  if (!encodedData || !signature) return null;

  const dataString = Buffer.from(encodedData, "base64").toString("utf8");
  const expectedSignature = sign(dataString, secretKey);

  if (signature !== expectedSignature) {
    // Invalid signature, data may have been tampered with
    return null;
  }

  return JSON.parse(dataString);
}

// Function to retrieve the session from the cookie header
export async function getSession(
  cookieHeader: string | undefined
): Promise<Session> {
  const cookies = cookie.parse(cookieHeader || "");
  const sessionData = decodeSession(cookies[cookieName]);

  return {
    data: sessionData || {}, // Return an empty object if session is not found
    isNew: !sessionData, // True if no session exists
  };
}

// Function to serialize the session data into a cookie header
export async function commitSession(session: Session): Promise<string> {
  const serializedCookie = cookie.serialize(
    cookieName,
    encodeSession(session.data),
    {
      httpOnly: true, // Secure cookie (accessible only by the web server)
      secure: process.env.NODE_ENV === "production", // Send only over HTTPS
      maxAge, // lifetime in milliseconds
      sameSite: "strict", // Strict same-site enforcement
      path: "/",
    }
  );

  return serializedCookie;
}

// Function to destroy the session by clearing the cookie
export async function destroySession(): Promise<string> {
  const serializedCookie = cookie.serialize(cookieName, encodeSession({}), {
    httpOnly: true, // Secure cookie (accessible only by the web server)
    secure: process.env.NODE_ENV === "production", // Send only over HTTPS
    maxAge: 0, // lifetime in milliseconds
    sameSite: "strict", // Strict same-site enforcement
    path: "/",
  });

  return serializedCookie;
}
