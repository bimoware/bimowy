import { default as Plane } from "./plane";

export const Widgets = { Plane } as const;
export type WidgetId = keyof typeof Widgets;
export type WidgetProps<Id extends WidgetId> = Parameters<(typeof Widgets)[Id]>;
