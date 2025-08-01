import { generateMetadataUtil } from "@cpn/sidebars/main"
import InteractivePlane from "@cpn/math/plane/InteractivePlane"

export function generateMetadata() {
	return generateMetadataUtil("test")
}

export default function TestPage() {
	return <section className="w-full h-full">
		<InteractivePlane />
	</section>
}