import { CheatSheetBuilder } from "../defs"

export default new CheatSheetBuilder("trigonometry")
	.setBeta(true)
	.setTags(["sin", "cos", "tan", "cot", "sec", "csc", "θ", "π", "radian", "degree", "unit circle", "identity", "asymptote", "hypotenuse", "opposite", "adjacent", "Pythagoras"])
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
			type: 'bloc',
			content: [
				{
					type: "text",
					text: "sin²(x) + cos²(x) = 1"
				}
			]
		}
	])