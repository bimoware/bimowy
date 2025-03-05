const getAnswer = (n1: number, n2: number) => n1 - n2;

export default {
    type: "subject",
	id: "substract",
	name: "Substraction",
	description: "Taking a number and removing from it other number(s)",
	questionGenerator: [
		(difficulty: difficulty) => {
			const ranges = {
				easy: [1, 10],
				medium: [10, 1e2],
				hard: [1e2, 1e3],
				evil: [1e5, 1e10]
			};
			const range = ranges[difficulty];
			const [n1, n2] = [range, range].map((r) => Math.floor(Math.random() * (r[1] - r[0])) + r[0]);
			return [
				{
					type: "input",
					title: n1 + " - " + n2,
					answer: getAnswer(n1,n2)
				}
			];
		}
	],
	getAnswer
};
