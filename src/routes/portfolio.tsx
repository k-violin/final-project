import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/portfolio")({
  ssr: false,
  component: () => <Outlet />,
});
