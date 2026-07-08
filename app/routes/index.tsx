import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "~/contexts/auth";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const { authEnabled, status } = useAuth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          TanStack Starter
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Production-ready TanStack Start frontend with SSR, streaming, and graceful
          degradation.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          {authEnabled && status === "unauthenticated" ? (
            <>
              <a
                href="/login"
                className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
              >
                Sign in
              </a>
              <a
                href="/signup"
                className="rounded-lg bg-white px-6 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                Sign up
              </a>
            </>
          ) : authEnabled && status === "authenticated" ? (
            <a
              href="/dashboard"
              className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
              Dashboard
            </a>
          ) : (
            <p className="text-sm text-gray-500">
              Auth is disabled &mdash; sign in and sign up are unavailable.
            </p>
          )}
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-gray-200 bg-white p-6 text-left shadow-sm"
            >
              <h3 className="font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

const features = [
  {
    title: "SSR + Streaming",
    desc: "TanStack Start with server-side rendering and React streaming.",
  },
  {
    title: "Type-Safe API",
    desc: "Typed API client with Zod validation and graceful degradation.",
  },
  {
    title: "Auth Ready",
    desc: "Auth context with stubs — wire to better-auth backend in minutes.",
  },
];
