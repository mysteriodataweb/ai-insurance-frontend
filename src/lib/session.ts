import type { User } from "@/lib/types";

const TOKEN_KEY = "ai-insurance.token";
const USER_KEY = "ai-insurance.user";

const listeners = new Set<() => void>();
let cachedRaw: string | null = null;
let cachedUser: User | null = null;

function notify() {
  listeners.forEach((listener) => listener());
}

// Storage can be unavailable (private mode, blocked site data): treat that as "signed out".
export function getToken(): string | null {
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

/** Signed-in user, or null. Returns the same object until the session changes (useSyncExternalStore snapshot). */
export function getSessionUser(): User | null {
  let raw: string | null = null;
  try {
    raw = getToken() ? window.localStorage.getItem(USER_KEY) : null;
  } catch {
    raw = null;
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedUser = raw ? (JSON.parse(raw) as User) : null;
    } catch {
      cachedUser = null;
    }
  }
  return cachedUser;
}

/** Subscribes to session changes in this tab and in other tabs. */
export function subscribeSession(listener: () => void): () => void {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

export function saveSession(token: string, user: User) {
  try {
    window.localStorage.setItem(TOKEN_KEY, token);
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch {
    // Without storage the user has to sign in again on the next page load.
  }
  notify();
}

export function clearSession() {
  try {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
  } catch {
    // Nothing stored.
  }
  notify();
}
