import path from "path"
import { readdirSync } from 'fs';
import { AnyResourceBuilder, ResourceType } from "@/lib/resources/builders/resource"
import { AnyExerciseBuilder } from "@/lib/resources/builders/exercise";

const printEmojis: Record<ResourceType, string> = {
	"exercise": "🧪",
	"sandbox": "📦"
}

class ResourceManager {
	cache = new Map<string, AnyResourceBuilder>()
	allCached: boolean = false
	async getCache() {
		if (!this.allCached) await this.fetchAll()
		return Array.from(this.cache.values())
	}
	async fetchAllExercises() {
		if (this.allCached) await this.fetchAll()
		return Array.from(this.cache
			.values()
			.filter(r => r.type == ResourceType.Exercise)
		) as AnyExerciseBuilder[]
	}
	async fetchAll() {
		if (this.allCached) return Array.from(this.cache.values())
		const totalPath = path.join(process.cwd(), "/src/lib/resources/list")
		const files = readdirSync(totalPath)
		for (const file of files) {
			if (!file.includes(".")) continue
			const id = file.split('.')[0]
			if (this.cache.has(id)) continue
			await this.fetch(id)
		}
		this.allCached = true
		return this.getCache()
	}
	async fetch(id: string) {
		if (this.cache.has(id)) return this.cache.get(id)!
		const resourceImport = await import(`../lib/resources/list/${id}`)
		const resource = resourceImport.default as AnyResourceBuilder
		this.cache.set(resource.id, resource)
		console.log(`${printEmojis[resource.type]} Fetched ${id}`)
		return resource
	}
}

export const resourcesManager = new ResourceManager()