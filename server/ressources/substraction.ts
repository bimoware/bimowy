import { Difficulty, ExercicePartType, ExerciceGroupRessource } from '../defs'

const getAnswer = ([n1, n2]: number[]) => String(n1 - n2)

export default new ExerciceGroupRessource(
  'substraction',
  null,
  'Removing a number from another number',
  {
    getAnswer,
    generateInputs: (difficulty?: Difficulty) => {
      const difficultyRanges = {
        0: [1, 10],
        1: [10, 1e2],
        2: [1e2, 1e3],
        3: [1e5, 1e10]
      }
      const range = difficultyRanges[difficulty || 0]
      const [n1, n2] = [range, range].map(
        (r) => Math.floor(Math.random() * (r[1] - r[0])) + r[0]
      )
      return [n1, n2]
    },
    getExerciceParts: (inputs: number[]) => {
      const [n1, n2] = inputs
      return [
        {
          type: ExercicePartType.Text,
          text: n1 + ' - ' + n2 + ' = '
        },
        {
          type: ExercicePartType.Input
        }
      ]
    }
  }
)
