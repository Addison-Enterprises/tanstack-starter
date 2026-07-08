import { createAuthClient } from "better-auth/react";
import { env } from "~/lib/env";

export const authEnabled = env.VITE_AUTH_ENABLED;

/**
 * better-auth React client.
 *
 * Uses the same server as the API (hono-starter), which handles
 * `/api/auth/*` via `auth.handler()`.  Session state is managed
 * by better-auth's nanostore-backed hooks — no manual localStorage,
 * no custom Provider needed.
 */
export const authClient = createAuthClient({
  baseURL: env.VITE_BETTER_AUTH_URL,
});

export const { useSession, signIn, signOut, signUp } = authClient;
