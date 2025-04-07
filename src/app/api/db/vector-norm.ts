import { ExerciseGenerator } from '../defs'

const ex = new ExerciseGenerator({
  id: 'from-points-to-vector',
  name: 'Points to vector',
  desc: 'Convert two points to a vector',
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
  getContext: function ([x1, y1, x2, y2]: number[]) {
    return [
      {
        type: 'p',
        content: [
          {
            type: 'text',
            text: 'The vector that goes from'
          },
          {
            type: 'mono',
            text: `A(${x1},${y1})`
          },
          {
            type: 'text',
            text: 'to'
          },
          {
            type: 'mono',
            text: `B(${x2},${y2})`
          },
          {
            type: 'text',
            text: 'is:'
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
    [x1, y1, x2, y2]: number[],
    [coor1, coor2]: {
      id: string
      value: string
    }[]
  ) {
    return [
      {
        id: coor1.id,
        is_correct: String(x2 - x1) == coor1.value
      },
      {
        id: coor2.id,
        is_correct: String(y2 - y1) == coor2.value
      }
    ]
  }
})

export default ex
