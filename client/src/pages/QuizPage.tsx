import { useEffect, useState } from "react"
import { useParams } from "react-router"

interface questionPart {
    type: string,
    answer: string,
    title: string
}
export default function QuizPage() {
    const params = useParams();
    const [questions, setQuestions] = useState<questionPart[][]>([])
    const [questionIndex, setQuestionIndex] = useState<number>(-1)

    useEffect(() => {
        fetch(`http://localhost:5000/quiz/${params.quizid}`)
            .then((res) => res.json())
            .then((questions) => setQuestions(questions))
            .catch((err) => console.error("Error:", err));
    }, []);

    if (questionIndex == -1) return <button
        onClick={() => setQuestionIndex(0)}>Start</button>
    const questionParts = questions[questionIndex]
    console.log(questions)
    return questionParts.map((q) => {
        if (q.type == "input") {
            return <>
                {
                    q.title
                        ? <span>{q.title}: </span>
                        : <></>
                }
                <input type="number"></input>
            </>
        }
    })
}