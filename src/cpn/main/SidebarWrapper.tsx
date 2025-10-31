"use client";

import {
  HistoryIcon,
  type LucideIcon,
  StarIcon,
  TrendingUpIcon,
} from "lucide-react";
import Image from "next/image";
import { type ReactNode, useState } from "react";
import {
  Sidebar,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/cpn/ui/sidebar";
import { MascotIcon } from "./MascotIcon";

type NavGroup = {
  name: string;
  id: string;
  items: {
    id: string;
    icon: LucideIcon;
    href: string;
    name: string;
  }[];
};

type SidebarData = {
  main: {
    href?: string;
    icon: typeof MascotIcon;
    subtitle?: string;
    title: string;
  };
  nav: NavGroup[];
};

export const data: SidebarData = {
  main: {
    href: "/",
    icon: MascotIcon,
    subtitle: "BETA",
    title: "bimo/wy",
  },
  nav: [
    {
      id: "main-nav",
      items: [
        {
          href: "/favorites",
          icon: StarIcon,
          id: "favorites",
          name: "Favorites",
        },
        {
          href: "/history",
          icon: HistoryIcon,
          id: "history",
          name: "History",
        },
        {
          href: "/stats",
          icon: TrendingUpIcon,
          id: "progress",
          name: "Progress",
        },
      ],
      name: "",
    },
  ],
} as const;

export default function SideBarWrapper({ children }: { children: ReactNode }) {
  const [isOpen] = useState(true);
  return (
    <SidebarProvider open={isOpen}>
      <CustomSidebar />
      <main className="w-full min-h-screen p-5 pt-10 flex flex-col gap-5">
        {/* Main stuff */}
        {children}
      </main>
    </SidebarProvider>
  );
}

function CustomSidebar() {
  return (
    <Sidebar className="select-none" collapsible="icon" variant="floating">
      <Header />
      <MainNavButtons />
      <div className="h-full w-full"></div>
      <SidebarCredits />
    </Sidebar>
  );
}

function Header() {
  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild size="lg">
            <a href={data.main.href}>
              <div className="aspect-square h-full p-0.5">
                <data.main.icon className="hover:scale-125 hover:rotate-5 duration-150" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-medium text-xl">{data.main.title}</span>
                {data.main.subtitle && (
                  <span className="text-md opacity-50 text-nowrap">
                    {data.main.subtitle}
                  </span>
                )}
              </div>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
}

function MainNavButtons() {
  return data.nav.map((n) => (
    <SidebarGroup key={n.id}>
      {n.name && <SidebarGroupLabel>{n.name}</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu>
          {n.items.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton asChild>
                <a href={item.href}>
                  <item.icon />
                  {item.name}
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  ));
}

function SidebarCredits() {
  return (
    <div className="w-full p-2 flex justify-center text-sm overflow-clip gap-1 text-nowrap">
      <span className="opacity-50">Made with ❤️ by</span>
      <SidebarCreditsMention />
    </div>
  );
}

function SidebarCreditsMention() {
  return (
    <a
      className="inline-flex gap-1 items-center
    hover:cursor-pointer hover:-translate-y-0.5 duration-75
    opacity-50 hover:opacity-100 hover:scale-110 hover:translate-x-1"
      href="https://github.com/bimoware/bimowy"
      rel="noopener"
      target="_blank"
    >
      <Image
        alt=""
        className="rounded-full h-[0.8lh] w-[0.8lh]"
        height={50}
        src="/malik.jpg"
        width={50}
      />
      Malik
    </a>
  );
}
