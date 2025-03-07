import express from "express";
import cors from "cors";
import fs from "fs";
import { ExerciceRessource, Ressource } from "./defs";

const app = express();
const PORT = 4005;
const ressources = new Map<string, Ressource>();

app.use(cors());

function fetchSubjects() {
	console.log("⬜ Fetching ressources...");
	ressources.clear();
	for (let file of fs.readdirSync("./ressources")) {
		let data: Ressource = require("./ressources/" + file).default;
		ressources.set(data.id, data);
	}
	console.log("🟩 Ressources fetched!");
}

fetchSubjects();

app.get("/api/", (req, res) => {
	res.json(Array.from(ressources.values()));
});

app.listen(PORT, () => {
	console.log(`🌐 Server running on port http://localhost:${PORT}/api`);
});
