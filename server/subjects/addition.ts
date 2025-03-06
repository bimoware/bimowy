const getAnswer = ([n1, n2]: number[]) => n1 + n2;

export default {
	type: "subject",
	id: "substract",
	name: "Substraction",
	description: "Taking the sum of multiple numbers",
	questionVariations: [
		{
			id: "basic",
			getAnswer,
			generate: (difficulty: difficulty) => {
				const ranges = {
					easy: [1, 10],
					medium: [10, 1e2],
					hard: [1e2, 1e3],
					evil: [1e5, 1e10]
				};
				const range = ranges[difficulty];
				const [n1, n2] = [range, range].map(
					(r) => Math.floor(Math.random() * (r[1] - r[0])) + r[0]
				);
				return [n1, n2];
			},
			format: ([n1, n2]: number[]) => {
				return [
					{
						type: "input",
						title: n1 + " + " + n2,
						answer: getAnswer([n1, n2])
					}
				];
			}
		}
	]
};
