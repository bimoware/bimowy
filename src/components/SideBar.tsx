import PageSection from "./PageSection";
import SideBarIcon from "./SideBarIcon";

import { routes } from '../router.tsx'

export default function SideBar() {
    const currentPath = window.location.pathname;
    return <PageSection className="flex flex-col gap-3">
        {
            routes.map(({ id, icon, href }, key) => <SideBarIcon
                {...{ key, id, icon, currentPath, href }} />
            )
        }
    </PageSection>
}