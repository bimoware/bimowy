export enum ExercicePartType {
  Text = 0,
  Input = 1
}

export type exercicePart =
  | {
      type: ExercicePartType.Text
      text: string
    }
  | { type: ExercicePartType.Input }

export class ExerciceResource {
  constructor(
    public id: string,
    public name: string | null,
    public desc: string,
    public validateAnswers: (inputs: number[], answers: string[]) => boolean[],
    public generateInputs: () => number[],
    public getExerciceParts: (inputs: number[]) => exercicePart[]
  ) {
    this.name = this.name || idToName(this.id)
  }

  generate() {
    const inputs = this.generateInputs()
    return {
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
