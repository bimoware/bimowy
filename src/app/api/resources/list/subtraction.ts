import { ExerciseBuilder } from "@api/lib/exercise"
import { IntervalOption } from "@api/lib/option"
import { randomFromInterval } from "@util/random"

type Seed = [a: number, b: number]
type Answers = { answer: number }

const options = {
  interval: new IntervalOption({
    title: {
      en: "Interval of values",
      fr: "Intervalle des valeurs"
    },
    defaultValue: [0, 10]
  })
}

export default new ExerciseBuilder<Seed, Answers, typeof options>({
  id: "subtraction",
  names: {
    en: "Subtraction",
    fr: "Soustraction"
  },
  tags: ["arithmetic"],
  descs: "100 - 1 = 99",
  options,

  generateSeed({ interval }) {
    return [
      randomFromInterval(...interval),
      randomFromInterval(...interval)
    ]
  },

  generateContext([n1, n2]) {
    return [
      {
        type: "p",
        content: [
          { type: "text", text: `${n1} - ${n2} = ` },
          { type: "input", id: "answer" }
        ]
      }
    ]
  },

  generateSolution([n1, n2]) {
    return {
      answer: n1 - n2
    }
  }
})
