import Image from "next/image";

export function Button({ alt, src, onClick, disabled, primary }: {
	alt: string;
	onClick?: () => void;
	src?: string,
	disabled?: boolean,
	primary?: boolean
}) {
	return (
		<button
			{...{ onClick, disabled }}
			className={`
				animate-appear
				disabled:hover:scale-[98%]
				disabled:opacity-50
				disabled:cursor-not-allowed
				disabled:bg-black/50 dark:disabled:bg-black/50
				hover:scale-105
				bg-black/20 dark:bg-white/5
				hover:bg-black/30 dark:hover:bg-white/20
				cursor-pointer
				duration-150
				flex items-center gap-2 px-3 py-2 rounded-2xl text-3xl
				relative group
				${!primary && "grayscale-50"}`}
		>
			<Image {...{ alt, src: src || "/svgs/loading.svg" }} width={30} height={30} />
			<span>{alt}</span>
		</button>
	)
}