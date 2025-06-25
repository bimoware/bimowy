import { ReactNode } from "react";
import DesktopSideBar from "./DesktopSideBar";
import { LanguageCode } from "@/utils/locale";

export default function SideBarContainer({ children, locale }: { children: ReactNode, locale: LanguageCode }) {
	return <div className="flex
	w-full h-full">
		<DesktopSideBar {...{ locale }} />
		<main className='w-full h-full
		flex justify-center p-3 ml-24'>
			{children}
		</main>
	</div>
}