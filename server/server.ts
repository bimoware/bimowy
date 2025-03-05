import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();
const PORT = 60000;
const subjects = new Map<string, subject>();

app.use(cors());

function fetchSubjects() {
	for (let file of fs.readdirSync("./subjects")) {
		let data = require("./subjects/" + file).default;
		subjects.set(data.id, data);
	}
}

fetchSubjects();

app.get("/subjects/", (req, res) => {
	res.json(Array.from(subjects.values()));
});

app.get("/quiz/:id", (req, res) => {
	const { id } = req.params;
	let subject = subjects.get(id);
	if (!subject) {
		res.status(404).json(`No quiz found for ID '${id}'`);
	} else {
		const questions = Array.from({ length: 7 }, () => subject.questionGenerator[0]("easy"));
		res.json(questions);
	}
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
