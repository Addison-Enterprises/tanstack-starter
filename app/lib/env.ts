import { z } from "zod";

const envSchema = z.object({
  VITE_API_URL: z.url().default("http://localhost:3000"),
  VITE_BETTER_AUTH_URL: z.url().default("http://localhost:3000"),
  VITE_API_TIMEOUT_MS: z.coerce.number().positive().default(10000),
  VITE_AUTH_ENABLED: z
    .enum(["true", "false"])
    .default("false")
    .transform((v) => v === "true"),
  VITE_ENABLE_ANALYTICS: z
    .enum(["true", "false"])
    .default("false")
    .transform((v) => v === "true"),
  VITE_SENTRY_DSN: z.url().optional(),
  VITE_POSTHOG_KEY: z.string().optional(),
  VITE_GOOGLE_CLIENT_ID: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

function parseEnv(): Env {
  const raw = {
    VITE_API_URL: import.meta.env.VITE_API_URL,
    VITE_BETTER_AUTH_URL: import.meta.env.VITE_BETTER_AUTH_URL,
    VITE_API_TIMEOUT_MS: import.meta.env.VITE_API_TIMEOUT_MS,
    VITE_AUTH_ENABLED: import.meta.env.VITE_AUTH_ENABLED,
    VITE_ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS,
    VITE_SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
    VITE_POSTHOG_KEY: import.meta.env.VITE_POSTHOG_KEY,
    VITE_GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  };

  const result = envSchema.safeParse(raw);
  if (!result.success) {
    console.error("[env] Invalid environment variables:", z.treeifyError(result.error));
    return envSchema.parse({});
  }
  return result.data;
}

export const env = parseEnv();
