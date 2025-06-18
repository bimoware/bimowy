import { CheatSheetBuilder } from "../defs"

export default new CheatSheetBuilder("trigonometry")
	.setDesc({
		en: "Definitions of all six trigonometric functions using right-angled triangle ratios and unit circle coordinates. Radian and degree conversion formulas with circle diagrams. Interactive unit circle labeling function values at key angles (0, π/6, π/4, π/3, π/2, etc). Derivatives and antiderivatives of each function. Complete list of Pythagorean, reciprocal, quotient, and cofunction identities. Graph shapes, periods, asymptote positions, amplitude changes, and horizontal/vertical shifts. Application of trigonometry in real-world angle and distance problems, including inverse trig functions and their domains/ranges.",
		fr: "Liste de toutes les formules, visualizations, derivées & anti-derivées mentionning les fonctions & concepts trigonometriques."
	})
	.setName({
		en: "Trigonometry",
		fr: "Trigonometrie"
	})
	.setContent([
		{
			title: { en: "Trigonometric Circle", fr: "Cercle trigonometrique" },
			type: "widget",
			id: "TrigonometricCircle"
		},
		{
			title: { en: "Trigonometric Table", fr: "Tableau trigonometrique" },
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
	])
	.setTodo([
		{
			en: 'Add levels of complexity (Basic, Medium, Advanced, Full), for now it\'s always really complicated.',
			fr: 'Ajouter des niveaux de complexité (Basique, Moyen, Avancé, Extreme)'
		},
		{
			en: 'Make different blocs being usable in different cheat sheets (i.e trigonometric derivates can be used in derivatives cheat sheet).',
			fr: "Faire que differents blocs peuvent être réutilisables dans differentes cheat sheets (genre les dérivées trigonometriques peuvent étre réutilisables dans le cheat sheet des dérivées ou des primitives)"
		}
	])