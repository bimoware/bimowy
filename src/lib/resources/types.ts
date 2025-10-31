import {
  BicepsFlexedIcon,
  GraduationCapIcon,
  type LucideIcon,
  PlayIcon,
  RouteIcon,
  TelescopeIcon,
} from "lucide-react";

export type ResourceType = {
  color: string;
  icon: LucideIcon;
  name: string;
  slug: string;
};
export const resourceTypeData = {
  course: {
    color: "#60a5fa",
    emoji: "🎓",
    icon: GraduationCapIcon,
    name: "Course",
    slug: "c",
  },
  exercise: {
    color: "#fb923c",
    emoji: "💪",
    icon: BicepsFlexedIcon,
    name: "Exercise",
    slug: "e",
  },
  journey: {
    color: "#4ade80",
    emoji: "🗺️",
    icon: RouteIcon,
    name: "Journey",
    slug: "s",
  },
  tool: {
    color: "#a78bfa",
    emoji: "🔭",
    icon: TelescopeIcon,
    name: "Tool",
    slug: "t",
  },
  video: {
    color: "#f87171",
    emoji: "▶️",
    icon: PlayIcon,
    name: "Video",
    slug: "v",
  },
} as const;

export type ResourceTypeId = keyof typeof resourceTypeData;
