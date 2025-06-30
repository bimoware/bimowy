import { ResourceBuilder, ResourceConfig, ResourceType } from "./resource";

type CourseConfig = Omit<ResourceConfig<ResourceType.Course>, "type">

export class CourseBuilder extends ResourceBuilder<
	ResourceType.Course, CourseConfig & { type: ResourceType.Course }
> {
	constructor(config: CourseConfig) {
		super({ ...config, type: ResourceType.Course });
	}
}