import { PlaneElementEnum, PlaneElementProps } from ".."
import FunctionPlot from "../Meta/FunctionPlot"

export default function ScalarFunction({ ranges, f, color }: PlaneElementProps<PlaneElementEnum.ScalarFunction>) {
	return <FunctionPlot {...{ ranges, color }} f={(t) => [t, f(t)]} />
}
