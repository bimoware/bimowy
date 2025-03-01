import express from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 5000;

app.get('/api/subjects', (req, res) => {
  const coursesDir = path.join(__dirname, 'courses'); // Path to your courses directory
  const courseFolders = fs.readdirSync(coursesDir);
  
  const subjects = courseFolders.map((folder) => ({
    title: folder,
    content: `Content for ${folder}...`,
  }));

  res.json(subjects);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
