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
    exercise_id: string;
    seed: number[];
    context: string[];
    inputs: ExerciseInput[];
}

export class ExerciseResource {
	constructor(
		public id: string,
		public name: string,
		public desc: string,
		public tags: ExerciseTags[],
		public validateAnswers: (
			inputs: number[],
			answers: {
				id: string
				value: string
			}[]
		) => Correction[],
		public generateSeed: () => number[],
		public getContext: (inputs: number[]) => string[],
		public getInputs: () => ExerciseInput[]
	) {}

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
