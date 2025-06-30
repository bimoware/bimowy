export function roundBetween(min: number, n: number, max: number) {
	return Math.max(min, Math.min(n, max))
}

export function generateIntegers(start: number, end: number) {
	const result = [];

	for (let i = start + 1; i < end; i++) {
		result.push(i);
	}
	return result;
}