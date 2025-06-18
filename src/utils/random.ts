export function randomAt<T>(list: T[], id: string): T {
	const totalCharCode = id
		.split('')
		.reduce((prev, curr) => prev + curr.charCodeAt(0), 0)
	return list[totalCharCode % list.length]
}