export function factorial(n: number): number {
	return n * (n < 2 ? 1 : factorial(n - 1))
}

export function toRounded(v: number) {
	return +(v).toFixed(2)
}