import express from "express";
import cors from "cors";
import fs from "fs";
import { ExerciceGenerator } from "./defs";

const app = express();
const PORT = 60001;
const subjects = new Map<string, ExerciceGenerator>();

app.use(cors());

function fetchSubjects() {
	for (let file of fs.readdirSync("./subjects")) {
		let data = require("./subjects/" + file).default;
		subjects.set(data.id, data);
	}
}

fetchSubjects();

app.get("/subjects/", (req, res) => {
	console.log(subjects)
	// res.json('ok')
	res.json(Array.from(subjects.values()));
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
