import { PlaneElementEnum, PlaneProps } from "..";
import Circle from "./Circle";
import Point from "./Point";
import ScalarFunction from "./ScalarFunction";
import Vector from "./Vector";
import VectorFunction from "./VectorFunction";

export function PlaneElements({ elems, ranges }: PlaneProps) {
	return Object.entries(elems)
		.map(([id, config]) => {
			const extra = { id, ranges, elems }
			switch (config.type) {
				case PlaneElementEnum.Point:
					return <Point key={id} {...extra} {...config} />
				case PlaneElementEnum.Circle:
					return <Circle key={id} {...extra} {...config} />
				case PlaneElementEnum.Vector:
					return <Vector key={id} {...extra} {...config} />
				case PlaneElementEnum.ScalarFunction:
					return <ScalarFunction key={id} {...extra} {...config} />
				case PlaneElementEnum.VectorFunction:
					return <VectorFunction key={id} {...extra} {...config} />
			}
		})
} 