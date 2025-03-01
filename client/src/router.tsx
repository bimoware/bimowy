import { createBrowserRouter, RouterProvider } from "react-router-dom";

import DashboardPage from './pages/DashboardPage.tsx';
import HomePage from './pages/HomePage.tsx';
import SettingsPage from './pages/SettingsPage.tsx';

import SideBar from "./components/SideBar.tsx";
import PageSection from "./components/PageSection.tsx";

import homeIcon from '/svgs/home.svg';
import dashboardIcon from '/svgs/dashboard.svg';
import historyIcon from '/svgs/history.svg';
import settingsIcon from '/svgs/settings.svg';
import HistoryPage from "./pages/HistoryPage.tsx";


export const routes = [
    {
        id: "home",
        element: <HomePage />,
        icon: homeIcon,
        href: "/"
    },
    {
        id: "dashboard",
        element: <DashboardPage />,
        icon: dashboardIcon,
    },
    {
        id: "history",
        element: <HistoryPage />,
        icon: historyIcon
    },
    {
        id: "settings",
        element: <SettingsPage />,
        icon: settingsIcon
    }
]
    .map(route => ({ ...route, href: route.href || ("/" + route.id) }))


const router = createBrowserRouter(
    routes.map(route => ({ path: route.href, element: route.element }))
)

export default function RouterManager() {
    return <>
        {/* SideBar */}
        <SideBar />
        {/* Main */}
        <PageSection className="w-full p-6">
            <RouterProvider {... { router }} />
        </PageSection>
    </>
}