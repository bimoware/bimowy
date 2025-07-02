import { CourseBuilder } from "@/lib/resources";

export default new CourseBuilder({
	id: "intro-plane",
	tags: ["plane", "vectors"],
	beta: true,
	names: {
		en: "Intro to 2D planes",
		fr: "Intro au plan 2D"
	},
	getContent() {
		return [
			// {
			// 	id: "points",
			// 	type: "folder",
			// 	name: {
			// 		en: "Introduction to the 2D plane",
			// 		fr: "Introduction au plan 2D"
			// 	}[lang],
			// 	content: []
			// }
		]
	}
})