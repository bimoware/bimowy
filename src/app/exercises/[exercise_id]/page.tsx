"use client";

import { GeneratedExercise } from "@/app/api/defs";
import { useParams } from "next/navigation";
import { Dispatch, RefObject, SetStateAction, useEffect, useRef, useState } from "react";

type PageState =
    'not-yet' // The user has not started the exercises yet
    | 'answering' // The user is currently answering the exercises
    | 'correcting' // Currently correcting the answers via the server API 
    | 'corrected' // The server API responded and the correction is showing 
    | 'finished' // The user has finished the exercises

type ExerciseData = {
    name: string,
    desc: string,
    id: string
}
export default function ExercisePage() {
    const params = useParams()
    const exerciseId = params["exercise_id"]!

    const [exercises, setExercises] = useState<GeneratedExercise[]>()
    const [pageState, setPageState] = useState<PageState>('not-yet')
    const [exerciseData, setExerciseData] = useState<ExerciseData>()
    const [exerciseIndex, setExerciseIndex] = useState(0)

    // Create a ref array for inputs
    const inputs = useRef<{
        ref: HTMLInputElement | null;
        correct_on_first_try: boolean | null;
        correct: boolean | null;
    }[]>([]);


    // Generate questions
    useEffect(() => {
        fetch('/api/generate/', {
            method: 'POST',
            body: JSON.stringify({ exercise_id: exerciseId })
        })
            .then((res) => res.json())
            .then((res) => {
                const { name, desc, id }: { name: string, desc: string, id: string } = res
                setExerciseData({ name, desc, id })
                setExercises(res.exercises)
            })
    }, [exerciseId]);

    // Handle pageState when ENTER key is pressed
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                // if (inputs.current[0]?.ref && pageState == "answering") {
                //     const input = inputs.current[0].ref
                //     input.value = ""
                //     input.focus()
                //     input.select()
                // }
                if (pageState == "not-yet") setPageState('answering')
                else if (pageState == "answering") setPageState('correcting')
                else if (pageState == "corrected") {
                    if (exerciseIndex < exercises!.length - 1) {
                        setExerciseIndex(prev => prev + 1)
                        setPageState('answering')
                    } else setPageState('finished')
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [pageState, exerciseIndex, exercises]);


    // Handle pageState == "correcting"
    useEffect(() => {
        if (pageState !== 'correcting') return;
        const exercise = exercises?.[exerciseIndex]
        if (!exercise) return;
        const inputValues = inputs.current.map(input => input.ref?.value)
        const answers = exercise.inputs.map((input, index) => ({ id: input.id, value: inputValues[index] }));
        fetch('/api/validate/', {
            method: 'POST',
            body: JSON.stringify({ exercise_id: exerciseId, answers, seed: exercise.seed })
        })
            .then(res => res.json())
            .then((res: { id: string, is_correct: boolean }[]) => {
                setPageState('corrected');
                console.log({ inputs, res })
                inputs.current.forEach((inputObj) => {
                    if (!inputObj.ref) return;
                    const input = inputObj.ref;
                    const inputId = input.id;
                    const answer = res.find(answer => answer.id === inputId)!;
                    inputObj.correct = answer.is_correct;
                    if (inputObj.correct_on_first_try === null) {
                        inputObj.correct_on_first_try = inputObj.correct;
                    }
                    input.classList.toggle('outline-correct', inputObj.correct);


                });
            });
    }, [pageState, exercises, exerciseIndex, exerciseId]);

    if (!exercises) return <span>Not yet...</span>
    if (pageState == "finished") return <span>Finished.</span>
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
                {...{ exerciseData, exercises, setPageState, setExerciseIndex, pageState, exerciseIndex, inputs }}
            />
        </div>
    </div>
}

// Inputs & Buttons to interact with the exercise (input an answer, confirm, try again, go to the next exercise)
function Controls({ exerciseData, exercises, setPageState, setExerciseIndex, pageState, exerciseIndex, inputs }: {
    exerciseData: ExerciseData | undefined,
    exercises: GeneratedExercise[],
    setPageState: Dispatch<SetStateAction<PageState>>,
    setExerciseIndex: Dispatch<SetStateAction<number>>,
    exerciseIndex: number,
    pageState: PageState,
    inputs: RefObject<{
        ref: HTMLInputElement | null;
        correct_on_first_try: boolean | null;
        correct: boolean | null;
    }[]>
}) {
    if (!exerciseData) return <></>;
    if (pageState === "not-yet") return <button key="Start" onClick={() => setPageState('answering')}>Start</button>;

    const currentExercice = exercises[exerciseIndex];
    const controls = []; // Every input & button

    // Exercise inputs
    currentExercice.inputs.forEach((input, index) => {
        const currentInput = inputs.current[index];
        controls.push(
            <input
                ref={(el) => {
                    inputs.current[index] = {
                        ref: el,
                        correct: null,
                        correct_on_first_try: null
                    };
                }}
                disabled={currentExercice && pageState !== "answering" && currentInput?.correct !== null}
                onLoad={(ev) => { ev.currentTarget.focus(); ev.currentTarget.select() }}
                key={input.id+"-"+exerciseIndex}
                id={input.id}
                size={2}
                className="bg-neutral-800 p-2 rounded-xl focus:outline-0 text-xl"
            />
        );
    });

    // Confirm button (only when currently answering)
    if (pageState === "answering") {
        controls.push(
            <button key="Confirm" onClick={() => setPageState('correcting')}>Confirm</button>
        );
    }

    // Next button (only when exercise just got corrected)
    if (pageState === "corrected") {
        controls.push(
            <button key="retry" onClick={() => setPageState('answering')}>Try Again</button>
        );
        // Next button
        if (exerciseIndex < exercises.length - 1) {
            controls.push(
                <button
                    key="Next"
                    onClick={() => {
                        setExerciseIndex(prev => prev + 1);
                        setPageState('answering');
                    }}>
                    Next
                </button>
            );
        }
        // Or "Finish" if it's the last question
        else if (exerciseIndex === exercises.length - 1) {
            controls.push(
                <button onClick={() => setPageState('finished')}>Finish</button>
            );
        }
    }

    return (
        <div className="flex flex-col gap-4">
            {controls}
        </div>
    );
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
