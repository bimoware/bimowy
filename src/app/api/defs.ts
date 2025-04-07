import fs from 'fs'
import path from 'path'

export type ExerciseInput = { id: string; type: string }
export type Correction = { id: string; is_correct: boolean }
export type ExerciseTags =
  | 'basic-arithmetic'
  | 'geometry'
  | 'trigonometry'
  | 'algebra'
  | 'linear-algebra'
  | 'calculus'
  | 'statistics'
  | 'probability'
  | 'multivariable-calculus'
export type LanguageCode = 'fr' | 'en'
export type GeneratedExercise = {
  exercise_id: string
  seed: number[]
  context: (
    | {
        type: 'p'
        content: GeneratedExercise['context']
      }
    | {
        type: 'text'
        text: string
      }
    | {
        type: 'mono'
        text: string
      }
    | {
        type: 'latex'
        text: string
      }
    | {
        type: 'input'
        id: string
      }
  )[]
}

export class DB {
  public cache: Map<string, ExerciseGenerator>
  constructor() {
    this.cache = new Map<string, ExerciseGenerator>()
  }
  async fetchAll() {
    if (this.cache.size) return this.cache

    const totalPath = path.join(
      process.cwd(),
      '/src/app/api/db'
    )
    const files = fs.readdirSync(totalPath)

    for (let file of files) {
      const module = await import('./db/' + file)
      const exercise = module.default
      console.log(`Loaded exercise: ${exercise.id}`)
      this.cache.set(exercise.id, exercise)
    }
    return this.cache
  }
  async fetch(id: string) {
    if (!this.cache.size) await this.fetchAll()
    return this.cache.get(id)
  }
}

export class ExerciseGenerator {
  public id: string
  public name: { en: string; fr: string }
  public desc: { en: string; fr: string } | null
  public tags: ExerciseTags[]
  public recent: boolean
  public createdOn: number
  public validateAnswers: (
    inputs: number[],
    answers: { id: string; value: string }[]
  ) => Correction[]
  public generateSeed: () => number[]
  public getContext: (
    inputs: number[],
    lang: LanguageCode
  ) => GeneratedExercise['context']

  constructor(data: {
    id: string
    tags: ExerciseTags[]
    createdOn: number
    name?: { en: string; fr: string } | string
    desc?: { en: string; fr: string }
    recent?: boolean
    validateAnswers: (
      inputs: number[],
      answers: { id: string; value: string }[]
    ) => Correction[]
    generateSeed: () => number[]
    getContext: (
      inputs: number[],
      lang: LanguageCode
    ) => GeneratedExercise['context']
  }) {
    this.id = data.id
    if (!data.name) {
      const name =
        this.id[0].toUpperCase() + this.id.slice(1)
      this.name = { en: name, fr: name }
    } else if (typeof data.name == 'string') {
      this.name = { en: data.name, fr: data.name }
    } else {
      this.name = data.name
    }
    this.desc = data.desc ?? null
    this.tags = data.tags ?? []
    this.recent = data.recent ?? false
    this.createdOn = data.createdOn
    this.validateAnswers = data.validateAnswers
    this.generateSeed = data.generateSeed
    this.getContext = data.getContext
  }

  generate(lang: LanguageCode) {
    const seed = this.generateSeed()
    const context = this.getContext(seed, lang)
    return {
      exercise_id: this.id,
      seed,
      context
    }
  }
}
