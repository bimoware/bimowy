import ALL_WIDGETS from "@cpn/widgets";

type ValidWidgetID = keyof typeof ALL_WIDGETS
export type ExerciseWidgetSection<
	T extends ValidWidgetID = ValidWidgetID
> = {
	type: "widget",
	id: T,
	props: React.ComponentPropsWithoutRef<typeof ALL_WIDGETS[T]>
}

export type ExerciseParagraphSection = { type: "p", content: ExerciseParagraphContent[] }
export type ExerciseTextContent = { type: "text"; text: string }
export type ExerciseInputContent = { type: "input"; id: string; }
export type ExerciseParagraphContent = ExerciseTextContent | ExerciseInputContent


export type ExerciseSection = ExerciseParagraphSection | ExerciseWidgetSection<keyof typeof ALL_WIDGETS>
export type ExerciseContent = ExerciseSection[]
export type AnyExerciseContent = ExerciseParagraphContent | ExerciseParagraphSection | ExerciseWidgetSection