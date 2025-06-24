import Widgets from "@util/widgets";
import { LanguageCode, LocaleRecord } from "@util/locale";
import { ResourceBuilder, ResourceType, ResourceConfig } from "./resource";

export type NoteBloc = {
	names?: LocaleRecord;
} & (
		| { type: "text"; texts: string[] }
		| { type: "widget"; id: keyof typeof Widgets }
	)
export type NoteContent = NoteBloc[];

export type NoteConfig = Omit<ResourceConfig<ResourceType.Note>, "type">
	& {
		content: NoteContent;
	}

export class NoteBuilder extends ResourceBuilder<
	ResourceType.Note,
	NoteConfig & { type: ResourceType.Note }
> {
	content: NoteContent;

	constructor(config: NoteConfig) {
		super({ ...config, type: ResourceType.Note });
		this.content = config.content;
	}

	serialize(lang: LanguageCode) {
		return {
			...super.serialize(lang),
			content: this.content,
		};
	}
}