import { LanguageCode } from "@/lib/locale";
import { RawResourceBuilder, ResourceConfig, ResourceType } from "./resource";
import ALL_WIDGETS from "@cpn/widgets";

type ToolResourceConfig = Omit<ResourceConfig<ResourceType.Tool>, "type"> & {
    widget_id: keyof typeof ALL_WIDGETS
}

export class ToolResourceBuilder extends RawResourceBuilder<
    ToolResourceConfig & { type: ResourceType.Tool }
> {
    widget_id: ToolResourceConfig["widget_id"];
    constructor(cfg: ToolResourceConfig) {
        super({ ...cfg, type: ResourceType.Tool });
        this.widget_id = cfg.widget_id
    }
    serialize(locale:LanguageCode){
        return {
            ...super.serialize(locale),
            widget_id: this.widget_id
        }
    }
}

export type AnyToolBuilder = ToolResourceBuilder;
