import { ReactNode } from "react";
import DesktopSideBar from "./desktop/DesktopSideBar";
import MobileSideBar from "./mobile/MobileSideBar";

export default function SideBarContainer({ children }: {
	children: ReactNode
}) {
	return <div className="flex
	w-full min-h-screen">
		<DesktopSideBar />
		<main className='w-full h-full
		flex
		justify-center p-3
		pb-24 sm:pb-3
		ml-0 sm:ml-24'>
			{children}
		</main>
		<MobileSideBar />
	</div>
}