import { ExercicePartType, ExerciceRessource } from '../defs'

export default new ExerciceRessource(
  'addition',
  null,
  'Taking the sum of multiple numbers',
  getAnswer,
  generateInputs,
  getExerciceParts
)

function getAnswer([n1, n2]: number[]) {
  return String(n1 + n2)
}

function generateInputs() {
  const range = [1, 10]
  const [n1, n2] = [range, range].map((r) => Math.floor(Math.random() * (r[1] - r[0])) + r[0])
  return [n1, n2]
}

function getExerciceParts(inputs: number[]) {
  const [n1, n2] = inputs
  return [
    {
      type: ExercicePartType.Text,
      text: n1 + ' + ' + n2 + ' = '
    },
    {
      type: ExercicePartType.Input
    }
  ]
}
