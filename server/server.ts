import express from 'express'
import cors from 'cors'
import fs from 'fs'
import { ExercicesRessource, Ressource } from './defs'

const app = express()
const PORT = 1230
const ressources = new Map<string, Ressource>()

app.use(cors())

async function fetchSubjects() {
  ressources.clear()
  for (const file of fs.readdirSync('./ressources')) {
    const data: Ressource = (await import('./ressources/' + file)).default
    ressources.set(data.id, data)
  }
}

fetchSubjects()

app.listen(PORT, () => {
  console.log(`🌐 Server running on port http://localhost:${PORT}`)
})

app.get('/api/ressources', (req, res) => {
  res.json(Array.from(ressources.values()))
})


app.get('/api/generate-exercices/:exercice_id', (req, res) => {
  const { exercice_id } = req.params
  const difficulty = 0
  const exercice = ressources.get(exercice_id)
  if (!exercice) {
    res.status(404).send(`Exercice with ID '${exercice_id}' not found`)
  } else if (!(exercice instanceof ExercicesRessource)) {
    console.log(exercice)
    res.status(400).send('Exercice is not an exercice ressource')
  } else {
    const questions = Array.from({ length: 3 }).map(() =>
      exercice.generateRandomExercice(difficulty)
    )
    res.json(questions)
  }
})

type ValidateAnswerQuery = {
  id: string
  answer: string
  inputs: string[]
}

app.get('/api/validate-answer', (req, res) => {
  const { exercice_id, answer, inputs } = req.body as ValidateAnswerQuery
  const exercice = ressources.get(exercice_id)
  if (!exercice) {
    res.status(404).send(`Exercice with ID '${exercice_id}' not found`)
  } else if (!(exercice instanceof ExercicesRessource)) {
    res.status(400).send('Exercice is not an exercice ressource')
  } else {
    const isCorrect = exercice.validateAnswer({
      id:exercice_id,
      inputs: inputs.map((input) => Number(input)),
      answer
    })
    res.json({ isCorrect })
  }
})
