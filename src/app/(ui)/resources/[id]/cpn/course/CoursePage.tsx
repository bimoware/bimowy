import { LanguageCode } from "@/utils/locale";
import { CourseBuilder } from "@api/lib/course";
import Image from "next/image";

export default function CoursePage({
	id, desc, name, content
}: ReturnType<CourseBuilder["serialize"]> & { locale: LanguageCode }) {
	if (!content.length) return <h1>Course still empty...</h1>
	return <div className="w-full h-full flex">
		<div className="h-full
		w-96
		bg-white/5
		rounded-2xl
		p-2">
			{content.map(c => (
				<div
					key={c.id}
					className="w-fit
				p-1 px-2 pr-3
				rounded-xl
				flex gap-2
				h-8
				cursor-pointer hover:bg-white/5 duration-150
				overflow-ellipsis">
					<Image src="/svgs/folder.svg" width={50} height={50} alt="folder"
						className="h-full w-fit p-0.5" />
					{c.name}
				</div>
			))}
		</div>
		<div className="w-full flex justify-center">
			EFG
		</div>
	</div>
}