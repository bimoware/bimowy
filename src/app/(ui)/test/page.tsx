import { generateMetadataUtil } from "@cpn/sidebars/main"
import InteractivePLane from "@cpn/math/InteractivePlane"

export function generateMetadata() {
	return generateMetadataUtil("test")
}

export default function TestPage() {
	return <InteractivePLane />
}