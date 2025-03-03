import { useEffect, useState } from "react";
import LoadingIcon from "../components/LoadingIcon";
import { SubjectBloc } from "./DashboardPage";
import { subject } from "../defs";


export default function SubjectsPage() {
    const [data, setData] = useState<null | subject[]>(null);

    useEffect(() => {
        fetch("http://localhost:5000/subjects/")
            .then((res) => res.json())
            .then((data: subject[]) => setData(data))
            .catch((err) => console.error("Error:", err));
    }, []);

    return data
        ? <div className="flex gap-4">
            {data.map(subject => <SubjectBloc
                href={`/quiz/${subject.id}`}
                key={subject.id}
                title={subject.name}
                content={subject.description}
            />)}
        </div>
        : <LoadingIcon />
}