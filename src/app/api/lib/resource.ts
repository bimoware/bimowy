import { LanguageCode, LocaleString, LocaleRecord, toLocaleString } from "@/utils/locale";
import { GLOBAL_TAGS, TAG_ID } from "./tag";

export enum ResourceType {
	Exercise = "exercise",
	Note = "note"
}

export interface ResourceConfig<T extends ResourceType> {
	id: string;
	type: T;
	names: LocaleString;
	descs?: LocaleString;
	beta?: boolean;
	tags?: TAG_ID[];
}

export class ResourceBuilder<
	T extends ResourceType,
	Config extends ResourceConfig<T>
> {
	id: string
	type: T
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
			beta: this.beta ?? false,
			tags: (this.tags ?? []).map(t => GLOBAL_TAGS[t].names[lang]),
		};
	}
}

export type AnyResourceBuilder = ResourceBuilder<ResourceType, ResourceConfig<ResourceType>>