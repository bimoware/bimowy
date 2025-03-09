import { useParams } from 'react-router'
import { useEffect, useState } from 'react'
import { QuestionPartType, RessourceType } from '../../../server/defs'
import LoadingIcon from '../components/LoadingIcon'

type pageState = 'not-started-yet' | 'ongoing' | 'correcting' | 'corrected' | 'finished'
type exerciceData = {
  parts: (
    | {
        type: QuestionPartType.Text
        text: string
      }
    | {
        type: QuestionPartType.Input
        value: string
        correct: boolean
      }
  )[]
  tries: number
  correctOnFirstTry: boolean
}

export default function ExercicePage() {
  const { exercice_id } = useParams()
  const maxQuestionIndex = 2
  const [questionIndex, setQuestionIndex] = useState(0)
  const [pageState, setPageState] = useState<pageState>('not-started-yet')
  const [questions, setQuestionsData] = useState<exerciceData[]>([])
  const [currentInput, setCurrentInput] = useState('')
  const [exerciceCorrections, setExerciceCorrections] = useState([])

  useEffect(() => {
    fetch(`http://localhost:1230/api/get-exercice/${exercice_id}`)
      .then((res) => res.json())
      .then((questionParts) => setQuestionsData(questionParts))
  }, [])

  useEffect(() => {
    if (pageState === 'ongoing') {
      setCurrentInput('')
    } else if (pageState === 'correcting') {
      const question = questions[questionIndex]
      const questionInputs = question.parts
      .find((q) => q.type === QuestionPartType.Input)
      .
    }
  }, [pageState])
  if (!questions.length) return <LoadingIcon />
  switch (pageState) {
    case 'not-started-yet':
      return <button onClick={() => setPageState('ongoing')}>Start</button>
    case 'ongoing':
    case 'corrected':
      return (
        <div className='flex flex-col gap-4'>
          <p className='text-sm italic'>
            Question {questionIndex + 1}/{maxQuestionIndex + 1}
          </p>
          {!questions[questionIndex] ? (
            <LoadingIcon />
          ) : (
            questions[questionIndex].parts.map((questionPart, i) => {
              switch (questionPart.type) {
                case QuestionPartType.Input:
                  let id = `input-${questionIndex}-${i}`
                  return (
                    <input
                      key={id}
                      type='text'
                      value={currentInput}
                      onChange={(e) => setCurrentInput(e.target.value)}
                      disabled={pageState !== 'ongoing'}
                      onKeyDown={(e) => (e.key !== 'Enter' ? null : setPageState('correcting'))}
                    />
                  )

                case QuestionPartType.Text:
                  return <span key={`text-${questionIndex}-${i}`}>{questionPart.text}</span>
              }
            })
          )}
          {pageState == 'ongoing' ? (
            <button onClick={() => setPageState('correcting')}>Check</button>
          ) : questionIndex < maxQuestionIndex ? (
            <button
              onClick={() => {
                setQuestionIndex(questionIndex + 1)
                setPageState('ongoing')
              }}
            >
              Next
            </button>
          ) : (
            <button onClick={() => setPageState('finished')}>Finish</button>
          )}
        </div>
      )
    case 'finished':
      return (
        <div>
          <p>Finished. GG ig</p>
        </div>
      )
  }
}
