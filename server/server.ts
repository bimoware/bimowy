import express from "express";
import fs from "fs";
import cors from "cors";

const app = express();
const PORT = 5000;

app.use(cors()); // Enable CORS

app.get("/api/", (req, res) => {
	const folders = fs.readdirSync('./db').map(name => name.replace('_',' '))
	res.json(folders)
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
