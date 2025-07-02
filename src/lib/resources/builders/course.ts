import { LanguageCode } from "@/lib/locale";
import { ResourceBuilder, ResourceConfig, ResourceType } from "./resource";

type CourseElem = {
	id: string,
	name: string
} & (
		{ type: "exercise" | "lesson" | "playground" }
		| { type: "folder", content: CourseElem[] })
type CourseConfig = Omit<ResourceConfig<ResourceType.Course>, "type"> & {
	getContent: (lang: LanguageCode) => CourseElem[]
}

export class CourseBuilder extends ResourceBuilder<
	ResourceType.Course, CourseConfig & { type: ResourceType.Course }
> {
	getContent: CourseConfig["getContent"]
	constructor(config: CourseConfig) {
		super({ ...config, type: ResourceType.Course });
		this.getContent = config.getContent
	}
	serialize(lang: LanguageCode) {
		return {
			...super.serialize(lang),
			content: this.getContent(lang)
		}
	}
}