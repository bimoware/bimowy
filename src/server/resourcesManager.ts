import path from "path"
<<<<<<<< Updated upstream:src/app/api/resources/handler.ts
<<<<<<< Updated upstream
=======
<<<<<<<< Updated upstream:src/app/api/resources/handler.ts
>>>>>>> Stashed changes
import fs from "fs"
import { AnyResourceBuilder, ResourceType } from "@api/lib/resource"
import { ExerciseBuilder } from "@api/lib/exercise"
========
import { readdirSync } from 'fs';
import { AnyResourceBuilder, ResourceType } from "@/lib/resources/builders/resource"
import { ExerciseBuilder } from "@/lib/resources/builders/exercise";
>>>>>>>> Stashed changes:src/server/resourcesManager.ts
<<<<<<< Updated upstream
=======
========
import { readdirSync } from 'fs';
import { AnyResourceBuilder, ResourceType } from "@/lib/resources/builders/resource"
import { ExerciseBuilder } from "@/lib/resources/builders/exercise";
>>>>>>>> Stashed changes:src/server/resourcesManager.ts
>>>>>>> Stashed changes

const printEmojis: Record<ResourceType, string> = {
	"exercise": "🧪",
	"note": "📄",
	"course": "📦"
}

<<<<<<<< Updated upstream:src/app/api/resources/handler.ts
<<<<<<< Updated upstream
=======
<<<<<<<< Updated upstream:src/app/api/resources/handler.ts
>>>>>>> Stashed changes
export class ResourceHandler {
========
class ResourceManager {
>>>>>>>> Stashed changes:src/server/resourcesManager.ts
<<<<<<< Updated upstream
=======
========
class ResourceManager {
>>>>>>>> Stashed changes:src/server/resourcesManager.ts
>>>>>>> Stashed changes
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
		) as ExerciseBuilder[]
	}
	async fetchAll() {
		if (this.allCached) return Array.from(this.cache.values())
<<<<<<<< Updated upstream:src/app/api/resources/handler.ts
<<<<<<< Updated upstream
=======
<<<<<<<< Updated upstream:src/app/api/resources/handler.ts
>>>>>>> Stashed changes
		const totalPath = path.join(process.cwd(), "/src/app/api/resources/list")
		const files = fs.readdirSync(totalPath)
		for (let file of files) {
========
		const totalPath = path.join(process.cwd(), "/src/lib/resources/list")
		const files = readdirSync(totalPath)
		for (const file of files) {
>>>>>>>> Stashed changes:src/server/resourcesManager.ts
<<<<<<< Updated upstream
=======
========
		const totalPath = path.join(process.cwd(), "/src/lib/resources/list")
		const files = readdirSync(totalPath)
		for (const file of files) {
>>>>>>>> Stashed changes:src/server/resourcesManager.ts
>>>>>>> Stashed changes
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