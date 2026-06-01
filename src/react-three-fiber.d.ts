import type { ThreeElements } from "@react-three/fiber";

declare module "react" {
	namespace JSX {
		interface IntrinsicElements extends ThreeElements {}
	}
}

declare module "three" {
	interface OrthographicCamera {
		/** R3F: skip automatic projection updates on resize */
		manual?: boolean;
	}

	interface PerspectiveCamera {
		manual?: boolean;
	}
}
