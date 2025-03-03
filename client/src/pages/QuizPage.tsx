import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useWindowSize } from 'react-use'
import Confetti from 'react-confetti'

interface questionPart {
    type: string;
    answer: string;
    title: string;
}

export default function QuizPage() {
    const params = useParams();
    const [confettiState, setConfettiState] = useState(false)
    const { width, height } = useWindowSize()
    const [state, setState] = useState<
        "notStarted" | "inProgress" | "corrected"
    >("notStarted");
    const [questions, setQuestions] = useState<questionPart[][]>([]);

    useEffect(() => {
        fetch(`http://localhost:5000/quiz/${params.quizid}`)
            .then((res) => res.json())
            .then((questions) => setQuestions(questions))
            .catch((err) => console.error("Error:", err));
    }, [params.quizid]);

    // When correcting, loop through the inputs using their assigned IDs.
    const handleCorrect = () => {
        if (state === "corrected") {
            return setState('inProgress')
        }
        setState("corrected");
        let allCorrect = true;
        let inputIndex = 0;
        questions.forEach((questionGroup) => {
            questionGroup.forEach((q) => {
                if (q.type === "input") {
                    const inputElement = document.getElementById(`input-${inputIndex}`) as HTMLInputElement;
                    if (inputElement) {
                        const isCorrect = inputElement.value.trim() == q.answer;
                        inputElement.style.backgroundColor = isCorrect ? "#008236" : "#c10007";
                        inputIndex++;
                    }
                }
            });
        });
        if (allCorrect) {
            setConfettiState(true)
        }
    };

    // We'll use a counter to assign unique IDs to our inputs.
    let inputCounter = 0;

    switch (state) {
        case "notStarted":
            return (
                <button onClick={() => setState("inProgress")}>Start Quiz</button>
            );
        case "inProgress":
        case "corrected":
            return <>
                {
                    confettiState
                    && <Confetti
                        width={width}
                        height={height}
                        numberOfPieces={100}
                        gravity={1.5}
                        recycle={false}
                    />}
                <div className="flex flex-col gap-2">
                    {questions.map((questionGroup, groupIndex) => (
                        <div key={groupIndex} className="flex text-big font-mono">
                            {questionGroup.map((q, index) => {
                                if (q.type === "input") {
                                    const currentId = `input-${inputCounter}`;
                                    inputCounter++;
                                    return (
                                        <div key={index} className="flex items-center">
                                            {q.title && (
                                                <h3 className="mr-2 p-1">{q.title} = </h3>
                                            )}
                                            <input
                                                id={currentId}
                                                className={`w-12 rounded-sm p-1 
                                                    ${state === "corrected" ? "opacity-50 cursor-not-allowed" : ""}`}
                                                disabled={state === "corrected"}
                                            />
                                        </div>
                                    );
                                }
                                return null;
                            })}
                        </div>
                    ))}
                    {
                        <button onClick={handleCorrect} className={`w-fit`}>
                            {state === "corrected" ? "Try again" : "Correct"}
                        </button>
                    }
                </div>
            </>
        default:
            return null;
    }

}
