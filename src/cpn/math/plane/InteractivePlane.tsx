import Image from "next/image";
import Plane from "./Plane";



export default function InteractivePlane() {
	return <section className="w-full h-full flex overflow-y-clip">
		<section className="w-full flex justify-center">
			<div>
				<Plane ranges={{ x: [0, 2 ** 4], y: [0, 2 ** 4] }} />
			</div>
		</section>
		<section className="w-1/3 bg-white/5 p-3">
			<div className="w-full flex items-center justify-center flex-wrap gap-3">
				<Button label="Add point" icon="/svgs/plus.svg" />
				<Button label="Add vector" icon="/svgs/plus.svg" />
				<Button label="Add graph" icon="/svgs/plus.svg" />
			</div>
		</section>
	</section>
}

function Button({ label, icon }: { label: string, icon: string }) {
	return <button
		className="bg-green-500
		rounded-xl
		px-2 py-1
		flex gap-1 items-center
		cursor-pointer duration-150
		hover:scale-105
		group"
	>
		{icon && <Image
			src={icon} alt={label} width={20} height={20}
			className="aspect-square h-full
			group-hover:scale-125 duration-150"
		/>}
		{label}</button>
}