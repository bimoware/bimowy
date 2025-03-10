import express from 'express'
import cors from 'cors'
import fs from 'fs'
import { ExerciceResource } from './defs'

const app = express()
const PORT = 1230
const exercices = new Map<string, ExerciceResource>()

app.use(cors())

async function fetchSubjects() {
  exercices.clear()
  for (const file of fs.readdirSync('./ressources')) {
    const data: ExerciceResource = (await import('./ressources/' + file)).default
    if (exercices.has(data.id)) throw new Error(`Duplicate subject with ID '${data.id}'`)
    exercices.set(data.id, data)
  }
}

fetchSubjects()

app.listen(PORT, () => {
  console.log(`🌐 Server running on port http://localhost:${PORT}`)
})

app.get('/api/ressources', (req, res) => {
  res.json(Array.from(exercices.values()))
})

app.get('/api/generate-exercices/:exercice_id', (req, res) => {
  const { exercice_id } = req.params
  const n = Number(req.query.n) || 5
  const exercice = exercices.get(exercice_id)
  if (!exercice) {
    res.status(404).send(`Exercice with ID '${exercice_id}' not found`)
  } else if (!(exercice instanceof ExerciceResource)) {
    console.log(exercice)
    res.status(400).send('Exercice is not an exercice ressource')
  } else {
    const questions = Array.from({ length: n }).map(() => exercice.generate())
    res.json(questions)
  }
})

type ValidateAnswerQuery = {
  id: string
  answers: string[]
  seed: number[]
}

app.get('/api/validate-answers', (req, res) => {
  const { id, answers, seed } = req.body as ValidateAnswerQuery
  const exercice = exercices.get(id)
  if (!exercice) {
    res.status(404).send(`Exercice with ID '${id}' not found`)
  } else if (!(exercice instanceof ExerciceResource)) {
    res.status(400).send('Exercice is not an exercice ressource')
  } else {
    res.json(exercice.validateAnswers(seed, answers))
  }
})
