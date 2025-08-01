import { ToolResourceBuilder } from "../builders/tool";

export default new ToolResourceBuilder({
    id: "interactive-plane",
    tags: ["plane"],
    names: {
        en: "Interactive Plane",
        fr: "Plan interactif"
    },
    descs: {
        en: "Control points, vectors & functions in a 2D plane",
        fr: "Contrôle des points, vecteurs et fonctions dans un plan orthonormé 2D"
    },
    widget_id: "InteractivePlane"
})