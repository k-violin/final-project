import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/blog")({
  ssr: false,
  validateSearch: (search: Record<string, unknown>): { item?: string } => ({
    item: typeof search["item"] === "string" ? search["item"] : undefined,
  }),
  component: () => <Outlet />,
});
