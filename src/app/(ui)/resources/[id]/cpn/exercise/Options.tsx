import { OptionType } from "@/lib/resources";
import { ReactNode } from "react";
import { UngeneratedExerciseCtx } from "./extra";
import NumberInput from "@cpn/ui/NumberInput";

export function Options({ state, setState }: UngeneratedExerciseCtx) {
	if(state.step !== "options") return;
	return Object.entries(state.apiOptions)
		.map(([id, option]) => {
			const { type, title } = option
			switch (type) {
				case OptionType.Number:
					const [numberMin,numberMax] = [option.min,option.max]
					const numberValue = state.userOptionValues[id] as unknown as number
					return <OptionDiv key={id} {...{ title }}>
						<input
							{...{ type }}
							min={numberMin}
							max={numberMax}
							value={numberValue}
							onChange={(e) => {
								const value = e.target.value;
								setState(prev => {
									const newUserOptionValues = { ...prev.userOptionValues }
									newUserOptionValues[id] = value
									return { ...prev, userOptionValues: newUserOptionValues };
								})
							}} />
					</OptionDiv>
				case OptionType.Interval:
					const [intervalMin,intervalMax] = option.defaultValue
					const intervalValue = state.userOptionValues[id] as [number, number]
					return <OptionDiv key={id} {...{ title }}>
						<span>{"["}</span>
						<NumberInput
							value={intervalValue[0]}
							setValue={(newValue) => {
								if (newValue < intervalMin || newValue >= intervalValue[1]) return;
								setState(prev => {
									const newUserOptionValues = { ...prev.userOptionValues }
									newUserOptionValues[id] = [newValue, intervalValue[1]]
									return { ...prev, userOptionValues: newUserOptionValues };
								})
							}}
						/>
						<span>{";"}</span>
						<NumberInput
							value={intervalValue[1]}
							setValue={(newValue) => {
								if (newValue > intervalMax || newValue <= intervalValue[0]) return;
								setState(prev => {
									const newUserOptionValues = { ...prev.userOptionValues }
									newUserOptionValues[id] = [intervalValue[0], newValue]
									return { ...prev, userOptionValues: newUserOptionValues };
								})
							}}
						/>
						<span>{"]"}</span>
					</OptionDiv>
				case OptionType.Checkboxes:
					const checkboxesOptions = option.options
					const checkboxesValues = state.userOptionValues[id] as string[]
					return <OptionDiv key={id} {...{ title }}>
						<div className="inline-flex gap-2">
							{checkboxesOptions.map(o => <div
								key={o}
								data-included={checkboxesValues.includes(o)}
								className="p-1 px-2
									rounded-xl
									cursor-pointer duration-150
									bg-white/5 hover:scale-105
									data-[included=true]:!bg-white/50
									data-[included=true]:*:text-black
									data-[included=true]:!font-bold
									"
								onClick={() => {
									setState(prev => {
										const newUserOptionValues = { ...prev.userOptionValues }
										const currentValues = prev.userOptionValues[id] as string[]

										if (currentValues.includes(o)) {
											newUserOptionValues[id] = currentValues.filter(option => option !== o)
										} else {
											newUserOptionValues[id] = [...currentValues, o]
										}

										return { ...prev, userOptionValues: newUserOptionValues };
									})
								}}>
								{o}
							</div>
							)}
						</div>
					</OptionDiv>
				case 'radio':
					const radioOptions = option.options
					const radioValue = state.userOptionValues[id] as string
					return <OptionDiv key={id} {...{ title }}>
						<div className="inline-flex gap-2">
							{radioOptions.map(o => <div
								key={o}
								className={`p-1 px-2
								rounded-xl
								cursor-pointer duration-150
								hover:scale-105
								${radioValue == o
										? "!bg-white/20 text-white px-3 font-bold"
										: "bg-white/5 "}
								`}
								onClick={() => {
									setState(prev => {
										const newUserOptionValues = { ...prev.userOptionValues }
										newUserOptionValues[id] = o
										return { ...prev, userOptionValues: newUserOptionValues };
									})
								}}>{o}</div>
							)}
						</div>
					</OptionDiv>
			}
		})
}


function OptionDiv({ children, title }: { children: ReactNode, title: string }) {
	return <div className="
	bg-black/5 dark:bg-white/5
	rounded-2xl p-2 px-5
	flex items-center gap-2
	w-fit
	text-4xl">
		<span>{title}</span>
		{children}
	</div>
}