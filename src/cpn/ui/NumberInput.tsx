"use client"

import { useEffect, useRef, useState } from "react"

type Props = {
	value: number,
	max?: number,
	min?: number,
	setValue: (v: number) => void
	controls?: boolean
}
export default function NumberInput({ value, setValue, max, min, controls = true }: Props) {
	const maxValid = typeof max === "number"
	const minValid = typeof min === "number"

	const [wrong, setIsWrong] = useState(false)
	const [isActive, setIsActive] = useState(false)
	const inputRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		if (inputRef.current && !isActive) inputRef.current.value = String(value)
	}, [value])


	return <div
		{...(wrong && { "data-wrong": true })}
		className="
		flex items-center justify-center
		bg-black/5
		py-[1px]
		rounded-lg
		outline has-focus-within:outline-2
		outline-white/20 has-focus-within:outline-white/50
		duration-150
		overflow-clip
		data-wrong:!outline-red-500 data-wrong:!bg-red-500/10
		group
		">

		{
			controls && <SideButton id='-'
				disabled={minValid && value == min}
				onClick={() => { setValue(value - 1) }} />
		}

		<input ref={inputRef} type="text" defaultValue={value}
			className="rounded-md
			focus:outline-none"
			onBlur={(e) => {
				e.target.value = String(value)
				setIsWrong(false)
				setIsActive(false)
			}}
			onChange={(e) => {
				setIsActive(true)
				const newValue = +Number(e.target.value).toFixed(2)
				if (
					isNaN(newValue) ||
					(maxValid && newValue > max) ||
					(minValid && newValue < min)
				) {
					setIsWrong(true)
				} else {
					setIsWrong(false)
					setValue(newValue)
				}
			}}
		/>

		{
			controls && <SideButton id='+'
				disabled={value == max}
				onClick={() => { setValue(value + 1) }} />
		}

	</div>
}

function SideButton({ id, onClick, disabled }: { id: string, onClick: VoidFunction, disabled: boolean }) {
	return <button {...{ onClick, disabled }}
		tabIndex={-1}
		className="
		duration-150
		opacity-50 focus:opacity-70 focus:scale-110
		focus:outline-none
		px-1 pb-0.5
		select-none cursor-pointer
		hover:scale-105">{id}</button>
}