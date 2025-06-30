import { CourseBuilder } from "@api/lib/course";

export default new CourseBuilder({
	id: "intro-plane",
	tags: ["plane", "vectors"],
	beta: true,
	names: {
		en: "Intro to 2D planes",
		fr: "Intro au plan 2D"
	},
})