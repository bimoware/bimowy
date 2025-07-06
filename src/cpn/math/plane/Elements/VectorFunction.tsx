import { PlaneElementEnum, PlaneElementProps } from ".."
import FunctionPlot from "../Meta/FunctionPlot"

export default function VectorFunction({ ranges, f, interval, color }: PlaneElementProps<PlaneElementEnum.VectorFunction>) {
	return <FunctionPlot {...{ ranges, f, interval, color }}/>
}
