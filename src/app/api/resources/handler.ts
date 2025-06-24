import path from "path"
import fs from "fs"
import { AnyResourceBuilder, ResourceBuilder, ResourceConfig, ResourceType } from "@api/lib/resource"
import { ExerciseBuilder } from "@api/lib/exercise"

const printEmojis: Record<ResourceType, string> = {
	"exercise": "🧪",
	"note": "📄"
}

export class ResourceHandler {
	cache = new Map<string, AnyResourceBuilder>()
	allCached: boolean = false
	getCache() {
		return Array.from(this.cache.values())
	}
	async fetchAllExercises() {
		if (this.allCached) await this.fetchAll()
		return Array.from(this.cache
			.values()
			.filter(r => r.type == ResourceType.Exercise)
		) as ExerciseBuilder<any, any, any>[]
	}

	async fetchAll() {
		if (this.allCached) return Array.from(this.cache.values())
		const totalPath = path.join(process.cwd(), "/src/app/api/resources/list")
		const files = fs.readdirSync(totalPath)
		for (let file of files) {
			if (!file.includes(".")) continue
			const id = file.split('.')[0]
			if (this.cache.has(id)) continue
			await this.fetch(id)
		}
		return this.getCache()
	}
	async fetch(id: string) {
		const cachedresource = this.cache.get(id)
		if (cachedresource) return cachedresource
		const module = await import(`./list/${id}`)
		const resource = module.default as AnyResourceBuilder
		this.cache.set(resource.id, resource)
		console.log(`${printEmojis[resource.type]} Fetched ${id}`)
		return resource
	}
}