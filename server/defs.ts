type difficulty = "easy" | "medium" | "hard" | "evil"
type subject = {
    type: string,
    id: string,
    name: string,
    description: string,
    questionGenerator: Function[]
}