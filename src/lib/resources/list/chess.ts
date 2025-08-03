import { ToolResourceBuilder } from "../builders/tool";

export default new ToolResourceBuilder({
    id: "chess",
    tags: [],
    names: {
        en: "Chess",
        fr: "Échecs"
    },
    descs: {
        en: "Play the game of chess.",
        fr: "Joue au jeu des échecs."
    },
    widget_id: "InteractiveChessBoard"
})