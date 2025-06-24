"use client";
import { angles } from "@util/angles";
import { formatNumber } from "@util/format";
import { CSSProperties, SVGAttributes, useEffect, useRef, useState } from "react";

export default function TrigonometricCircle() {
	const [angle, setAngle] = useState(0);
	const path = getPath(angle);
	const fullCirclepath = getPath(360);
	const isRadWhole = angles.some(data => angle == data.deg)
	const paths: SVGAttributes<SVGPathElement>[] = [
		{ id: "part", strokeWidth: 5, d: path, fill: "white", fillOpacity: 0.1 },
		{ id: "bg-full", strokeWidth: 5, d: fullCirclepath, opacity: 0.1 }
	]
	const snapPoints: CSSProperties[] = [
		{},
		{ width: "2px", height: "0.3rem", opacity: 0.8 },
		{ width: "3px", height: "0.5rem", opacity: 0.5 }
	]

	const numberInputRef = useRef<HTMLInputElement>(null)
	useEffect(() => {
		if (
			!Number.isNaN(Number(angle))
			&& numberInputRef.current
		) numberInputRef.current.value = "" + angle
	}, [angle])

	return (
		<>
			<div className="aspect-square w-36">
				<svg
					fill="none"
					viewBox="0 0 60 60"
					className="w-full h-full"
				>
					{
						paths.map(p => <path
							key={p.id}
							strokeWidth={5}
							stroke="white"
							strokeLinecap="round"
							strokeLinejoin="round"
							{...p} />)
					}
				</svg>
			</div>
			<div className="flex w-full justify-between items-center flex-wrap gap-5">
				{/* Degree Input*/}
				<div className="flex justify-center items-center min-w-20">
					<input
						ref={numberInputRef}
						type="text"
						className="text-md mx-0.5"
						defaultValue={angle}
						onChange={e => !Number.isNaN(Number(e.target.value)) && setAngle(+e.target.value)}
					/><span className="-translate-x-3 relative">°</span>
				</div>
				{/* Slider */}
				<div className="relative w-full mx-3">
					{/* Marks BELOW */}
					<div className="absolute bottom-0 left-0 w-full h-0.5 bg-transparent z-0">
						{angles.map((data) => (
							<div
								key={data.deg}
								style={{
									left: `${(data.deg / 360) * 100}%`,
									translate: "0 -0.4rem",
									...(data.deg === angle
										? ({ width: "3px", height: "0.7rem", opacity: 1, scale: 1.05, translate: "0 -0.4rem" })
										: snapPoints[data.type])
								}}
								className="absolute -translate-x-1/2 bg-white opacity-50 rounded-full duration-150"
							/>
						))}
					</div>

					{/* Slider ABOVE */}
					<input
						className="w-full accent-white relative z-10"
						type="range"
						min="0"
						max="360"
						value={angle}
						onChange={(e) => {
							let val = +e.target.value;
							const snapPoints = angles.map((data) => data.deg);
							const snapThreshold = 3;
							const snapped = snapPoints.find(p => Math.abs(p - val) <= snapThreshold);
							if (snapped !== undefined) val = snapped;
							setAngle(val);
						}}
					/>
				</div>

				{/* Radian equivalent */}
				<div className="flex justify-center min-w-25">
					<input
						disabled
						type="text"
						className="text-md"
						value={`${isRadWhole ? "=" : "≃"} ${formatNumber(convertToRad(angle) / Math.PI)}π`}
					/>
				</div>
			</div>
			<div
				className="flex items-center justify-center gap-2 w-full flex-wrap">
				{
					angles
						.map(data => <div
							key={data.deg}
							data-selected={angle === data.deg}
							className={`px-2 py-1 bg-white/5 rounded-xl
							select-none hover:scale-105 cursor-pointer
							duration-150
							data-[selected=true]:bg-neutral-200 data-[selected=true]:text-black 
							data-[selected=true]:shadow-sm data-[selected=true]:font-bold
							data-[selected=true]:-translate-y-1
							data-[selected=true]:scale-105`}
							onClick={(() => setAngle(data.deg))}>
							<span>{data.deg}°</span>
							<span className="text-sm opacity-75"> ( {data.rad.value} )</span>
						</div>)

				}
			</div>
		</>
	);
}


function getPath(angle: number) {
	if (angle != 0 && angle == 360) angle = 359
	angle = angle % 360
	const radius = 25;

	const centerX = 30;
	const centerY = 30;
	const startX = centerX + radius;
	const startY = centerY;

	// Use negative angle for counter-clockwise rotation
	const rad = convertToRad(-angle)

	// Calculate endpoint using negative angle
	const endX = centerX + radius * Math.cos(rad);
	const endY = centerY + radius * Math.sin(rad);

	const endXStr = endX.toPrecision(5);
	const endYStr = endY.toPrecision(5);

	// Keep largeArc calculation based on original angle
	const largeArc = angle > 180 ? 1 : 0;
	// Set sweep flag to 0 for counter-clockwise
	const path = `
			M ${centerX},${centerY}
			L ${startX},${startY}
			A ${radius},${radius} 0 ${largeArc} 0 ${endXStr},${endYStr}
			Z`;

	return path;
}

function convertToRad(angle: number) {
	return angle / 180 * Math.PI;
}