export enum Difficulty {
	Easy = 0,
	Medium = 1,
	Hard = 2,
	Evil = 3
}
export enum QuestionPartType {
	Text = 0,
	Input = 1
}
export enum RessourceType {
	Exercice = 0,
	Lesson = 1
}
export type questionPart =
	| { type: QuestionPartType.Input }
	| {
			type: QuestionPartType.Text;
			text: string;
	  };
export type Exercice = {
	id: string;
	getAnswer: (inputs: number[]) => number;
	generate: (difficulty: Difficulty) => number[];
	format: (inputs: number[]) => questionPart[];
};

const idToName = (id: string) =>
	id
		.split(" ")
		.map((word) => word[0].toUpperCase() + word.slice(1))
		.join(" ");

export class Ressource {
	constructor(
		public type: RessourceType,
		public id: string,
		public name: string | null,
		public description: string
	) {}
	toJSON() {
		return {
			type: this.type,
			id: this.id,
			name: this.name,
			description: this.description
		};
	}
}

export class ExerciceRessource extends Ressource {
	constructor(
		public id: string,
		public name: string | null,
		public description: string,
		public exercices: Exercice[]
	) {
		super(RessourceType.Exercice, id, name, description);
		this.name = this.name || idToName(this.id);
	}
	getExercice(id: string) {
		return this.exercices.find((exercice) => exercice.id === id);
	}
	getRandomExercice() {
		return this.exercices[Math.floor(Math.random() * this.exercices.length)];
	}
	generateRandomInputs({ exerciceId, difficulty }: { exerciceId: string; difficulty: Difficulty }) {
		const exercice = this.getExercice(exerciceId)!;
		const questionInputs = exercice.generate(difficulty);
		return questionInputs;
	}
	generateRandomQuestion(difficulty: Difficulty, exerciceId?: string) {
		const exercice = exerciceId ? this.getExercice(exerciceId)! : this.getRandomExercice();
		const questionInputs = this.generateRandomInputs({ exerciceId: exercice.id, difficulty });
		const question = exercice.format(questionInputs);
		return question;
	}
	validateAnswer({ id, params, answer }: { id: string; params: number[]; answer: number }) {
		const question = this.exercices.find((q) => q.id === id)!;
		return question.getAnswer(params) === answer;
	}
}

export class LessonRessource extends Ressource {
	constructor(
		public id: string,
		public name: string | null,
		public description: string,
		public content: string
	) {
		super(RessourceType.Exercice, id, name, description);
		this.name = this.name || idToName(this.id);
	}
}
