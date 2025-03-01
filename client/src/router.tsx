import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import DashboardPage from './pages/DashboardPage.tsx';
// import HomePage from './pages/HomePage.tsx';
// import SettingsPage from './pages/SettingsPage.tsx';

import SideBar from "./components/SideBar.tsx";
import PageSection from "./components/PageSection.tsx";

import testIcon from '/svgs/test.svg';
// import homeIcon from '/svgs/home.svg';
import dashboardIcon from '/svgs/dashboard.svg';
import TestPage from "./pages/TestPage.tsx";
// import historyIcon from '/svgs/history.svg';
// import settingsIcon from '/svgs/settings.svg';
// import HistoryPage from "./pages/HistoryPage.tsx";


export const routes = [
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