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

export type questionPart = {
	type: QuestionPartType;
	title?: string
};
export type Exercice = {
	id: string;
	getAnswer: (inputs: number[]) => number;
	generate: (difficulty: Difficulty) => number[];
	format: (inputs: number[]) => questionPart[];
};

const idToName = (id: string) => id.split(' ').map(word => word[0].toUpperCase() + word.slice(1)).join(' ')

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
		this.name = this.name || idToName(this.id)
	}

	generateRandomQuestion({ difficulty }: { difficulty: Difficulty }) {
		const questionI = Math.floor(Math.random() * this.exercices.length);
		const questionGenerator = this.exercices[questionI];
		const questionInputs = questionGenerator.generate(difficulty);
		const question = questionGenerator.format(questionInputs)
		return question;
	}
	validateAnswer({ id, params, answer }: { id: string; params: number[]; answer: number }) {
		const question = this.exercices.find((q) => q.id === id);
		if (!question) return new Error(`Question w/ id "${id}" not found`);
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
		this.name = this.name || idToName(this.id)
	}
}
