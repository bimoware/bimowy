"use client";

import { GeneratedExercise } from "@/app/api/defs";
import { useParams } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

type PageState =
    'not-yet' // The user has not started the exercises yet
    | 'answering' // The user is currently answering the exercises
    | 'checking' // Currently checking the answers via the server API 
    | 'checked' // The server API responded and the correction is showing 
    | 'completed' // The user has finished the exercises

type ExerciseData = {
    name: string,
    desc: string,
    id: string
}
export default function ExercisePage() {
    const params = useParams()
    const exerciseId = params["exercise_id"]!

    const [exercises, setExercises] = useState<GeneratedExercise[]>()
    const [pageState, setPageState] = useState<PageState>('not-yet');
    const [exerciseData, setExerciseData] = useState<ExerciseData>()
    const [exerciseIndex, setExerciseIndex] = useState(0)

    useEffect(() => {
        fetch('/api/generate/', {
            method: 'POST',
            body: JSON.stringify({ exercise_id: exerciseId })
        })
            .then((res) => res.json())
            .then((res) => {
                console.log(res)
                const { name, desc, id }: { name: string, desc: string, id: string } = res
                setExerciseData({ name, desc, id })
                setExercises(res.exercises)
            })
    }, [exerciseId]);

    if (!exercises) return <span>Not yet...</span>
    if (pageState == "completed") return <span>Finished.</span>
    return <div className="grow flex m-4 gap-4">
        <div className="grow-2 flex flex-col gap-5 items-center">
            <Title {...{ exerciseData, exercises, exerciseIndex, pageState }} />
            <div
                className="grow w-full bg-neutral-900 rounded-3xl p-4">
                <Context
                    {...{ exerciseData, exercises, exerciseIndex, pageState }}
                />
            </div>
        </div>
        <div className="grow bg-neutral-900 rounded-3xl p-4">
            <Controls
                {...{ exerciseData, exercises, setPageState, setExerciseIndex, pageState, exerciseIndex }}
            />
        </div>
    </div>
}

// The title on top of the context of the exercise
// Shows the name (& on hover the description), the number of questions and on what question we are
function Title({ exerciseData, exercises, exerciseIndex, pageState }: {
    exerciseData: ExerciseData | undefined,
    exercises: GeneratedExercise[],
    exerciseIndex: number,
    pageState: PageState,
}) {
    return exerciseData
        ? <h1
            className="mt-2 ml-4"
            title={exerciseData.desc}>
            {exerciseData.name}
            {
                !exerciseData
                    ? <></>
                    : pageState == "not-yet"
                        ? ` - ${exercises.length} Questions`
                        : ` - Question ${exerciseIndex + 1}/${exercises.length}`
            }
        </h1>
        : <></>
}

// Inputs & Buttons to interact with the exercise (input an answer, confirm, try again, go to the next exercise)
function Controls({ exerciseData, exercises, setPageState, setExerciseIndex, pageState, exerciseIndex }: {
    exerciseData: ExerciseData | undefined,
    exercises: GeneratedExercise[],
    pageState: PageState,
    setPageState: Dispatch<SetStateAction<PageState>>,
    setExerciseIndex: Dispatch<SetStateAction<number>>,
    exerciseIndex: number
}) {
    return exerciseData
        ? <div className="flex flex-col gap-4">
            <input size={2} className="bg-neutral-800 p-2 rounded-xl focus:outline-0 text-xl" />
            {
                pageState == "answering"
                    ? <></>
                    : <button onClick={() => setPageState('answering')}>Start</button>
            }
            {
                exerciseIndex < exercises.length - 1
                    ? <button onClick={() => setExerciseIndex(prev => prev + 1)}>Next</button>
                    : exerciseIndex == exercises.length - 1
                        ? <button onClick={() => setPageState('completed')}>Finish</button>
                        : <></>
            }
        </div>
        : <></>

}
function Context({ exerciseData, exercises, exerciseIndex, pageState }: {
    exerciseData: ExerciseData | undefined,
    exercises: GeneratedExercise[],
    exerciseIndex: number,
    pageState: PageState
}) {
    if (!exercises) return <>No exercices. (Inside context)</>
    if (!exercises[exerciseIndex]) return <>Exercice not found.</>
    if (pageState == "not-yet") return <>Waiting to start...</>
    return exerciseData
        ? exercises[exerciseIndex].context
            .map((text, i) => <h1 key={i}>{text}</h1>)
        : <></>
}