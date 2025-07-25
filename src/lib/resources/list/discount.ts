import { toRounded } from "@/lib/extra"
import { ExerciseBuilder, ExerciseOption, OptionType, randomFromInterval } from "@/lib/resources"

type Seed = [price: number, discount: number]
type Answers = { finalPrice: number }

const options = {
	"priceInterval": new ExerciseOption({
		type: OptionType.Interval,
		title: {
			en: "Price range",
			fr: "Intervalle de prix"
		},
		defaultValue: [10, 100]
	}),
	"discountInterval": new ExerciseOption({
		type: OptionType.Interval,
		title: {
			en: "Discount percentage range",
			fr: "Intervalle du pourcentage de remise"
		},
		defaultValue: [5, 50]
	})
}

export default new ExerciseBuilder<
	Seed,
	Answers,
	typeof options
>({
	id: "discount",
	names: { en: "Discount", fr: "Reduction" },
	descs: {
		en: "Calculate the final price after applying a discount.",
		fr: "Calculer le prix final aprés une reduc"
	},
	tags: ["arithmetic", "conversion"],
	options,
	generateSeed({ priceInterval, discountInterval }) {
		return [
			randomFromInterval(...priceInterval),
			randomFromInterval(...discountInterval)
		]
	},
	generateContent([price, discount], lang) {
		return [
			{
				type: "p",
				content: [
					{
						type: "text",
						text: {
							en: `An item normally costs ${price}$.`,
							fr: `Un objet coûte normallement ${price}$.`
						}[lang]
					}
				]
			},
			{
				type: "p",
				content: [
					{
						type: "text",
						text: {
							en: `Today, it has a ${discount}% discount.`,
							fr: `Mais aujourd'hui, tu remarques une remise de ${discount}%`
						}[lang]
					}
				]
			},
			{
				type: "p",
				content: [
					{
						type: "text",
						text: {
							en: `What is the final price? `,
							fr: `Donc, le prix de l'objet (pour aujourd'hui) est `
						}[lang]
					},
					{ type: "input", id: "finalPrice" }
				]
			}
		]
	},
	generateSolution([price, discount]) {
		const finalPrice = toRounded(price * (1 - discount / 100))
		return {
			finalPrice
		}
	}
})
