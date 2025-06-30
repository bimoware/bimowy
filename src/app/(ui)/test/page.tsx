import { generateMetadataUtil } from "@/utils/sidebar"
import Plane from "@cpn/math/Plane"

export function generateMetadata() {
	return generateMetadataUtil("test")
}

export default function TestPage() {
	return <div className="p-1
	w-80 aspect-square
	bg-white/5
	rounded-2xl">
		<Plane
			ranges={{
				x: { min: -4, max: 4 },
				y: { min: -4, max: 4 }
			}}
			elems={[
				{
					type: "vector",
					id: "u",
					x1: -3, y1: 0,
					x2: -1, y2: 2
				},
				{
					type: "vector",
					id: "v",
					x1: 2, y1: -4,
					x2: 3, y2: 2
				},
				{
					type: "vector",
					id: "w",
					x1: -2, y1: -2,
					x2: -2, y2: -3
				},
				{
					type: "vector",
					id: "x",
					x1: 0, y1: 0,
					x2: 2, y2: 3
				},
				{
					type: "vector",
					id: "y",
					x1: -1, y1: -1,
					x2: -4, y2: 0
				},
				{
					type: "point",
					id: "A",
					x: 2,
					y: 3
				},
			]}
		/>
	</div>
}