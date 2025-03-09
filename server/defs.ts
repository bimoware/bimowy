export enum ExercicePartType {
  Text = 0,
  Input = 1
}

export enum RessourceType {
  Exercice = 0,
  Lesson = 1
}

export type exercicePart =
  | { type: ExercicePartType.Input }
  | {
      type: ExercicePartType.Text
      text: string
    }

export type Exercice = {
  exerciceID: string
  getAnswer: (inputs: number[]) => string
  generateInputs: () => number[]
  getExerciceParts: (inputs: number[]) => exercicePart[]
}

export function idToName(id: string) {
  return id
    .split(' ')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')
}

export class Ressource {
  constructor(
    public type: RessourceType,
    public ressourceID: string,
    public name: string | null,
    public description: string
  ) {}
  toJSON() {
    return {
      type: this.type,
      ressourceID: this.ressourceID,
      name: this.name,
      description: this.description
    }
  }
}

type ExerciceParams = {
  id: string
  desc: string
  getAnswer: (inputs: number[]) => string
  generateInputs: (difficulty?: Difficulty) => number[]
  getExerciceParts: (inputs: number[]) => { type: ExercicePartType; text?: string }[]
}

class ExerciceResource {
  constructor(
    public id: string,
    public category: string | null,
    public desc: string,
    public getAnswer: (inputs: number[]) => string,
    public generateInputs: () => number[],
    public getExerciceParts: (inputs: number[]) => { type: ExercicePartType; text?: string }[]
  ) {}

  generate() {
    const inputs = this.generateInputs(0)

    return {
      exerciceID: exercice.exerciceID,
      seed: questionInputs,
      parts: exercice.getExerciceParts(questionInputs)
    }
  }
  validateAnswer({
    exerciceID,
    inputs,
    answer
  }: {
    exerciceID: string
    inputs: number[]
    answer: string
  }) {
    const exercice = this.exercices.find((q) => q.exerciceID === exerciceID)!
    return exercice.getAnswer(inputs) == answer
  }
}

export class LessonRessource extends Ressource {
  constructor(
    public ressourceID: string,
    public name: string | null,
    public description: string,
    public content: string
  ) {
    super(RessourceType.Exercice, ressourceID, name, description)
    this.name = this.name || idToName(this.ressourceID)
  }
}
