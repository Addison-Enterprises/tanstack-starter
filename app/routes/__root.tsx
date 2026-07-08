import { Outlet, createRootRoute } from "@tanstack/react-router";
import "~/styles/global.css";

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFound,
});

function RootLayout() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 antialiased">
      <Outlet />
    </div>
  );
}

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">404</h1>
      <p className="mt-2 text-gray-600">Page not found</p>
      <a href="/" className="mt-4 text-indigo-600 hover:underline">
        Go home
      </a>
    </div>
  );
}
