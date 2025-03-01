import { createBrowserRouter, RouterProvider } from "react-router-dom";

import HomePage from './pages/HomePage.tsx';
import SettingsPage from './pages/SettingsPage.tsx';

import SideBar from "./components/SideBar.tsx";
import PageSection from "./components/PageSection.tsx";

import settingsIcon from '/svgs/settings.svg';
import homeIcon from '/svgs/home.svg';


export const routes = [
    {
        id: "home",
        element: <HomePage />,
        icon: homeIcon,
        href: "/"
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