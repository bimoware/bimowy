export enum ExercicePartType {
  Text = 0,
  Input = 1
}

export type exercicePart =
  | {
      type: ExercicePartType.Text
      text: string
    }
  | {
      type: ExercicePartType.Input
      id: string
      value?: string
      correct?: boolean
      correctOnFirstTry?: boolean
    }

export type ExerciceTags =  
| "basic-arithmetic"
| "geometry"
| "trigonometry"
| "algebra"
| "calculus"
| "statistics"
| "probability"
| "multivariable-calculus"



export type Correction = { id: string; correct: boolean }
export class ExerciceResource {
  constructor(
    public id: string,
    public name: string | null,
    public desc: string,
    public tags: ExerciceTags[],
    public validateAnswers: (
      inputs: number[],
      answers: {
        id: string
        value: string
      }[]
    ) => Correction[],
    public generateInputs: () => number[],
    public getExerciceParts: (inputs: number[]) => exercicePart[]
  ) {
    this.name = this.name || idToName(this.id)
  }

  generate() {
    const inputs = this.generateInputs()
    return {
      exercice_id: this.id,
      seed: inputs,
      parts: this.getExerciceParts(inputs)
    }
  }
}

export function idToName(id: string) {
  return id
    .split(' ')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')
}
