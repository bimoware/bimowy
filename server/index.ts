import express from "express";

const app = express();
const PORT = process.env.PORT || 5000;

app.get("/api/", (req, res) => {
	res.json({ no: "error" });
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
