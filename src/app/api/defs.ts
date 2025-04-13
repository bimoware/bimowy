import fs from 'fs'
import path from 'path'

type ExerciseTags =
  | 'basic-arithmetic'
  | 'geometry'
  | 'trigonometry'
  | 'algebra'
  | 'linear-algebra'
  | 'calculus'
  | 'statistics'
  | 'probability'
  | 'multivariable-calculus'

const Languages = ['fr', 'en'] as const
export type Language = (typeof Languages)[number] // 'fr' | 'en'
type LocaleStrings = {
  [K in Language]: string | null
}

export type ContextElement =
  | {
      type: 'text'
      text: string
      extra?: ('mono' | 'latex')[]
    }
  | { type: 'input' }

export type ContextSection = {
  type: 'p'
  content: ContextElement[]
}

export type GeneratedExercise = {
  exercise_id: string
  seed: number[]
  context: ContextSection[]
}

type Correction<Answers> = {
  [K in keyof Answers]: boolean
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

export class ExerciseGenerator<Seed = any, Answers = any> {
  public id: string
  public nameLocales: LocaleStrings
  public descLocales: LocaleStrings
  public tags: ExerciseTags[]
  public createdOn: number
  public recent: boolean
  public validateAnswers: (
    seed: Seed,
    answers: Answers
  ) => Correction<Answers>
  public generateSeed: () => Seed
  public getContext: (
    seed: Seed,
    lang: Language
  ) => ContextSection[]
  public getSolution: (seed: Seed) => Answers
  public getDetailedSolution: (
    seed: Seed
  ) => ContextSection[]

  constructor(data: {
    id: string
    nameLocales?: LocaleStrings | string
    descLocales?: LocaleStrings | string
    tags: ExerciseTags[]
    createdOn: number
    validateAnswers: (
      seed: Seed,
      answers: Answers
    ) => Correction<Answers>
    generateSeed: () => Seed
    getContext: (
      seed: Seed,
      lang: Language
    ) => ContextSection[]
    getSolution: (seed: Seed) => Answers
    getDetailedSolution: (
      seed: Seed
    ) => ContextSection[]
  }) {
    this.id = data.id
    if (!data.nameLocales) {
      const name =
        this.id[0].toUpperCase() + this.id.slice(1)
      this.nameLocales = { en: name, fr: name }
    } else if (typeof data.nameLocales == 'string') {
      this.nameLocales = {
        en: data.nameLocales,
        fr: data.nameLocales
      }
    } else {
      this.nameLocales = data.nameLocales
    }
    if (!data.descLocales) {
      this.descLocales = { en: null, fr: null }
    } else if (typeof data.descLocales == 'string') {
      this.descLocales = {
        en: data.descLocales,
        fr: data.descLocales
      }
    } else {
      this.descLocales = data.descLocales
    }
    this.tags = data.tags ?? []
    this.createdOn = data.createdOn
    this.recent = data.createdOn >= 4
    this.validateAnswers = data.validateAnswers
    this.generateSeed = data.generateSeed
    this.getContext = data.getContext
    this.getSolution = data.getSolution
    this.getDetailedSolution = data.getDetailedSolution
  }

  serialize(lang: Language) {
    return {
      id: this.id,
      name: this.nameLocales[lang],
      desc: this.descLocales[lang],
      tags: this.tags,
      recent: this.recent
    }
  }

  generate(lang: Language) {
    const seed = this.generateSeed()
    const context = this.getContext(seed, lang)
    return {
      exercise_id: this.id,
      seed,
      context
    }
  }
}
