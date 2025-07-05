import { Dispatch, SetStateAction } from "react"
import { Ranges } from ".."
import { rangeInputs } from "./util"
import RangeInput from "./RangeInput"
import Latex from "react-latex-next"

export default function RangesSection({ ranges, setRanges }: {
	ranges: Ranges,
	setRanges: Dispatch<SetStateAction<Ranges>>
}) {
	return <>
		{
			Object.entries(rangeInputs)
				.map(([id]) => <div key={id} className="flex gap-2 items-center justify-center">
					<RangeInput {...{ ranges, setRanges }} id={id as "x" | "y"} i={0} />
					<Latex>{`$\\leq ${id} \\leq$`}</Latex>
					<RangeInput {...{ ranges, setRanges }} id={id as "x" | "y"} i={1} />
				</div>)
		}
	</>
}