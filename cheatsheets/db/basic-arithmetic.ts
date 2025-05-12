import { CheatSheetBuilder } from "../defs"

export default new CheatSheetBuilder("basic-arithmetic")
	.setBeta(true)
	.setTags(["+", "-", "*", "/", "**", "%", "PEMDAS"])
	.setName({
		en: "Basic arithmetic",
		fr: "Arithmétique élémentaire"
	})
	.setDesc({
		en: "Definitions and priority rules of basic operators including addition, subtraction, multiplication, division, exponentiation, and modulo. Order of operations (PEMDAS/BODMAS) with example breakdowns. Absolute value, floor, ceiling, and rounding functions with number line visualizations. Factorials and square roots. Number classification (integer, rational, irrational). Handling negative numbers in operations. Visual examples of nested operations, decimal operations, and integer division.",
		fr: ""
	})