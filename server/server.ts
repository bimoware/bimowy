import express from "express";
import cors from "cors";
import fs from "fs";
import { ExerciceRessource, Ressource } from "./defs";

const app = express();
const PORT = 1230;
const ressources = new Map<string, Ressource>();

app.use(cors());

function fetchSubjects() {
	ressources.clear();
	for (let file of fs.readdirSync("./ressources")) {
		let data: Ressource = require("./ressources/" + file).default;
		ressources.set(data.id, data);
	}
}

fetchSubjects();

app.listen(PORT, () => {
	console.log(`🌐 Server running on port http://localhost:${PORT}`);
});

app.get("/api/ressources", (req, res) => {
	res.json(Array.from(ressources.values()));
});

app.get("/api/exercice/:exercice_id", (req, res) => {
	const { exercice_id } = req.params;
	const difficulty = Number(req.query["difficulty"]) || 0;
	const exercice = ressources.get(exercice_id);
	if (!exercice) {
		res.status(404).send(`Exercice with ID '${exercice_id}' not found`);
	} else if (!(exercice instanceof ExerciceRessource)) {
		res.status(400).send("Exercice is not an exercice ressource");
	} else {
		const questions = Array.from({ length: 3 }).map((_, i) => ({
			parts: exercice.generateRandomQuestion(difficulty)
		}));
		res.json(questions);
	}
});
