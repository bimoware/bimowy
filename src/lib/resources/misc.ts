export function factorial(n: number): number {
	return n * (n < 2 ? 1 : factorial(n - 1))
}

export function randomFromInterval(
	min: number,
	max: number,
	exclude: number[] = []
) {
	const value = Math.floor(Math.random() * (max - min + 1)) + min;
	if (value in exclude) return randomFromInterval(min, max, exclude);
	return value;
}

export function randomFrom(arr: string[]) {
	return arr[Math.floor(Math.random() * arr.length)];
}
// Exercises
export function randomNonZeroInt(min: number, max: number) {
	const pool = [];
	for (let i = min; i <= max; i++) {
		if (i !== 0) pool.push(i);
	}
	return pool[Math.floor(Math.random() * pool.length)];
}
