import { ExerciseBuilder } from "@api/lib/exercise"
import { toRounded } from "@api/lib/misc"
import { IntervalOption } from "@api/lib/option"
import { randomFromInterval } from "@util/random"

type Seed = [price: number, discount: number]
type Answers = { finalPrice: number }

const options = {
	"priceInterval": new IntervalOption({
		title: {
			en: "Price range",
			fr: "Intervalle de prix"
		},
		defaultValue: [10, 100]
	}),
	"discountInterval": new IntervalOption({
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
	names: "Discount",
	descs: "Calculate the final price after applying a discount.",
	tags: ["arithmetic", "conversion"],
	options,
	generateSeed({ priceInterval, discountInterval }) {
		return [
			randomFromInterval(...priceInterval),
			randomFromInterval(...discountInterval)
		]
	},
	generateContext([price, discount], lang) {
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
