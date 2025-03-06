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

export type questionPart = {
	type: "input" | "text";
	answer: number;
	title?: string;
};

export type QuestionGenerator = {
    id: string;
    getAnswer: (inputs: number[]) => number;
    generate: (difficulty: Difficulty) => number[];
    format: (inputs: number[]) => questionPart[];
}

export type ExerciceGeneratorData = {
	id: string;
	name: string;
	description: string;
	questionGenerators: QuestionGenerator[]
};

export class ExerciceGenerator {
	questionGenerators: QuestionGenerator[]
    id: string;
    name: string;
    description: string;
	constructor(data: ExerciceGeneratorData) {
        this.id = data.id
        this.name = data.name
        this.description = data.description
        this.questionGenerators = data.questionGenerators
	}

	generateRandomQuestion({ difficulty }: { difficulty: Difficulty }) {
		const questionI = Math.floor(Math.random() * this.questionGenerators.length);
		const questionGenerator = this.questionGenerators[questionI];
		const question = questionGenerator.generate(difficulty);
		return question;
	}
	validateAnswer({ id, params, answer }: { id: string; params: number[]; answer: number }) {
		const question = this.questionGenerators.find((q) => q.id === id);
		if (!question) return new Error(`Question w/ id "${id}" not found`);
		return question.getAnswer(params) === answer;
	}
}
