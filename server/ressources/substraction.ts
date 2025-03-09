import { Difficulty, ExerciceRessource, QuestionPartType } from '../defs'

const getAnswer = ([n1, n2]: number[]) => String(n1 - n2)

export default new ExerciceRessource(
  'substraction',
  null,
  'Removing a number from another number',
  [
    {
      id: 'basic',
      getAnswer,
      generate: (difficulty: Difficulty) => {
        const difficultyRanges = {
          0: [1, 10],
          1: [10, 1e2],
          2: [1e2, 1e3],
          3: [1e5, 1e10],
        }
        const range = difficultyRanges[difficulty]
        const [n1, n2] = [range, range].map((r) => Math.floor(Math.random() * (r[1] - r[0])) + r[0])
        return [n1, n2]
      },
      format: (inputs: number[]) => {
        const [n1, n2] = inputs
        return [
          {
            type: QuestionPartType.Input,
            title: n1 + ' - ' + n2,
            answer: getAnswer([n1, n2]),
          },
        ]
      },
    },
  ],
)
