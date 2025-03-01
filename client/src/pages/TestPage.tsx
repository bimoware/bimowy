import { useEffect, useState } from "react";
import LoadingIcon from "../components/LoadingIcon";

export default function TestPage() {
    const [data, setData] = useState<null | string[]>(null);

    useEffect(() => {
        fetch("http://localhost:5000/api/")
            .then((res) => res.json())
            .then((data: string[]) => setData(data))
            .catch((err) => console.error("Error:", err));
    }, []);

    return <span>{
        !data
            ? <LoadingIcon/>
            : data.map(name => <h2>{name}</h2>)
    }</span>
}
