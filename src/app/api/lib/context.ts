
// Contexts

export type ContextElement = {
	type: "text";
	text: string;
	extra?: ("mono" | "latex")[];
} |
{ type: "input"; id: string; };

export type ContextSection = {
	type: "p";
	content: ContextElement[];
};
