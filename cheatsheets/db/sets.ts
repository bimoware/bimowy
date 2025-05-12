import { CheatSheetBuilder } from "../defs"

export default new CheatSheetBuilder("sets")
	.setBeta(true)
	.setTags(["∈", "∉", "⊂", "⊆", "⊄", "⊇", "∪", "∩", "∅", "U", "complement", "cardinality", "Venn diagram", "power set", "universal set", "difference"])
	.setDesc({
		en: "Definitions and notation for set membership, inclusion, subsets, supersets, equality, and emptiness. Operations including union, intersection, difference, and complement, explained with both roster and rule methods. Cardinality concepts for finite and infinite sets. Venn diagram usage with 2- and 3-set overlaps, shading techniques, and real problem applications. Definition and notation of the universal set within a problem’s context. Power sets with calculation formulas. Set-builder and interval notation with visual number line examples. Applications in logic, probability, and computer science (hash sets, lists, etc).",
		fr: "Liste de toutes les formules, visualizations & applications des ensembles (des nombres)"
	})
	.setName({
		en: "Sets",
		fr: "Ensembles"
	})
