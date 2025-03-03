import PageSection from "./PageSection";
import SideBarIcon from "./SideBarIcon";

import testIcon from '/svgs/test.svg';
import dashboardIcon from '/svgs/dashboard.svg';
import subjectIcon from '/svgs/subject.svg';

import TestPage from "../pages/TestPage";
import DashboardPage from "../pages/DashboardPage";
import SubjectsPage from "../pages/SubjectsPage";

const routes = [
    {
        id: "test",
        element: <TestPage />,
        icon: testIcon,
        href: "/"
    },
    {
        id: "dashboard",
        element: <DashboardPage />,
        icon: dashboardIcon,
    },
    {
        id: "subjects",
        elements: <SubjectsPage />,
        icon: subjectIcon
    }
].map(route => ({ ...route, href: route.href || ("/" + route.id) }))

export default function SideBar() {
    const currentPath = window.location.pathname;
    return <PageSection className="flex flex-col gap-3 min-w-17">
        {
            routes.map(({ id, icon, href }) => <SideBarIcon
                {...{ id, icon, currentPath, href }} key={id} />
            )
        }
    </PageSection>
}