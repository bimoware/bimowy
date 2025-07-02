<<<<<<< Updated upstream:src/app/api/lib/note.ts
import Widgets from "@cpn/widgets";
import { LanguageCode, LocaleRecord } from "@/utils/locale";
=======
import { LanguageCode, LocaleRecord } from "@/lib/locale";
>>>>>>> Stashed changes:src/lib/resources/builders/note.ts
import { ResourceBuilder, ResourceType, ResourceConfig } from "./resource";
import ALL_WIDGETS from "@cpn/widgets";

export type NoteBloc = {
	names?: LocaleRecord;
} & (
		| { type: "text"; texts: string[] }
		| { type: "widget"; id: keyof typeof ALL_WIDGETS }
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