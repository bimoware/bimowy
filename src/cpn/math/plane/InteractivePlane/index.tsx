"use client"

import { useEffect, useState } from "react";
import Plane from "../Plane";
import { AnyPlaneElementData, defaultRange, Ranges } from "..";
import LineSplit from "./LineSplit";
import ElementSection from "./ElementSection";
import RangesSection from "./RangesSection";

export default function InteractivePlane() {
	const [elems, setElems] = useState<Record<string, AnyPlaneElementData>>({})
	const [ranges, setRanges] = useState<Ranges>(defaultRange)
	const [nElements, setNElements] = useState(0)

	useEffect(() => {
		setNElements(prev => prev + 1)
	}, [elems.length])
	return <div className="flex">
		<section className="h-full flex justify-center grow">
			<div>
				<Plane {...{ elems, ranges }} />
			</div>
		</section>
		<section className="h-screen p-4 right-0 shrink-0">
			<section className="w-64 
			bg-white/5
			flex flex-col gap-2
			overflow-y-auto
			p-4">
				<LineSplit label={"Range"} onReset={() => { setRanges(defaultRange) }}
					resetable={JSON.stringify(ranges) != JSON.stringify(defaultRange)} />
				<RangesSection {...{ ranges, setRanges }} />
				<LineSplit label={"Elements"} onReset={() => { setElems({}) }} resetable={Object.keys(elems).length > 0} />
				<ElementSection {...{ elems, setElems, nElements, setNElements }} />
			</section>
		</section>
	</div>
}
