import Image from "next/image"
import { ReactNode } from "react"

type ButtonProps = { label: string, icon: ReactNode, onClick?: VoidFunction }
export default function Button({ label, icon, onClick }: ButtonProps) {
	return <button
		className="bg-green-700
		rounded-xl
		px-2 py-1
		flex items-center gap-1
		cursor-pointer duration-150 hover:scale-105"
		{...{ onClick }}
	>
		<div className="flex items-center">
			<Image src={"/svgs/plus.svg"} alt={label} width={20} height={20} className="h-full aspect-square" />
			{icon}
		</div>
		<span>{label}</span>
	</button>
}