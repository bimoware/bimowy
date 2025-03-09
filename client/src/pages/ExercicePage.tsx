import { useParams } from 'react-router'
import { Dispatch, useEffect, useState } from 'react'
import { exercicePart, ExercicePartType } from '../../../server/defs'
import LoadingIcon from '../components/LoadingIcon'

type pageState = 'not-started-yet' | 'ongoing' | 'correcting' | 'corrected' | 'finished'
type exerciceData = {
  exercice_id: string;
  seed: number[];
  parts: exercicePart[];
}[]

export default function ExercicePage() {
  const { exercice_id } = useParams()
  const maxQuestionIndex = 2
  const [questionIndex, setQuestionIndex] = useState(0)
  const [pageState, setPageState] = useState<pageState>('not-started-yet')
  const [questions, setQuestionsData] = useState<exerciceData>([])
  const [currentInputs, setCurrentInputs] = useState<{ [key: string]: string }>({})
  const [exerciceCorrections, setExerciceCorrections] = useState([])

  useEffect(() => {
    fetch(`http://localhost:1230/api/generate-exercices/${exercice_id}`)
      .then((res) => res.json())
      .then((questionParts) => {
        console.log(questionParts)
        setQuestionsData(questionParts)
      })
  }, [])

  useEffect(() => {
    if (pageState === 'ongoing') {
      setCurrentInputs({})
    } else if (pageState === 'correcting') {
      const question = questions[questionIndex]


      fetch(`http://localhost:1230/api/validate-answers`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          exercice_id: question.exercice_id,

        }
      })

    }
  }, [pageState])
  if (!questions.length) return <LoadingIcon />
  switch (pageState) {
    case 'not-started-yet':
      return <button onClick={() => setPageState('ongoing')}>Start</button>
    case 'ongoing':
    case 'correcting':
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
                case ExercicePartType.Input:
                  let id = `input-${questionIndex}-${i}`
                  let currentInput = currentInputs[id]
                  return (
                    <input
                      key={id}
                      type='text'
                      value={currentInput}
                      onChange={(e) => setCurrentInputs(currentInputs => {
                        currentInputs[id] = e.target.value
                        return currentInputs
                      })}
                      disabled={pageState !== 'ongoing'}
                      onKeyDown={(e) => (e.key !== 'Enter' ? null : setPageState('correcting'))}
                    />
                  )

                case ExercicePartType.Text:
                  return <span key={`text-${questionIndex}-${i}`}>{questionPart.text}</span>
              }
            })
          )}
          <Buttons
            pageState={pageState}
            setPageState={setPageState}
            questionIndex={questionIndex}
            setQuestionIndex={setQuestionIndex}
            maxQuestionIndex={maxQuestionIndex}
          />
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
export function Buttons({
  pageState,
  setPageState,
  questionIndex,
  setQuestionIndex,
  maxQuestionIndex
}: {
  pageState: pageState,
  setPageState: Dispatch<pageState>,
  questionIndex: number
  setQuestionIndex: Dispatch<number>,
  maxQuestionIndex: number
}) {
  switch (pageState) {
    case 'ongoing':
      return <button onClick={() => setPageState('correcting')}>Confirm</button>
    case 'correcting':
      return <button disabled>Correcting...</button>
    case 'corrected':
      if (questionIndex < maxQuestionIndex) {
        return <button onClick={() => {
          setPageState('ongoing');
          setQuestionIndex(questionIndex + 1);
        }}>Next</button>
      } else {
        return <button onClick={() => setPageState('finished')}>Finish</button>
      }
  }
}