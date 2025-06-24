import { Exercise } from "./ExercisePage"
import { getExerciseCorrections } from "./util"

export function End({ exercises }: { exercises: Exercise }) {
	const corrections = getExerciseCorrections(exercises)
	return <>
		<div className="my-4 w-full h-full flex items-center justify-center">
			<h1 className="!text-6xl">
				Score: {corrections.subtotal}/{corrections.total}
				{corrections.worthShowing && <span className="ml-2 text-2xl font-normal tracking-tighter">({corrections.exactScore})</span>}
			</h1>
		</div>
		<div className="w-full flex flex-wrap gap-2">
			{
				corrections.texts.map((exerciseCorrection, i) => {
					return <div
						key={i}
						className="
						bg-black/10 dark:bg-white/10
						w-fit p-3 rounded-xl
						outline
						outline-black/10 dark:outline-white/10
				">
						{exerciseCorrection.map((inputCorrection, i) => {
							return <p key={i}>
								{inputCorrection.emoji} {inputCorrection.extra} +{inputCorrection.score}
							</p>
						})}
					</div>
				})
			}
		</div>
	</>
}