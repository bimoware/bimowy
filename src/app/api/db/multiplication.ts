import { ExerciseGenerator } from '../defs'

const ex = new ExerciseGenerator({
  id: 'multiplication',
  desc: { en: 'Repeated addition', fr: 'Addition répétée' },
  tags: ['basic-arithmetic'],
  createdOn: 3,
  generateSeed: function () {
    const range = [1, 10]
    const [n1, n2] = Array(2)
      .fill(range)
      .map(
        (r) =>
          Math.floor(Math.random() * (r[1] - r[0])) + r[0]
      )
    return [n1, n2]
  },
  getContext: function ([n1, n2]: number[]) {
    return [
      {
        type: 'p',
        content: [
          {
            type: 'text',
            text: `${n1} * ${n2} = `
          },
          {
            type: 'input',
            id: 'answer'
          }
        ]
      }
    ]
  },
  validateAnswers: function (
    [n1, n2]: number[],
    [answer1]: {
      id: string
      value: string
    }[]
  ) {
    return [
      {
        id: answer1.id,
        is_correct:
          answer1.value == this.getSolution([n1,n2]).toString()
      }
    ]
  },
  getSolution: function (seed: number[]) {
    return [seed[0] * seed[1]]
  },
  getDetailedSolution: function (seed: number[]) {
    return [
      {
        type: 'p',
        content: [
          {
            type: 'text',
            text: '[Solution Here]'
          }
        ]
      }
    ]
  }
})

export default ex
