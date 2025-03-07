import { useEffect, useState } from "react";
import LoadingIcon from "../components/LoadingIcon";
import { Card } from "./DashboardPage";
import { subject } from "../defs";


export default function ExercicesListPage() {
    const [data, setData] = useState<null | subject[]>(null);

    useEffect(() => {
        fetch("http://localhost:60000/subjects/")
            .then((res) => res.json())
            .then((data: subject[]) => setData(data))
            .catch((err) => console.error("Error:", err));
    }, []);

    return data
        ? <div className="flex gap-4">
            {data.map(subject => <Card
                href={`/exercice/${subject.id}`}
                key={subject.id}
                title={subject.name}
                content={subject.description}
            />)}
        </div>
        : <LoadingIcon />
}