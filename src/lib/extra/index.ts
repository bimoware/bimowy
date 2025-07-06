import { Dispatch, SetStateAction } from "react";

export function sleep(seconds: number) {
	return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}
// Take a hashed element from a list given a seed (id)
// We can't actually pseudo-random Math.random() or Date.now() bc of HydrationError
export function randomAt<T>(list: T[], id: string): T {
	const totalCharCode = id
		.split('')
		.reduce((prev, curr) => prev + curr.charCodeAt(0), 0);
	return list[totalCharCode % list.length];
}

export function toRounded(v: number) {
	return +(v).toFixed(2);
}

export type HookSetter<T> = Dispatch<SetStateAction<T>>