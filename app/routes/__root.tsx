import { Outlet, createRootRoute } from "@tanstack/react-router";
import "~/styles/global.css";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 antialiased">
      <Outlet />
    </div>
  );
}
