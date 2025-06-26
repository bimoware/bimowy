import { ReactNode } from "react";
import { LanguageCode } from "@/utils/locale";
import DesktopSideBar from "./desktop/DesktopSideBar";
import MobileSideBar from "./mobile/MobileSideBar";

export default function SideBarContainer({ children, lang }: {
	children: ReactNode,
	lang: LanguageCode
}) {
	return <div className="flex
	w-full h-full">
		<DesktopSideBar {...{ lang }} />
		<main className='w-full h-full
		flex
		justify-center p-3
		pb-24 md:pb-auto
		ml-0 md:ml-24'>
			{children}
		</main>
		<MobileSideBar {...{ lang }} />
	</div>
}