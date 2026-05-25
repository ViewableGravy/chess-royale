import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/match")({
	component: RouteComponent,
});

function RouteComponent() {
	return <Outlet />;
}
