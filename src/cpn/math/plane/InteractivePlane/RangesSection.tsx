"use client"
import { Dispatch, SetStateAction } from "react"
import { Ranges } from ".."
import { rangeInputs } from "./util"
import NumberInput from "@cpn/ui/NumberInput"
import { CompareIcon } from "@cpn/icons/MathSymbolIcon"

export default function RangesSection({ ranges, setRanges }: {
	ranges: Ranges,
	setRanges: Dispatch<SetStateAction<Ranges>>
}) {
	return <>
		{
			Object.entries(rangeInputs)
				.map(([id, fixInputs]) => {
					const range = ranges[id as keyof typeof rangeInputs]
					return <div key={id} className="flex gap-2 items-center justify-center">
						<NumberInput value={range[0]} max={range[1]} min={-20}
							setValue={(v) => setRanges(prev => fixInputs[0](prev, v))}
						/>
						<CompareIcon symbol="<=" />
						{id}
						<CompareIcon symbol="<=" />
						<NumberInput value={range[1]} min={range[0]} max={20}
							setValue={(v) => setRanges(prev => fixInputs[1](prev, v))}
						/>
					</div>
				})
		}
	</>
}