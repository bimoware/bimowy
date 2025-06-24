import { ExerciseBuilder } from "@api/lib/exercise";
import { APIOption, OptionType } from "@api/lib/option";
import { Dispatch, ReactNode, SetStateAction } from "react";

export function Options({ apiOptions, userOptionValues, setUserOptionValues }: {
	apiOptions?: ReturnType<ExerciseBuilder["serialize"]>["options"],
	userOptionValues?: Record<string, any>,
	setUserOptionValues: Dispatch<SetStateAction<Record<string, any>>>
}) {
	if (!apiOptions || !userOptionValues) return;
	return Object.entries<APIOption>(apiOptions).map(([id, option]) => {
		const { type, title } = option
		switch (type) {
			case OptionType.Number:
				const numberMin = option.min
				const numberMax = option.max
				const numberValue = userOptionValues[id] as number
				return <OptionDiv key={id}>
					<span>{title}:</span>
					<input
						{...{ type }}
						min={numberMin}
						max={numberMax}
						value={numberValue}
						onChange={(e) => {
							const value = e.target.value;
							setUserOptionValues(prev => {
								const newUserOptions = { ...prev }
								newUserOptions[id] = value
								return newUserOptions;
							})
						}} />
				</OptionDiv>
			// case OptionType.Boolean:
			// 	const booleanValue = userOptionValues[id] as boolean
			// 	return <OptionDiv key={id}>
			// 		<span>{title}? </span>
			// 		<Togglable
			// 			checked={booleanValue}
			// 			onChange={() => {
			// 				setUserOptionValues(prev => {
			// 					const newUserOptions = { ...prev }
			// 					newUserOptions[id] = !prev[id]
			// 					return newUserOptions;
			// 				})
			// 			}}
			// 		/>
			// 	</OptionDiv>
			case OptionType.Interval:
				const intervalValue = userOptionValues[id] as [number, number]
				return <OptionDiv key={id}>
					<span>{title}: </span>
					<input
						type="number"
						value={intervalValue[0]}
						onChange={(e) => {
							let value = Number(e.target.value);
							if (value < intervalValue[1]) setUserOptionValues(prev => {
								const newUserOptions = { ...prev }
								newUserOptions[id] = [value, prev[id][1]]
								return newUserOptions;
							})
						}} />
					<span> - </span>
					<input
						type="number"
						value={intervalValue[1]}
						onChange={(e) => {
							const value = Number(e.target.value);
							if (value > intervalValue[0]) setUserOptionValues(prev => {
								const newUserOptions = { ...prev }
								newUserOptions[id] = [prev[id][0], value]
								return newUserOptions;
							})
						}} />
				</OptionDiv>
			case OptionType.Checkboxes:
				const checkboxesOptions = option.options
				const checkboxesValues = userOptionValues[id] as string[]
				return <OptionDiv key={id}>
					<span>{title}: </span>
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
								setUserOptionValues(prev => {
									const newUserOptions = { ...prev }
									const currentValues = [...newUserOptions[id]]

									if (currentValues.includes(o)) {
										newUserOptions[id] = currentValues.filter(option => option !== o)
									} else {
										newUserOptions[id] = [...currentValues, o]
									}

									return newUserOptions
								})

							}}>{o}</div>
						)}
					</div>
				</OptionDiv>
			case 'radio':
				const radioOptions = option.options
				const radioValue = userOptionValues[id] as string
				return <OptionDiv key={id}>
					<span>{title}: </span>
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
								setUserOptionValues(prev => {
									const newUserOptions = { ...prev }
									newUserOptions[id] = o
									return newUserOptions
								})
							}}>{o}</div>
						)}
					</div>
				</OptionDiv>
		}
	})
}


function OptionDiv({ children }: { children: ReactNode }) {
	return <div className="
	bg-black/5 dark:bg-white/5
	rounded-2xl p-2 px-5
	flex items-center gap-2
	w-fit
	text-4xl">{children}</div>
}