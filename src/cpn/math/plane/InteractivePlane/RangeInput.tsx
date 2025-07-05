import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { Ranges } from ".."
import { rangeInputs } from "./util"

export default function RangeInput({ ranges, setRanges, id, i }: {
	ranges: Ranges
	setRanges: Dispatch<SetStateAction<Ranges>>
	id: 'x' | 'y'
	i: number
}) {
	const [wrong, setIsWrong] = useState(false)

	useEffect(() => {
		console.log({ wrong })
	}, [wrong])

	return <input
		{...(wrong && { "data-wrong": true })}
		className="data-wrong:!outline-red-500 data-wrong:!bg-red-500/10 duration-150"
		type="text"
		defaultValue={ranges[id][i]}
		onBlur={(e) => {
			e.target.value = String(ranges[id][i])
			setIsWrong(false)
		}}
		onChange={(e) => {
			const newValue = Number(e.target.value)
			if (isNaN(newValue)) {
				setIsWrong(true)
			} else {
				setIsWrong(false)
				setRanges(prev => rangeInputs[id][i](prev, newValue))
			}
		}}
	/>
}
