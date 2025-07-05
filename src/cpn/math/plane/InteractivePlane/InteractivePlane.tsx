"use client"

import { useState } from "react";
import Plane from "../Plane";
import { ElemProps, Ranges } from "..";
import LineSplit from "./LineSplit";
import ElementSection from "./ElementSection";
import RangesSection from "./RangesSection";

export default function InteractivePlane() {
	const [elems, setElems] = useState<ElemProps[]>([])
	const [ranges, setRanges] = useState<Ranges>({ x: [-6, 6], y: [-6, 6] })

	return <section className="w-full h-full flex">
		<section className="w-full
		flex justify-center">
			<div>
				<Plane {...{ elems, ranges }} />
			</div>
		</section>
		<section className="w-1/3 bg-white/5 p-4 flex flex-col gap-2 overflow-y-scroll">
			<LineSplit label={"Range"} />
			<RangesSection {...{ ranges, setRanges }} />
			<LineSplit label={"Elements"} />
			<ElementSection {...{ elems, setElems }} />
		</section>
	</section>
}
