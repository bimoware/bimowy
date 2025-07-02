import { NoteBuilder } from "@/lib/resources";

export default new NoteBuilder({
	id: "trigonometry",
	descs: {
		en: "An interactive trigonometry note letting you explore angles on the unit circle, instantly see their sine and cosine values, and access a reference table for the most important angles and formulas.",
		fr: "Une note interactive de trigonométrie pour explorer les angles sur le cercle, voir leurs valeurs de sinus et cosinus en temps réel, et consulter un tableau des valeurs et formules essentielles."
	},
	names: {
		en: "Trigonometry",
		fr: "Trigonometrie"
	},
	content: [
		{
			names: { en: "Trigonometric Circle", fr: "Cercle trigonometrique" },
			type: "widget",
			id: "TrigonometricCircle"
		},
		{
			names: { en: "Trigonometric Table", fr: "Tableau trigonometrique" },
			type: "widget",
			id: "TrigonometricTable"
		},
		{
			type: "text",
			texts: [
				"sin(θ) = $\\frac{opposite}{hypotenuse}$",
				"csc(θ) = $\\frac{hypotenuse}{opposite}$",
				"cos(θ) = $\\frac{adjacent}{hypotenuse}$",
				"sec(θ) = $\\frac{hypotenuse}{adjacent}$",
				"tan(θ) = $\\frac{opposite}{adjacent}$",
				"cot(θ) = $\\frac{adjacent}{opposite}$"
			]
		}
	]
})