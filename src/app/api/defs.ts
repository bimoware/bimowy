export type ExerciseInput = { id: string; type: string }
export type Correction = { id: string; is_correct: boolean }
export type ExerciseTags =
	| 'basic-arithmetic'
	| 'geometry'
	| 'trigonometry'
	| 'algebra'
	| 'calculus'
	| 'statistics'
	| 'probability'
	| 'multivariable-calculus'

export type GeneratedExercise = {
	exercise_id: string
	seed: number[]
	context: string[]
	inputs: ExerciseInput[]
}

export class ExerciseGenerator {
	public id: string
	public name: string
	public desc: string | null
	public tags: ExerciseTags[]
	public recent: boolean
	public validateAnswers: (
		inputs: number[],
		answers: { id: string; value: string }[]
	) => Correction[]
	public generateSeed: () => number[]
	public getContext: (inputs: number[]) => string[]
	public getInputs: () => ExerciseInput[]

	constructor(data: {
		id: string
		tags: ExerciseTags[]
		name?: string
		desc?: string
		recent?: boolean
		validateAnswers: (
			inputs: number[],
			answers: { id: string; value: string }[]
		) => Correction[]
		generateSeed: () => number[]
		getContext: (inputs: number[]) => string[]
		getInputs: () => ExerciseInput[]
	}) {
		this.id = data.id
		this.name = data.name ?? this.id[0].toUpperCase() + this.id.slice(1)
		this.desc = data.desc ?? null
		this.tags = data.tags ?? []
		this.recent = data.recent ?? false
		this.validateAnswers = data.validateAnswers
		this.generateSeed = data.generateSeed
		this.getContext = data.getContext
		this.getInputs = data.getInputs
	}

	generate() {
		const seed = this.generateSeed()
		const context = this.getContext(seed)
		const inputs = this.getInputs()
		return {
			exercise_id: this.id,
			seed,
			context,
			inputs
		}
	}
}
