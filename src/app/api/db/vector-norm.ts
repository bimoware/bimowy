import { ExerciseGenerator, LanguageCode } from '../defs'

const ex = new ExerciseGenerator({
  id: 'from-points-to-vector',
  name: {
    en: 'Points to vector',
    fr: 'Points à vecteur'
  },
  desc: {
    en: 'Convert 2 points into a vector',
    fr: 'Convertir 2 points en un vecteur'
  },
  tags: ['linear-algebra'],
  createdOn: 4,
  recent: true,
  generateSeed: function () {
    const range = [-9, 9]
    const [x1, y1, x2, y2] = Array(4)
      .fill(range)
      .map(
        (r) =>
          Math.floor(Math.random() * (r[1] - r[0])) + r[0]
      )
    return [x1, y1, x2, y2]
  },
  getContext: function (
    [x1, y1, x2, y2]: number[],
    lang: LanguageCode
  ) {
    return [
      {
        type: 'p',
        content: [
          {
            type: 'text',
            text: {
              en: 'The vector that goes from',
              fr: 'Le vecteur qui commence de'
            }[lang]
          },
          {
            type: 'mono',
            text: `A(${x1},${y1})`
          },
          {
            type: 'text',
            text: { en: 'to', fr: 'à' }[lang]
          },
          {
            type: 'mono',
            text: `B(${x2},${y2})`
          },
          {
            type: 'text',
            text: { en: 'is:', fr: 'est:' }[lang]
          }
        ]
      },
      {
        type: 'p',
        content: [
          {
            type: 'latex',
            text: '\\overrightarrow{AB}'
          },
          {
            type: 'mono',
            text: '= <'
          },
          {
            type: 'input',
            id: 'vectorx'
          },
          {
            type: 'mono',
            text: ','
          },
          {
            type: 'input',
            id: 'vectory'
          },
          {
            type: 'mono',
            text: '>'
          }
        ]
      }
    ]
  },
  validateAnswers: function (
    seed: number[],
    [coor1, coor2]: {
      id: string
      value: string
    }[]
  ) {
    const [x, y] = this.getSolution(seed)
    return [
      {
        id: coor1.id,
        is_correct: x.toString() == coor1.value
      },
      {
        id: coor2.id,
        is_correct: y.toString() == coor2.value
      }
    ]
  },
  getSolution: function ([x1, y1, x2, y2]: number[]) {
    return [x2 - x1, y2 - y1]
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
