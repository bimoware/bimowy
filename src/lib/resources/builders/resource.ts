import { LanguageCode, LocaleString, LocaleRecord, toLocaleString } from "@/lib/locale";
import { GLOBAL_TAGS, TAG_ID } from "../extra/tag";
import { AnyExerciseBuilder } from "./exercise";
import { ToolResourceBuilder } from "./tool";
import { ROUTES } from "@cpn/sidebars/main";

export enum ResourceType {
	Exercise = "exercise",
	Tool = "tool"
}

export type ResourceConfig<T extends ResourceType> = {
	id: string;
	type: T;
	names: LocaleString;
	descs?: LocaleString;
	beta?: boolean;
	tags?: TAG_ID[];
}

export type AnyResourceConfig = {
	[K in ResourceType]: ResourceConfig<K>
}

export class RawResourceBuilder<
	Config extends ResourceConfig<ResourceType>
> {
	id: string
	type: Config["type"]
	names: LocaleRecord;
	descs?: LocaleRecord
	beta: boolean
	tags: TAG_ID[];

	constructor(config: Config) {
		this.id = config.id
		this.type = config.type
		this.names = toLocaleString(config.names);
		this.descs = config.descs ? toLocaleString(config.descs) : undefined;
		this.beta = config.beta ?? false
		this.tags = config.tags ?? []
	}

	serialize(lang: LanguageCode) {
		return {
			id: this.id,
			type: this.type,
			href: `/resources/${this.id}`,
			name: this.names[lang],
			desc: this.descs?.[lang],
			beta: this.beta,
			tags: this.tags.map(t => GLOBAL_TAGS[t].names[lang]),
		};
	}
}

export type AnyResourceBuilder = AnyExerciseBuilder | ToolResourceBuilder
export const RESOURCES_DATA = {
	"exercise": ROUTES["exercise"],
	"tool":	ROUTES["tool"]
 } as const

export type ResourceID = keyof typeof RESOURCES_DATA

