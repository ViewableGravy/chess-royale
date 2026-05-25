/// <reference types="vite/client" />

declare module "*.toml?raw" {
	const content: string;
	export default content;
}

declare module "*.json" {
	const content: unknown;
	export default content;
}
