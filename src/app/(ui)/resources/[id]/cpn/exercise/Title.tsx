import { useTranslations } from "next-intl"
import { getExerciseCorrections } from "./util"
import { Exercise, PageStep } from "./ExercisePage"

export function Title({ pageStep, exercises }: {
	pageStep: PageStep
	exercises?: Exercise
}) {
	const t = useTranslations('ResourcePage')
	switch (pageStep) {
		case "options":
			return <h1>{t('Options')}</h1>
		case "end":
			return <h1>{t('Finished')}</h1>
		case "normal":
			if (!exercises) return;
			return <h1>
				<div className="inline-flex gap-1">
					{
						getExerciseCorrections(exercises)
							.texts
							.map((correction, i) => <div key={i}
								data-current={exercises.index == i}
								className="
									p-0.5
									inline-flex items-center justify-center
									bg-black/50
									outline-1 outline-white/5
									rounded-sm
									data-[current=true]:outline-white/50
									data-[current=true]:outline-dashed
									data-[current=true]:outline-2">
								{correction.map(c => c.emoji)}
							</div>)
					}
				</div>
			</h1>
	}
}