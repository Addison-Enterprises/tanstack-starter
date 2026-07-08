import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { api } from "~/lib/api-client";

export const Route = createFileRoute("/verify-email")({
  component: VerifyEmailPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      token: typeof search.token === "string" ? search.token : "",
    };
  },
});

function VerifyEmailPage() {
  const { token } = Route.useSearch();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMessage("Missing verification token.");
      return;
    }

    void verifyToken();
  }, [token]);

  const verifyToken = async () => {
    try {
      await api.get(`/api/auth/verify-email?token=${encodeURIComponent(token)}`);
      setStatus("success");
    } catch (err: unknown) {
      setStatus("error");
      const message = err instanceof Error ? err.message : "Failed to verify email";
      if (message.includes("404") || message.includes("expired")) {
        setErrorMessage(
          "This verification link is invalid or has expired. Please request a new one."
        );
      } else {
        setErrorMessage(message);
      }
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        {status === "loading" ? (
          <div className="space-y-4">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600" />
            <h1 className="text-xl font-bold tracking-tight">Verifying your email</h1>
            <p className="text-sm text-gray-500">This should only take a moment...</p>
          </div>
        ) : status === "success" ? (
          <div className="space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-8 w-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight">Email verified!</h1>
            <p className="text-sm text-gray-500">
              Your email has been verified. You can now sign in to your account.
            </p>
            <a
              href="/login"
              className="inline-block rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
              Continue to sign in
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-8 w-8 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight">Verification failed</h1>
            <p className="text-sm text-gray-500">{errorMessage}</p>
            <a
              href="/signup"
              className="inline-block rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
              Back to sign up
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
